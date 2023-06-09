<template>
    <div
        ref="container"
        class="relative"
    >
        <Button
            ref="reference"
            type="button"
            class="w-full bg-white text-gray-700"
            :color="null"
            @click="showPopper = !showPopper"
        >
            {{ modelValue ? modelValue.format('DD/MM/YYYY') : 'Select date' }}
        </Button>

        <Transition
            enter-from-class="opacity-0 translate-y-20"
            enter-to-class="opacity-100 translate-y-0"
            enter-active-class="transition duration-300"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-20"
            leave-active-class="transition duration-200"
        >
            <div
                v-if="showPopper"
                ref="popper"
                class="bg-white rounded-lg px-3 py-2 w-full ring ring-offset-2 ring-indigo-300 mt-3 z-10"
                :style="floatingStyles"
            >
                <div class="relative">
                    <button class="absolute left-2 inset-y-0 my-auto">
                        <ChevronLeftIcon
                            class="w-4 h-4 text-gray-700"
                            @click="goBack"
                        />
                    </button>

                    <p class="text-gray-700 font-semibold text-center">
                        {{ viewDate.format('MMMM YYYY') }}
                    </p>

                    <button class="absolute right-2 inset-y-0 my-auto">
                        <ChevronRightIcon
                            class="w-4 h-4 text-gray-700"
                            @click="goForward"
                        />
                    </button>
                </div>

                <div class="grid grid-cols-7 mt-2">
                    <button
                        v-for="day in 35"
                        :key="day"
                        type="button"
                        class="hover:bg-indigo-100 rounded-lg p-2"
                        :class="{
                            'bg-indigo-100': getDay(day).isSame(modelValue, 'day'),
                            'text-gray-400': !getDay(day).isSame(viewDate, 'month'),
                        }"
                        @click="selectDate(getDay(day))"
                    >
                        {{ getDay(day).format('DD') }}
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { useFloating } from '@floating-ui/vue';
import { onClickOutside } from '@vueuse/core';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
    modelValue: {
        type: dayjs.Dayjs,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue']);

const showPopper = ref(false);
const viewDate = ref(dayjs().startOf('month'));

const container = ref(null);
const reference = ref(null);
const popper = ref(null);

const { floatingStyles } = useFloating(reference, popper);

onClickOutside(container, () => {
    showPopper.value = false;
});

function selectDate(date) {
    emit('update:modelValue', date);
    showPopper.value = false;
}

function goBack() {
    viewDate.value = viewDate.value.subtract(1, 'month');
}

function goForward() {
    viewDate.value = viewDate.value.add(1, 'month');
}

function getDay(day) {
    return viewDate.value.startOf('week').add(day, 'day');
}
</script>
