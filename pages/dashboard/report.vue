<template>
    <div class="container mx-auto py-20 px-12">
        <p class="text-gray-300 font-semibold">
            {{ calendarViewDate.format('MMMM D, YYYY') }}
        </p>

        <div class="mt-3 my-2">
            <div
                v-for="record in matchingTimeRecords"
                :key="record.id"
                class="bg-gray-700 px-3 py-2 rounded-lg"
            >
                <TipTapContent
                    :content="record.notes"
                />
            </div>
        </div>
    </div>
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
    return dayjs(record.startAt).isSame(calendarViewDate.value, 'day');
}));
</script>