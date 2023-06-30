<template>
    <DatePicker
        class="relative"
        :model-value="modelValue"
        @update:model-value="e => emit('update:modelValue', e)"
        v-slot="{ prevViewMonth, nextViewMonth, viewDate }"
    >
        <div class="flex space-x-2">
            <DatePickerInput
                class="w-full bg-white text-gray-700 px-3 py-2 rounded-lg font-semibold"
                format="YYYY-MM-DD"
            />

            <DatePickerInput
                class="w-full bg-white text-gray-700 px-3 py-2 rounded-lg font-semibold"
                format="HH:mm"
            />
        </div>

        <Transition
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            enter-active-class="transition ease-out duration-200"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
            leave-active-class="transition ease-in duration-150"
        >
            <DatePickerPanel
                ref="popper"
                class="bg-white rounded-lg px-3 py-2 w-full ring ring-offset-2 ring-indigo-300 absolute mt-4 z-10"
                v-slot="{ daysInCurrentMonth }"
            >
                <DatePickerView :order="0">
                    <div class="relative">
                        <button class="absolute left-2 inset-y-0 my-auto">
                            <ChevronLeftIcon
                                class="w-4 h-4 text-gray-700"
                                @click="prevViewMonth"
                            />
                        </button>

                        <p class="text-gray-700 font-semibold text-center">
                            {{ viewDate.format('MMMM YYYY') }}
                        </p>

                        <button class="absolute right-2 inset-y-0 my-auto">
                            <ChevronRightIcon
                                class="w-4 h-4 text-gray-700"
                                @click="nextViewMonth"
                            />
                        </button>
                    </div>

                    <div class="grid grid-cols-7 mt-2">
                        <DatePickerCalendarItem
                            v-for="day in daysInCurrentMonth"
                            :key="day"
                            :value="day"
                            as="template"
                            v-slot="{ selected, active }"
                        >
                            <button
                                type="button"
                                class="hover:bg-indigo-100 rounded-lg p-2"
                                :class="{
                                    'bg-indigo-100': active && !selected,
                                    'bg-indigo-300': selected,
                                    'text-gray-500': !viewDate.isSame(day, 'month') && !selected,
                                }"
                            >
                                {{ day.format('DD') }}
                            </button>
                        </DatePickerCalendarItem>
                    </div>
                </DatePickerView>

                <DatePickerView
                    class="grid grid-cols-2 gap-2"
                    :order="1"
                    :auto-next="false"
                >
                    <div class="h-72 overflow-y-auto flex flex-col">
                        <DatePickerCalendarItem
                            v-for="hour in 24"
                            :key="`hour-${hour}`"
                            class="p-3 hover:bg-indigo-300 rounded-lg"
                            :class="{
                                'bg-indigo-300': modelValue.hour() === hour - 1,
                            }"
                            :value="modelValue.clone().hour(hour - 1)"
                        >
                            {{ hour - 1 }}
                        </DatePickerCalendarItem>
                    </div>

                    <div class="h-72 overflow-y-auto flex flex-col">
                        <DatePickerCalendarItem
                            v-for="minute in 60"
                            :key="`minute-${minute}`"
                            class="py-2 px-6 hover:bg-indigo-300 rounded-lg"
                            :class="{
                                'bg-indigo-300': modelValue.minute() === minute,
                            }"
                            :value="modelValue.clone().minute(minute)"
                        >
                            {{ minute }}
                        </DatePickerCalendarItem>
                    </div>
                </DatePickerView>
            </DatePickerPanel>
        </Transition>
    </DatePicker>
</template>

<script setup>
import dayjs from 'dayjs';
import {
    DatePicker, DatePickerInput, DatePickerCalendarItem, DatePickerPanel, DatePickerView,
} from 'vue-headless-datepicker';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
    modelValue: {
        type: dayjs.Dayjs,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue']);
</script>
