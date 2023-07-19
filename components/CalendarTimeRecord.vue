<template>
    <EditTimeRecordModal
        v-model:open="modals.editTimeRecord.open"
        :record="timeRecord"
        @removed="emit('refresh-time-records')"
        @saved="emit('refresh-time-records')"
    />

    <div
        class="time-record px-2 py-1 min-h-[1.4rem] text-white rounded-lg cursor-pointer absolute overflow-hidden hover:scale-105 hover:min-h-[2.4rem] transition"
        :class="{
            'bg-indigo-500': timeRecord.status === TimeRecordStatus.STOPPED,
            'bg-orange-500': timeRecord.status === TimeRecordStatus.STARTED,
        }"
        :style="{
            left: stringifyCalc(leftOffset),
            top: stringifyCalc(topOffset),
            width: stringifyCalc(columnWidth),
            height: stringifyCalc(height),
            ...style,
        }"
        @click="editTimeRecord"
        @mouseover="hover = true"
        @mouseleave="hover = false"
    >
        <p class="text-gray-200 text-xs font-semibold">
            {{ dayjs(timeRecord.startAt).format('HH:mm') }}-{{ timeRecord.stopAt ? dayjs(timeRecord.stopAt).format('HH:mm') : '...' }}
        </p>

        <p
            class="text-gray-200 text-sm font-semibold"
        >
            {{ timeRecord.name ?? 'Untitled Time Record' }}
        </p>
    </div>
</template>

<script setup>
import dayjs from 'dayjs';

import TimeRecordStatus from '../enums/TimeRecordStatus';

const emit = defineEmits(['refresh-time-records']);

const props = defineProps({
    timeRecord: {
        type: Object,
        required: true,
    },
    style: {
        type: Object,
        default: () => ({}),
    },
});

const calendarContext = inject('CalendarContext');

const modals = ref({
    editTimeRecord: {
        open: false,
    },
});

function stringifyCalc(arr) {
    return `calc(${arr.join(' ')})`;
}

const columnWidth = computed(() => {
    const columnPercentage = 100 / calendarContext.columns.value;

    return ['(100% - 4.5rem)', '*', columnPercentage / 100];
});

const rowHeight = computed(() => {
    const rowPercentage = 100 / 24;

    return [stringifyCalc(['100%', '-', topLabelPadding]), '*', rowPercentage / 100];
});

const minuteHeight = computed(() => [stringifyCalc(rowHeight.value), '/', '60']);

const topLabelPadding = '3rem';

const leftOffset = computed(() => {
    const startAt = dayjs(props.timeRecord.startAt);
    const columnOffset = startAt.diff(calendarContext.startDate.value, 'days');

    return [stringifyCalc(columnWidth.value), '*', columnOffset, '+', '4.5rem'];
});

const topOffset = computed(() => {
    const startAt = dayjs(props.timeRecord.startAt);

    return [startAt.diff(startAt.startOf('day'), 'minutes'), '*', stringifyCalc(minuteHeight.value), '+', topLabelPadding];
});

const height = computed(() => {
    const startAt = dayjs(props.timeRecord.startAt);
    const stopAt = props.timeRecord.stopAt ? dayjs(props.timeRecord.stopAt) : dayjs();

    return [stopAt.diff(startAt, 'minutes'), '*', stringifyCalc(minuteHeight.value)];
});

function editTimeRecord() {
    modals.value.editTimeRecord = {
        open: true,
    };
}
</script>

<style scoped>
@keyframes scale-in {
    0% {
        transform: scale(.7);
        top: 0;
    }

    100% {
        transform: scale(1);
    }
}

.time-record {
    animation: scale-in .7s ease-in-out;
}
</style>