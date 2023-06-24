<template>
    <NuxtLink to="/">
        <p class="text-white font-semibold"> GO BACK!!!! </p>
    </NuxtLink>

    <form
        class="mt-6"
        @submit="handleSubmit"
    >
        <p class="text-2xl font-bold mb-4 text-gray-100"> The most unproffessional login page you've ever seen! </p>

        <div class="flex items-center space-x-3 mt-12">
            <input
                type="text"
                placeholder="Username"
                name="username"
                class="bg-indigo-500 border focus:border-2 border-indigo-600 px-3 py-2 rounded-lg text-white w-1/2 focus:outline-none"
                required
            />

            <input
                type="password"
                placeholder="Password"
                name="password"
                class="bg-indigo-500 border focus:border-2 border-indigo-600 px-3 py-2 rounded-lg text-white w-1/2 focus:outline-none"
                required
            />
        </div>

        <Button
            type="submit"
            class="w-full mt-6"
        >
            Login
        </Button>

        <p class="text-red-500 mt-4" v-if="error"> {{ error }}. Can't make any sense of the error? Me neither. </p>
    </form>
</template>

<script setup>
const error = ref('');

async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
        await $fetch('/api/login', {
            method: 'POST',
            body: Object.fromEntries(formData),
        });

        navigateTo('/dashboard');
    } catch (err) {
        error.value = err.message;
    }
}
</script>
