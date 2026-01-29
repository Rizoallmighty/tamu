<template>
  <button
    :class="['base-button', customClass]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot>{{ text }}</slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  text?: string; // default text
  disabled?: boolean;
  customClass?: string; // optional extra class
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

function handleClick(event: MouseEvent) {
  if (!props.disabled) emit("click", event);
}
</script>

<style scoped lang="scss">
.base-button {
  background: #5e5df0;
  border-radius: 999px;
  box-shadow: #5e5df0 0 10px 20px -10px;
  color: #ffffff;
  cursor: pointer;
  font-family:
    Inter,
    Helvetica,
    "Apple Color Emoji",
    "Segoe UI Emoji",
    NotoColorEmoji,
    "Segoe UI Symbol",
    "Android Emoji",
    EmojiSymbols,
    -apple-system,
    system-ui,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    "Noto Sans",
    sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  padding: 8px 18px;
  border: 0;
  outline: none;
  user-select: none;
  touch-action: manipulation;
  width: fit-content;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: #5e5df0 0 12px 24px -12px;
  }

  &:active {
    transform: translateY(0);
    box-shadow: #5e5df0 0 10px 20px -10px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
}
</style>
