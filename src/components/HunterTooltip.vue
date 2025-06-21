<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  hunter: Object,
  position: {
    type: String,
    default: 'left', // 'left' or 'right'
  },
})

const tooltipClass = computed(() => {
  // Position tooltip to the left (default) or right
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
    v-if="hunter"
    :class="tooltipClass"
    :style="{
      minWidth: '320px',
      maxWidth: '400px',
      whiteSpace: 'normal',
      borderColor: hunter.color || '#fbbf24',
      borderStyle: 'solid',
      borderWidth: '2px',
    }"
  >
    <div class="font-bold mb-2 flex items-center gap-2">
      {{ hunter.name }}<span v-if="hunter.emoji">{{ hunter.emoji }}</span>
    </div>
    <div v-if="hunter.weapon" class="mb-1">
      <span class="font-semibold">Weapon:</span> {{ hunter.weapon.name }}
      <span v-if="hunter.weapon.physDamage !== undefined">
        | <span class="text-red-600">Phys: {{ hunter.weapon.physDamage }}</span>
      </span>
      <span v-if="hunter.weapon.psiDamage !== undefined">
        | <span class="text-purple-700">Psi: {{ hunter.weapon.psiDamage }}</span>
      </span>
    </div>
    <div v-if="hunter.modifier" class="mb-1">
      <span class="font-semibold">Modifiers:</span>
      <span class="ml-1">
        <span class="text-red-600">Phys x{{ hunter.modifier.phys }}</span>
        ,
        <span class="text-purple-700">Psi x{{ hunter.modifier.psi }}</span>
      </span>
    </div>
    <div v-if="hunter.rarity" class="mt-1">
      <span class="font-semibold">Rarity:</span>
      <span class="ml-1 text-green-700 font-semibold">{{ hunter.rarity }}</span>
    </div>
    <div v-if="hunter.speed" class="mt-1">
      <span class="font-semibold">Speed:</span> {{ hunter.speed }}
    </div>
  </div>
</template>

<style scoped>
:deep(.z-\[9999\]) {
  z-index: 9999 !important;
}
</style>
