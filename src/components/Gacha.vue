<template>
  <div class="flex flex-col items-center justify-center mt-auto">
    <div v-if="drop" class="mb-2">
      <h2 class="text-center text-xl font-light italic text-gray-800 opacity-75">You received</h2>
      <img :src="drop.img" v-if="drop.img" alt="Character Image" />
      <h2 class="text-center text-2xl font-bold text-animated" :class="rarityClasses[drop.rarity]">
        {{ drop.name }}!
      </h2>
    </div>
    <button
      @click="drawCharacter"
      class="border-2 rounded-sm p-2 text-2xl font-semibold text-red-600 text-shadow-md"
    >
      GAMBLE!!!
    </button>
    <div class="flex gap-1 text-md text-shadow-sm items-center">
      <span class="font-mono text-xl font-bold text-red-400 transform -rotate-1 skew-x-1">
        You need to deposit {{ price }} {{ price != 1 ? 'bits' : 'bit' }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useGachaStore } from '@/stores/Gacha.js'
const gachaStore = useGachaStore()

const price = ref(1)

const drop = ref(null)
const drawCharacter = () => {
  drop.value = gachaStore.rollGacha('Blank')
  price.value = gachaStore.getPrice('Blank')
  console.log(rarityClasses[drop.value.rarity])
}

const rarityClasses = {
  Normal: 'text-gray-600',
  Extra: 'text-green-600',
}
</script>

<style scoped>
/* --- Custom CSS for Rainbow Text --- */

.text-animated {
  background-size: 200% auto; /* Make the gradient wider than the text */
  animation: rainbow-shift 6s linear infinite;
}

@keyframes rainbow-shift {
  to {
    background-position: 200% center; /* Shift the background from left to right */
  }
}
</style>
