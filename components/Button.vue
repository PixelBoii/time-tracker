<template>
    <button class="px-3 py-2 rounded-lg font-semibold" :class="colorClass">
        <slot />
    </button>
</template>

<script setup>
const props = defineProps({
    color: {
        type: String,
        default: "indigo",
    },
});

const colorClasses = {
    indigo: "bg-indigo-500 hover:bg-indigo-600 text-white",
    red: "bg-red-500 hover:bg-red-600 text-white",
    orange: "bg-orange-500 hover:bg-orange-600 text-white",
};

const colorClass = computed(() =>
    props.color ? colorClasses[props.color] : "",
);
</script>
