<template>
    <EditorContent :editor="editor" />
</template>
  
<script setup>
import StarterKit from '@tiptap/starter-kit';
import { useEditor, EditorContent } from '@tiptap/vue-3';

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['update:modelValue']);

const editor = useEditor({
    extensions: [
        StarterKit,
    ],
    editorProps: {
        attributes: {
            class: 'prose-invert dark:prose prose-sm sm:prose-base focus:outline-none bg-white rounded-lg px-3 py-2',
        },
    },
    content: props.modelValue,
    onUpdate: () => {
        emit('update:modelValue', editor.value.getJSON());
    },
});

watch(() => props.modelValue, (value) => {
    const isSame = JSON.stringify(editor.value.getJSON()) === JSON.stringify(value);

    if (isSame) {
        return;
    }

    editor.value.commands.setContent(value, false);
});
</script>