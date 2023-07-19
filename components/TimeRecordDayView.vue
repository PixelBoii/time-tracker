<template>
    <Calendar
        :columns="1"
        :time-records="timeRecords"
        :start-date="calendarViewDate"
    >
        <template #content>
            <CalendarTimeRecord
                v-for="timeRecord in matchingTimeRecords"
                :key="timeRecord.id"
                :time-record="timeRecord"
                @refresh-time-records="emit('refresh-time-records')"
            />
        </template>
    </Calendar>
</template>

<script setup>
import dayjs from 'dayjs';

const emit = defineEmits(['refresh-time-records']);

const props = defineProps({
    timeRecords: {
        type: Array,
        required: true,
    },
});

const calendarViewDate = useCalendarViewDate();

const matchingTimeRecords = computed(() => {
    return props.timeRecords.filter(record => {
        return dayjs(record.startAt).isSame(dayjs(), 'day');
    });
});
</script>