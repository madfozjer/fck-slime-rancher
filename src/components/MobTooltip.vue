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
    'border-2',
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
      borderColor: mob.borderColor || '#22c55e',
      borderStyle: 'solid',
      borderWidth: '2px',
    }"
  >
    <div class="font-bold mb-2">{{ mob.name }}</div>
    <div v-if="mob.description" class="italic text-gray-500 mb-2 text-base">
      {{ mob.description }}
    </div>
    <div v-if="hp !== undefined && mob.maxHp !== undefined">HP: {{ hp }} / {{ mob.maxHp }}</div>
    <div v-if="mob.price !== undefined">Price: {{ mob.price }}</div>
    <div v-if="mob.attack !== undefined">ATK: {{ mob.attack }}</div>
    <div v-if="mob.rarity">
      Rarity: <span class="ml-1 text-green-700 font-semibold">{{ mob.rarity }}</span>
    </div>
    <div v-if="mob.type">Type: {{ mob.type }}</div>
  </div>
</template>

<style scoped>
:deep(.z-\[9999\]) {
  z-index: 9999 !important;
}
</style>
