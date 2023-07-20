<template>
    <EditorContent :editor="editor" />
</template>
  
<script setup>
import StarterKit from '@tiptap/starter-kit';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import Link from '@tiptap/extension-link';

const props = defineProps({
    content: {
        type: String,
        default: '',
    },
});

const editor = useEditor({
    extensions: [
        StarterKit,
        Link,
    ],
    editorProps: {
        attributes: {
            class: 'prose dark:prose-invert prose-sm sm:prose-base focus:outline-none tip-tap-editor sm:max-w-none',
        },
    },
    content: props.content,
    editable: false,
});

watch(() => props.content, (value) => {
    const isSame = JSON.stringify(editor.value.getJSON()) === JSON.stringify(value);

    if (isSame) {
        return;
    }

    editor.value.commands.setContent(value, false);
});
</script>

<style>
.tip-tap-editor a {
    @apply underline decoration-solid decoration-2 decoration-indigo-300 underline-offset-4 cursor-pointer;
}
</style>
