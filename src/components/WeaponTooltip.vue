<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  weapon: Object,
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
    'px-5',
    'py-4',
    'text-sm',
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
    v-if="weapon"
    :class="tooltipClass"
    :style="{
      minWidth: '220px',
      maxWidth: '320px',
      whiteSpace: 'normal',
      border: '2px solid ' + (weapon.color || '#60a5fa'), // single border only
      boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
    }"
  >
    <div class="font-bold mb-2 flex items-center gap-2">
      {{ weapon.name }}
    </div>
    <div class="mb-1">
      <span class="font-semibold"> Phys: </span>
      <span class="text-red-600"> {{ weapon.physDamage }}</span>
    </div>
    <div class="mb-1">
      <span class="font-semibold"> Psi: </span>
      <span class="text-purple-700"> {{ weapon.psiDamage }}</span>
    </div>
    <div v-if="weapon.rarity" class="mt-1">
      <span class="font-semibold">Rarity:</span>
      <span class="ml-1 text-green-700 font-semibold">{{ weapon.rarity }}</span>
    </div>
    <div v-if="weapon.description" class="mt-1 text-xs text-gray-600">
      {{ weapon.description }}
    </div>
  </div>
</template>

<style scoped>
:deep(.z-\[9999\]) {
  z-index: 9999 !important;
}
</style>
