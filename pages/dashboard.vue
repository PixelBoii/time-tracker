<template>
    <div class="flex flex-col h-screen">
        <div class="bg-gray-700 border-b-2 border-gray-600 px-4 py-3">
            <div class="flex items-center justify-between">
                <div class="w-1/3">
                    <p class="text-gray-100 font-semibold text-lg capitalize">
                        {{ dayjs().format('dddd, MMMM D') }}
                    </p>
                </div>

                <div class="w-1/3 flex items-center justify-center">
                    <Listbox
                        :model-value="route.name"
                        @update:model-value="name => navigateTo({ name })"
                    >
                        <div class="relative">
                            <ListboxButton as="template">
                                <Button class="flex items-center justify-between space-x-2">
                                    <span> {{ views[route.name] }} </span>

                                    <ChevronUpDownIcon class="h-5 w-5 text-white" />
                                </Button>
                            </ListboxButton>

                            <Transition
                                enter-active-class="transition ease-out duration-100"
                                enter-from-class="opacity-0 scale-95"
                                enter-to-class="opacity-100 scale-100"
                                leave-active-class="transition ease-in duration-75"
                                leave-from-class="opacity-100 scale-100"
                                leave-to-class="opacity-0 scale-95"
                            >
                                <ListboxOptions class="absolute mt-1 bg-gray-600 py-1 rounded-lg w-36 text-white z-10">
                                    <ListboxOption
                                        v-for="(view, key) in views"
                                        :key="key"
                                        :value="key"
                                        v-slot="{ selected }"
                                        class="cursor-pointer bg-gray-600 hover:bg-gray-500 py-2 px-3 rounded-lg relative"
                                    >
                                        {{ view }}

                                        <span
                                            v-if="selected"
                                            class="absolute inset-y-0 right-0 flex items-center pr-3 text-white"
                                        >
                                            <CheckIcon class="h-5 w-5" />
                                        </span>
                                    </ListboxOption>
                                </ListboxOptions>
                            </Transition>
                        </div>
                    </Listbox>
                </div>

                <div class="flex items-center justify-end space-x-3 w-1/3">
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

                    <Button
                        type="button"
                        color="red"
                        @click="logout"
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </div>

        <div
            v-if="timeRecords && timeRecords.data.length"
            class="pt-2 grow"
        >
            <NuxtPage
                :time-records="timeRecords"
                @refresh-time-records="refreshTimeRecords"
            />
        </div>
    </div>
</template>

<script setup>
import dayjs from 'dayjs';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid';

import TimeRecordStatus from '../enums/TimeRecordStatus';

definePageMeta({
    middleware: ['logged-in'],
});

const user = useState('user');
const route = useRoute();

const views = {
    'dashboard-day': 'Day View',
    'dashboard-week': 'Week View',
};

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
