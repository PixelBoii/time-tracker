<template>
    <Calendar :columns="7">
        <template #content>
            <CalendarTimeRecord
                v-for="timeRecord in timeRecords"
                :key="timeRecord.id"
                :time-record="timeRecord"
            />
        </template>
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