<template>
  <div class="gacha-container">
    <h1>Gacha Simulator</h1>
    <p>Click the button below to draw a character!</p>
    <button @click="drawCharacter">Draw Character</button>
    <p>{{ price }} bit</p>
    <div v-if="character" class="character-display">
      <img :src="character.img" alt="Character Image" />
      <h2>{{ character.name }}</h2>
      <p>{{ character.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useGachaStore } from '@/stores/Gacha.js'
const gachaStore = useGachaStore()

const price = ref(1)

const character = ref(null)
const drawCharacter = () => {
  character.value = gachaStore.rollGacha('Blank')
  price.value = gachaStore.getPrice('Blank')
}
</script>
