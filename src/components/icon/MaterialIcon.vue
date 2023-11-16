<script setup lang="ts">
interface IMaterialIconProps {
  icon: string
  outline?: boolean
  onClick?: () => void
}
const props = defineProps<IMaterialIconProps>()
</script>

<template>
  <span
    @click="props.onClick"
    :key="props.icon"
    :class="[
      outline
        ? ' material-icons-outlined material-symbols-outlined'
        : ' material-icons material-symbols'
    ]"
  >
    {{ props.icon }}
  </span>
</template>
