<template>
    <Calendar
        :columns="7"
        :time-records="calendarContext.timeRecords.value.data"
        :start-date="calendarViewDate.clone().startOf('week')"
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

const calendarContext = inject('CalendarDashboardContext');

const calendarViewDate = useCalendarViewDate();

const matchingTimeRecords = computed(() => calendarContext.timeRecords.value.data.filter(record => {
    return dayjs(record.startAt).isSame(calendarViewDate.value, 'week');
}));
</script>