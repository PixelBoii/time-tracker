<template>
    <EditTimeRecordModal
        v-model:open="modals.editTimeRecord.open"
        :record="modals.editTimeRecord.record"
        @removed="refreshTimeRecords"
        @saved="refreshTimeRecords"
    />

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
            v-if="timeRecords?.data?.length"
            class="mt-6 space-y-2"
        >
            <button
                v-for="record in timeRecords.data"
                :key="record.id"
                type="button"
                class="bg-gray-700 px-6 py-4 rounded-lg w-full flex items-center justify-between"
                @click="editTimeRecord(record)"
            >
                <p class="text-white font-semibold">
                    {{ dayjs(record.startAt).calendar() }}
                </p>

                <p
                    v-if="record.stopAt"
                    class="text-white font-semibold"
                >
                    {{ getRecordDuration(record).humanize() }}
                </p>

                <p
                    v-else
                    class="text-white font-semibold"
                >
                    In progress ({{ getRecordDuration(record).humanize() }})
                </p>
            </button>
        </div>

        <div
            v-else
            class="mt-6"
        >
            <p class="text-gray-300 font-semibold text-lg"> You have no time records yet. </p>
        </div>
    </div>
</template>

<script setup>
import dayjs from 'dayjs';
import Calendar from 'dayjs/plugin/calendar';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import TimeRecordStatus from "../enums/TimeRecordStatus";

dayjs.extend(Calendar);
dayjs.extend(duration);
dayjs.extend(relativeTime);

definePageMeta({
    middleware: ['logged-in'],
});

const user = useState('user');

const modals = ref({
    editTimeRecord: {
        open: false,
        record: null,
    },
});

const {
    data: timeRecords,
    refresh: refreshTimeRecords,
} = await useFetchApi('/time-records', {
    key: 'fetchTimeRecords',
});

if (!user.value) {
    navigateTo('/login');
}

function editTimeRecord(record) {
    modals.value.editTimeRecord = {
        open: true,
        record,
    };
}

function getRecordDuration(record) {
    const stopAt = record.stopAt ? dayjs(record.stopAt) : dayjs();
    const diff = stopAt.diff(record.startAt, 'minutes');

    return dayjs.duration(diff, 'minutes');
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
