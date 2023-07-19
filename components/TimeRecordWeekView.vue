<template>
    <Calendar
        :columns="7"
        :time-records="timeRecords"
    >
        <template #content>
            <CalendarTimeRecord
                v-for="timeRecord in matchingTimeRecords"
                :key="timeRecord.id"
                :time-record="timeRecord"
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

const matchingTimeRecords = computed(() => {
    return props.timeRecords.filter(record => {
        return dayjs(record.startAt).isSame(dayjs(), 'week');
    });
});
</script>