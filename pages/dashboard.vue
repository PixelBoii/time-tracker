<template>
    <div>
        <div class="flex items-center justify-between">
            <p class="text-white font-semibold text-2xl capitalize"> Welcome {{ user.username }}! </p>

            <Button
                type="button"
                color="red"
                @click="logout"
            >
                Logout
            </Button>
        </div>

        <div class="mt-6 w-full bg-gray-700 px-6 py-4 rounded-lg">
            <Button
                v-if="activeTimer"
                type="button"
                color="orange"
                @click="stopTimer"
            >
                Stop Time Tracker
            </Button>

            <Button
                v-else
                type="button"
                @click="startTimer"
            >
                Start Time Tracker
            </Button>
        </div>

        <div
            v-if="timeRecords && timeRecords.data.length"
            class="mt-3"
        >
            <div class="flex items-center justify-end">
                <button
                    type="button"
                    class="bg-gray-600 border-2 border-indigo-500 text-white font-semibold px-6 py-2 rounded-lg mb-3 w-full"
                >
                    Day View
                </button>
            </div>

            <TimeRecordDayView
                :time-records="timeRecords.data"
                @refresh-time-records="refreshTimeRecords"
            />
        </div>
    </div>
</template>

<script setup>
import dayjs from 'dayjs';
import TimeRecordStatus from "../enums/TimeRecordStatus";

definePageMeta({
    middleware: ['logged-in'],
});

const user = useState('user');

const {
    data: timeRecords,
    refresh: refreshTimeRecords,
} = await useFetchApi('/time-records', {
    key: 'fetchTimeRecords',
});

if (!user.value) {
    navigateTo('/');
}

async function startTimer() {
    try {
        await $fetch('/api/time-records', {
            method: 'POST',
        });

        refreshTimeRecords();
    } catch (e) {
        alert(e.message);
    }
}

async function stopTimer() {
    try {
        await $fetch(`/api/time-records/${activeTimer.value.id}`, {
            method: 'PATCH',
            body: {
                stopAt: dayjs().toISOString(),
                status: TimeRecordStatus.STOPPED,
            },
        });

        refreshTimeRecords();
    } catch (e) {
        alert(e.message);
    }
}

async function logout() {
    try {
        await $fetch(`/api/logout`, {
            method: 'POST',
        });

        user.value = null;

        navigateTo('/');
    } catch (e) {
        alert(e.message);
    }
}

const activeTimer = computed(() => timeRecords.value && timeRecords.value.data.find(record => record.status === TimeRecordStatus.STARTED));
</script>
