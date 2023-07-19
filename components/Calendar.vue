<template>
    <div
        class="w-full bg-gray-800 relative grid divide-x divide-gray-700 h-full"
        :style="{
            gridTemplateColumns: `max-content repeat(${columns}, minmax(0, 1fr))`,
        }"
    >
        <div class="flex flex-col w-[4.5rem]">
            <div class="h-[3rem]"></div>

            <div class="grid grid-rows-24 grow">
                <div
                    v-for="hour in 24"
                    :key="`hour-${hour}`"
                    class="flex items-start justify-center text-gray-200 text-sm font-semibold w-full"
                >
                    {{ dayjs().hour(hour - 1).format('HH') }}:00
                </div>
            </div>
        </div>

        <slot name="content" />

        <div
            v-for="index in columns"
            :key="`group-${index}`"
            class="flex flex-col"
        >
            <div class="h-[3rem]">
                <p class="text-gray-300 text-xs font-semibold text-center">
                    {{ dayjs().day(index - 1).format('dddd') }} ({{ getHoursForDay(dayjs().day(index - 1)) }}H)
                </p>

                <div class="bg-indigo-500 h-6 w-6 rounded-full text-xs flex justify-center items-center text-white mx-auto mt-1">
                    {{ dayjs().day(index - 1).format('D') }}
                </div>
            </div>

            <div class="grid grid-rows-24 grow">
                <div
                    v-for="hour in 24"
                    :key="`cell-${hour}`"
                    :class="{
                        'border-t border-gray-700': hour === 1,
                        'border-b border-gray-700': hour !== 24,
                    }"
                >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import dayjs from 'dayjs';

const props = defineProps({
    columns: {
        type: Number,
        required: true,
    },
    timeRecords: {
        type: Array,
        required: true,
    },
});

const columns = computed(() => props.columns);

function getHoursForDay(day) {
    const minutes = props.timeRecords
        .filter(record => dayjs(record.startAt).isSame(day, 'day'))
        .reduce((accumulator, record) => {
            const startAt = dayjs(record.startAt);
            const stopAt = record.stopAt ? dayjs(record.stopAt) : dayjs();

            const minutes = stopAt.diff(startAt, 'minute');

            return accumulator + minutes;
        }, 0);

    return Math.round(minutes / 60);
}

provide('CalendarContext', {
    columns,
});
</script>
