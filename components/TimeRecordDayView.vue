<template>
    <Calendar :columns="1">
        <CalendarTimeRecord
            v-for="timeRecord in timeRecords"
            :key="timeRecord.id"
            :time-record="timeRecord"
            @refresh-time-records="emit('refresh-time-records')"
        />
    </Calendar>
</template>

<script setup>
const emit = defineEmits(['refresh-time-records']);

const props = defineProps({
    timeRecords: {
        type: Array,
        required: true,
    },
});
</script>