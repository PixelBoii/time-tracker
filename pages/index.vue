<template>
    <div>
        <p class="text-4xl font-bold mb-4 text-gray-100"> Welcome to the time tracker! </p>
        <p class="font-semibold text-gray-300"> Convincing banner description here. I bet you think this is a template, but it isn't. </p>

        <div class="mt-6 flex items-center space-x-3">
            <NuxtLink to="/register">
                <Button>
                    Register
                </Button>
            </NuxtLink>

            <NuxtLink to="/login">
                <Button>
                    Login
                </Button>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
const user = useState('user');

if (user.value) {
    navigateTo('/dashboard');
}
</script>
