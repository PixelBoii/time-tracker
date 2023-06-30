<template>
    <EditTimeRecordModal
        v-model:open="modals.editTimeRecord.open"
        :record="modals.editTimeRecord.record"
        @removed="emit('refresh-time-records')"
        @saved="emit('refresh-time-records')"
    />

    <div class="w-full rounded-lg bg-gray-700">
        <div class="w-full px-6 py-4 border-b-2 border-gray-600">
            <p class="text-gray-100 font-semibold text-lg capitalize">
                {{ dayjs().format('dddd, MMMM D') }}
            </p>
        </div>

        <div class="w-full relative grid grid-cols-[max-content,_auto] grid-flow-col grid-rows-[repeat(294,_minmax(min-content,.1rem))] gap-x-4 px-6">
            <div class="w-full col-start-1 row-span-6 border-r-2 border-gray-600"></div>
            <div class="w-full col-start-2 row-span-6"></div>

            <div
                v-for="hour in 24"
                :key="`hour-${hour}`"
                class="w-full flex items-start justify-center pr-6 row-[span_12_/_span_12] text-gray-200 font-semibold border-r-2 border-gray-600 h-[2.4rem]"
            >
                {{ dayjs().hour(hour - 1).format('HH') }}:00
            </div>

            <div
                v-for="timeRecord in sortedTimeRecords"
                :key="timeRecord.id"
                class="px-2 py-1 bg-indigo-500 text-white rounded-lg cursor-pointer"
                :class="{
                    'flex items-center justify-between': !isBigEnough(timeRecord),
                }"
                :style="{
                    gridRowStart: getRowStart(timeRecord),
                    gridRowEnd: getRowEnd(timeRecord),
                }"
                @click="editTimeRecord(timeRecord)"
            >
                <p class="text-gray-200 text-sm font-semibold">
                    {{ dayjs(timeRecord.startAt).format('HH:mm') }}-{{ timeRecord.stopAt ? dayjs(timeRecord.stopAt).format('HH:mm') : '...' }}
                </p>

                <p
                    class="text-gray-200 font-semibold"
                    :class="{
                        'mt-1': isBigEnough(timeRecord),
                    }"
                >
                    {{ timeRecord.name ?? 'Untitled Time Record' }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
/**
 * 288 rows, 5 minutes each
 * 6 extra rows for space
 * total 294 rows
 * 1 hour = 12 rows
*/
import dayjs from 'dayjs';

const emit = defineEmits(['refresh-time-records']);

const props = defineProps({
    timeRecords: {
        type: Array,
        required: true,
    },
});

const sortedTimeRecords = computed(() => {
    return props.timeRecords.sort((a, b) => {
        return dayjs(a.startAt).isBefore(dayjs(b.startAt)) ? -1 : 1;
    });
});

const modals = ref({
    editTimeRecord: {
        open: false,
        record: null,
    },
});

function isBigEnough(timeRecord) {
    return dayjs(timeRecord.stopAt).diff(dayjs(timeRecord.startAt), 'minute') > 60;
}

function editTimeRecord(record) {
    modals.value.editTimeRecord = {
        open: true,
        record,
    };
}

function getFiveMinutes(date) {
    return date.hour() * 12 + Math.floor(date.minute() / 5) + 1;
}

function getRowStart(timeRecord) {
    return getFiveMinutes(dayjs(timeRecord.startAt));
}

function getRowEnd(timeRecord) {
    const stopAt = timeRecord.stopAt ? dayjs(timeRecord.stopAt) : null;

    // If it's the next day or later, make it span the whole day
    if (stopAt && stopAt.isAfter(dayjs(timeRecord.startAt).endOf('day'))) {
        return 'span 288';
    }

    if (stopAt) {
        return getFiveMinutes(stopAt);
    }

    return 'span 12';
}
</script>