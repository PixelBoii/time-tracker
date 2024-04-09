<template>
    <TransitionRoot as="template" appear :show="open">
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
                <div
                    class="flex min-h-full items-center justify-center p-4 text-center"
                >
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

                            <DialogTitle
                                class="font-semibold text-lg text-white"
                            >
                                Register
                            </DialogTitle>

                            <div
                                v-if="error"
                                class="bg-red-500 px-3 py-2 rounded-xl mt-4"
                            >
                                <p class="text-white text-sm">
                                    {{ error }}. Can't make any sense of the
                                    error? Me neither.
                                </p>
                            </div>

                            <form class="mt-6" @submit="handleSubmit">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    name="username"
                                    class="bg-white border focus:border-2 border-indigo-200 px-3 py-2 rounded-lg text-gray-700 w-full focus:outline-none"
                                    required
                                />

                                <div class="flex items-center space-x-3 mt-4">
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        name="password"
                                        class="bg-white border focus:border-2 border-indigo-200 px-3 py-2 rounded-lg text-gray-700 w-1/2 focus:outline-none"
                                        required
                                    />

                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        name="confirm_password"
                                        class="bg-white border focus:border-2 border-indigo-200 px-3 py-2 rounded-lg text-gray-700 w-1/2 focus:outline-none"
                                        required
                                    />
                                </div>

                                <div
                                    class="flex items-center justify-end w-full mt-6"
                                >
                                    <Button
                                        type="submit"
                                        class="bg-indigo-400 hover:bg-indigo-600 text-white"
                                        :color="null"
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </form>
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
} from "@headlessui/vue";

const emit = defineEmits(["update:open"]);

const props = defineProps({
    open: {
        type: Boolean,
        required: true,
    },
});

const error = ref("");

async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    if (formData.get("password") !== formData.get("confirm_password")) {
        return alert("Passwords do not match");
    }

    try {
        await $fetch("/api/register", {
            method: "POST",
            body: Object.fromEntries(formData),
        });

        await navigateTo("/dashboard");
    } catch (e) {
        error.value = e.message;
    }
}
</script>
