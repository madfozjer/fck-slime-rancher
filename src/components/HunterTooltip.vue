<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  hunter: Object,
  position: {
    type: String,
    default: 'left', // 'left' or 'right'
  },
})

const hunterRarityClasses = {
  Normal: 'text-gray-600',
  Extra: 'text-green-600',
}

const rarityClass = computed(() => {
  return hunterRarityClasses[props.hunter?.rarity] || 'text-gray-600'
})

const tooltipClass = computed(() => {
  return [
    'fixed',
    'bg-white',
    'bg-opacity-95',
    'border',
    'border-blue-400',
    'rounded',
    'shadow-lg',
    'px-5',
    'py-4',
    'text-sm',
    'z-[9999]',
    '-translate-y-9/10',
    'top-7/10',
    'pointer-events-none', // Purely visual, won't block clicks (change to 'pointer-events-auto' if interactive)
    props.position === 'left' ? '-translate-x-1/2' : 'translate-x-1/2',
  ].join(' ')
})
</script>

<template>
  <div
    v-if="hunter"
    :class="tooltipClass"
    class="whitespace-normal"
    :style="{
      minWidth: '320px',
      maxWidth: '400px',
      border: '2px solid ' + (hunter.color || '#fbbf24'),
      boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
    }"
  >
    <div class="font-bold mb-2 flex items-center gap-2" style="border: none; background: none">
      {{ hunter.name }} <span v-if="hunter.emoji">{{ hunter.emoji }}</span>
    </div>
    <div v-if="hunter.weapon" class="mb-1" style="border: none; background: none">
      <span class="font-semibold">Weapon:</span> {{ hunter.weapon.name }}
      <span v-if="hunter.weapon.physDamage !== undefined">
        | <span class="text-red-600">Phys: {{ hunter.weapon.physDamage }}</span>
      </span>
      <span v-if="hunter.weapon.psiDamage !== undefined">
        | <span class="text-purple-700">Psi: {{ hunter.weapon.psiDamage }}</span>
      </span>
    </div>
    <div v-if="hunter.modifier" class="mb-1" style="border: none; background: none">
      <span class="font-semibold">Modifiers:</span>
      <span class="ml-1">
        <span class="text-red-600">Phys x{{ hunter.modifier.phys }}</span>
        ,
        <span class="text-purple-700">Psi x{{ hunter.modifier.psi }}</span>
      </span>
    </div>
    <div v-if="hunter.rarity" class="mt-1" style="border: none; background: none">
      <span class="font-semibold">Rarity:</span>
      <span class="ml-1 font-semibold" :class="rarityClass">{{ hunter.rarity }}</span>
    </div>
    <div v-if="hunter.speed" class="mt-1" style="border: none; background: none">
      <span class="font-semibold">Speed:</span> {{ hunter.speed }}
    </div>
  </div>
</template>
