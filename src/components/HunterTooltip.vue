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
  Extraordinary: 'text-purple-600',
}

const rarityClass = computed(() => {
  return hunterRarityClasses[props.hunter?.rarity] || 'text-gray-600'
})

const tooltipClass = computed(() => {
  return [
    props.position === 'left' ? '-translate-x-1/2' : 'translate-x-1/2',
    props.hunter.foil ? 'foil-border' : '',
  ].join(' ')
})
</script>

<template>
  <div
    v-if="hunter"
    :class="tooltipClass"
    class="fixed bg-white bg-opacity-95 border border-blue-400 rounded shadow-lg px-5 py-4 text-sm z-[9999] -translate-y-9/10 top-7/10 border-2px pointer-events-none whitespace-normal"
    :style="{
      minWidth: '320px',
      maxWidth: '400px',
      borderColor: hunter.color,
      boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
    }"
  >
    <div class="font-bold mb-2 flex items-center gap-2" style="border: none; background: none">
      <span class="-mr-1" v-if="hunter.foil">Foil</span>
      <span> {{ hunter.name }}</span>
      <span v-if="hunter.emoji" class="-ml-1">{{ hunter.emoji }}</span>
      <span class="italic text-sm text-gray-500 opacity-85 -ml-1">(#{{ hunter.id }})</span>
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
    <div v-if="hunter.rarity" class="mt-1 font-semibold" style="border: none; background: none">
      <span class="">Rarity:</span>
      <span class="ml-1" :class="rarityClass">{{ hunter.rarity }}</span>
    </div>
    <div v-if="hunter.speed" class="mt-1 font-semibold" style="border: none; background: none">
      <span class="">Speed:</span> {{ hunter.speed }}
    </div>
  </div>
</template>

<style scoped>
.foil-border {
  /* The core foil gradient for the border */
  border-image: linear-gradient(
    45deg,
    #ff0000 0%,
    #b95e03 15%,
    #b8b800 30%,
    #005e00 45%,
    #0000ff 60%,
    #4b0082 75%,
    #9400d3 90%,
    #570202 100% /* Wrap back to this for smooth animation if desired */
  );

  /* How to slice the image for the border. '1' means slice 1 CSS pixel from each edge. */
  /* This value typically matches the border-width for simple gradients. */
  border-image-slice: 1;

  /* How the image sections fill the border. 'stretch' makes it fill the whole border. */
  border-image-repeat: stretch;
}
</style>
