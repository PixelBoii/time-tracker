<template>
    <TransitionRoot
        as="template"
        appear
        :show="open"
    >
        <Dialog
            as="div"
            @close="emit('update:open', false)"
            class="relative z-10"
        >
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-black bg-opacity-25" />
            </TransitionChild>
    
            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel
                            class="w-full max-w-md transform rounded-2xl bg-indigo-500 p-6 text-left align-middle shadow-xl transition-all"
                        >
                            <button
                                type="button"
                                class="absolute top-4 right-4 text-white"
                                @click="emit('update:open', false)"
                            >
                                X
                            </button>

                            <DialogTitle class="font-semibold text-lg text-white">
                                Edit time record
                            </DialogTitle>

                            <div class="mt-6">
                                <div class="mt-3">
                                    <label class="block text-sm font-medium text-white">
                                        Start at
                                    </label>

                                    <DatePicker
                                        v-model="form.startAt"
                                    />
                                </div>

                                <div class="mt-3">
                                    <label class="block text-sm font-medium text-white">
                                        Stop at
                                    </label>

                                    <DatePicker
                                        v-model="form.stopAt"
                                    />
                                </div>
                            </div>

                            <div class="flex items-center justify-end w-full space-x-2 mt-6">
                                <Button
                                    color="red"
                                    @click="remove"
                                >
                                    Remove
                                </Button>

                                <Button
                                    :color="null"
                                    class="bg-indigo-400 hover:bg-indigo-600 text-white"
                                    @click="save"
                                >
                                    Save
                                </Button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
  
<script setup>
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/vue';
import dayjs from 'dayjs';

const emit = defineEmits(['update:open', 'removed', 'saved']);

const props = defineProps({
    open: {
        type: Boolean,
        required: true,
    },
    record: {
        type: Object,
        required: true,
    },
});

const form = ref({});

async function remove() {
    try {
        await $fetch(`/api/time-records/${props.record.id}`, {
            method: 'DELETE',
        });

        emit('removed');
        emit('update:open', false);
    } catch (e) {
        alert(e.message);
    }
}

async function save() {
    try {
        await $fetch(`/api/time-records/${props.record.id}`, {
            method: 'PATCH',
            body: {
                startAt: form.value.startAt ? form.value.startAt.toISOString() : null,
                stopAt: form.value.stopAt ? form.value.stopAt.toISOString() : null,
            },
        });

        emit('saved');
        emit('update:open', false);
    } catch (e) {
        alert(e.message);
    }
}

watch(() => props.record, (record) => {
    form.value = {
        startAt: record?.startAt ? dayjs(record.startAt) : null,
        stopAt: record?.stopAt ? dayjs(record.stopAt) : null,
    };
}, { immediate: true });
</script>
