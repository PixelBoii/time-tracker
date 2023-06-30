<template>
    <LogInModal v-model:open="modals.login.open" />
    <RegisterModal v-model:open="modals.register.open" />

    <div>
        <p class="text-4xl font-bold mb-4 text-gray-100"> Welcome to the time tracker! </p>
        <p class="font-semibold text-gray-300"> Convincing banner description here. I bet you think this is a template, but it isn't. </p>

        <div class="mt-6 flex items-center space-x-3">
            <Button @click="modals.register.open = true">
                Register
            </Button>

            <Button @click="modals.login.open = true">
                Login
            </Button>
        </div>
    </div>
</template>

<script setup>
const user = useState('user');

if (user.value) {
    navigateTo('/dashboard');
}

const modals = ref({
    login: {
        open: false,
    },
    register: {
        open: false,
    },
});
</script>
