<template>
    <TimeRecordWeekView
        :time-records="timeRecords.data"
        @refresh-time-records="emit('refresh-time-records')"
    />
</template>

<script setup>
const emit = defineEmits(['refresh-time-records']);

defineProps({
    timeRecords: {
        type: Object,
        required: true,
    },
});

definePageMeta({
    pageTransition: {
        enterActiveClass: 'transition ease-out duration-300',
        enterFromClass: 'opacity-0 scale-95',
        enterToClass: 'opacity-100 scale-100',
        leaveActiveClass: 'transition ease-in duration-300',
        leaveFromClass: 'opacity-100 scale-100',
        leaveToClass: 'opacity-0 scale-95',
        mode: 'out-in',
    },
});
</script>