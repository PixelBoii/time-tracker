<template>
    <div
        class="w-full bg-gray-800 relative grid divide-x divide-gray-700 h-full overflow-hidden"
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
                    {{ startDate.clone().add(index - 1, 'days').format('dddd') }} ({{ getHoursForDay(startDate.clone().add(index - 1, 'days')) }})
                </p>

                <div
                    class="h-6 w-6 rounded-full text-xs flex justify-center items-center text-white mx-auto mt-1 font-semibold"
                    :class="{
                        'bg-indigo-500': startDate.clone().add(index - 1, 'days').isSame(dayjs(), 'day'),
                    }"
                >
                    {{ startDate.clone().add(index - 1, 'days').format('D') }}
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
import { useInterval } from '@vueuse/core';
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
    startDate: {
        type: dayjs.Dayjs,
        default: () => dayjs(),
    },
});

// Date key that automatically increases every second. Used to force Vue to re-render the computed date values.
const dateKey = useInterval(1000);

const columns = computed(() => props.columns);
const startDate = computed(() => props.startDate);

function getHoursForDay(day) {
    // Re-render every second
    dateKey.value;

    const minutes = props.timeRecords
        .filter(record => dayjs(record.startAt).isSame(day, 'day'))
        .reduce((accumulator, record) => {
            const startAt = dayjs(record.startAt);
            const stopAt = record.stopAt ? dayjs(record.stopAt) : dayjs();

            const minutes = stopAt.diff(startAt, 'minute');

            return accumulator + minutes;
        }, 0);

    const hours = Math.floor(minutes / 60);

    const extraMinutes = minutes % 60;
    const extraMinutesString = extraMinutes < 10 ? `0${extraMinutes}` : extraMinutes;

    return `${hours}h${extraMinutesString !== '00' ? ` ${extraMinutesString}min` : ''}`;
}

provide('CalendarContext', {
    columns,
    startDate,
});
</script>
