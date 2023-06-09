<template>
    <NuxtLink to="/">
        <p class="text-white font-semibold"> GO BACK!!!! </p>
    </NuxtLink>

    <form
        class="mt-6"
        @submit="handleSubmit"
    >
        <p class="text-2xl font-bold mb-4 text-gray-100"> The most unproffessional <s> login </s> registration page you've ever seen! </p>

        <div class="flex items-center space-x-3 mt-12">
            <input
                type="text"
                placeholder="Username"
                name="username"
                class="bg-indigo-500 border focus:border-2 border-indigo-600 px-3 py-2 rounded-lg text-white w-1/3 focus:outline-none"
                required
            />

            <input
                type="password"
                placeholder="Password"
                name="password"
                class="bg-indigo-500 border focus:border-2 border-indigo-600 px-3 py-2 rounded-lg text-white w-1/3 focus:outline-none"
                required
            />

            <input
                type="password"
                placeholder="Confirm Password"
                name="confirm_password"
                class="bg-indigo-500 border focus:border-2 border-indigo-600 px-3 py-2 rounded-lg text-white w-1/3 focus:outline-none"
                required
            />
        </div>

        <Button class="w-full mt-4">
            Wide Register!
        </Button>

        <p class="text-red-500 mt-4" v-if="error"> {{ error }}. Can't make any sense of the error? Me neither. </p>
    </form>
</template>

<script setup>
const error = ref('');

async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    if (formData.get('password') !== formData.get('confirm_password')) {
        return alert('Passwords do not match');
    }

    try {
        await $fetch('/api/register', {
            method: 'POST',
            body: Object.fromEntries(formData),
        });

        navigateTo('/dashboard');
    } catch (e) {
        error.value = e.message;
    }
}
</script>
