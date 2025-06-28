<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  mob: Object,
  hp: Number,
  position: {
    type: String,
    default: 'left', // 'left' or 'right'
  },
})

const tooltipClass = computed(() => {
  return [
    'absolute',
    props.position === 'right' ? 'left-full ml-4' : 'right-full mr-4',
    'top-1/2',
    '-translate-y-1/2',
    'bg-white',
    'bg-opacity-90',
    'rounded',
    'shadow-lg',
    'px-7',
    'py-6',
    'text-base',
    'z-[9999]', // use a very high z-index for tooltips
    'pointer-events-none',
    'transition-opacity',
    'duration-200',
    'overflow-hidden',
  ].join(' ')
})
</script>

<template>
  <div
    v-if="mob"
    :class="tooltipClass"
    :style="{
      minWidth: '320px',
      maxWidth: '480px',
      whiteSpace: 'normal',
      border: '2px solid ' + (mob.borderColor || '#22c55e'), // single border only
      boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
    }"
  >
    <div class="font-bold mb-2">{{ mob.name }}</div>
    <div v-if="mob.description" class="italic text-gray-500 mb-2 text-base">
      {{ mob.description }}
    </div>
    <div v-if="hp !== undefined && mob.maxHp !== undefined">HP: {{ hp }} / {{ mob.maxHp }}</div>
    <div v-if="mob.type">Type: {{ mob.type }}</div>
  </div>
</template>

<style scoped>
:deep(.z-\[9999\]) {
  z-index: 9999 !important;
}
</style>
