<template>
  <div class="flex flex-col items-center justify-center">
    <div v-if="drop && !lookingData">
      <h2 class="text-center text-xl font-light italic text-gray-800 opacity-75">You received</h2>
      <img :src="drop.img" v-if="drop.img" :alt="drop.name" />
      <h2 class="text-center text-2xl font-bold text-animated" :class="rarityClasses[drop.rarity]">
        {{ drop.name }}!
      </h2>
      <h3 class="text-xl text-center foil-text font-bold" v-if="effects.includes('Foil')">
        Baby, its foil!
      </h3>
    </div>
    <button
      @click="drawCharacter"
      class="border-2 rounded-sm p-2 text-2xl font-semibold text-red-600 text-shadow-md hover:cursor-pointer mt-2"
      v-if="!lookingData"
    >
      GAMBLE!!!
    </button>
    <div class="flex gap-1 text-md text-shadow-sm items-center" v-if="!lookingData">
      <span class="font-mono text-xl font-bold text-red-400 transform -rotate-1 skew-x-1">
        You need to deposit {{ price }} {{ price != 1 ? 'bits' : 'bit' }}
      </span>
    </div>
    <button
      @click="lookingData = !lookingData"
      class="border-2 rounded-sm p-2 text-sm mt-2 font-semibold text-blue-600 text-shadow-md hover:cursor-pointer"
    >
      About
    </button>
    <div
      v-if="lookingData"
      class="flex flex-col justify-start items-start w-full border-2 rounded-md border-dotted h-full mt-4 p-4"
    >
      <div class="mb-4">
        <span class="italic text-xl">Pretty boring banner </span>
        <span class="font-mono font-thin italic text-xl ml-1">{{
          gachaStore.banners[currentBanner].name
        }}</span>
      </div>

      <div class="w-full">
        <div class="font-semibold text-lg mb-2">Content:</div>

        <div
          class="grid grid-cols-12 gap-2 pb-1 border-b border-gray-300 font-bold text-sm text-gray-700"
        >
          <div class="col-span-1 text-center">Type</div>
          <div class="col-span-7">Name</div>
          <div class="col-span-3">Rarity</div>
          <div class="col-span-1 text-right">Chance</div>
        </div>

        <div
          v-for="item in gachaStore.banners[currentBanner].content"
          :key="item.name"
          class="grid grid-cols-12 gap-2 py-1 border-b border-gray-100 items-center text-sm"
        >
          <div class="col-span-1 font-semibold font-mono text-center">
            {{ item.type === 'Hunter' ? 'H' : 'W' }}
          </div>
          <div class="col-span-7 italic">{{ item.name }}</div>
          <div class="col-span-3 font-bold" :class="rarityClasses[item.rarity]">
            {{ item.rarity }}
          </div>

          <div class="col-span-1 text-right">
            {{
              Math.floor(
                (gachaStore.banners[currentBanner].chances[item.rarity] / amounts[item.rarity]) *
                  100,
              )
            }}%
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        Your current luck:
        <span class="text-yellow-600"
          >{{ parseFloat(gachaStore.banners[currentBanner].currentLuck) * 100 }}%</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGachaStore } from '@/stores/Gacha.js'
const gachaStore = useGachaStore()
const currentBanner = 'Blank'

const price = ref(1)
const lookingData = ref(false)
var effects = []

var amounts = {
  Normal: 0,
  Extra: 0,
  Extraordinary: 0,
}

gachaStore.banners[currentBanner].content.forEach((item) => {
  if (item.rarity == 'Normal') amounts['Normal']++
  if (item.rarity == 'Extra') amounts['Extra']++
  if (item.rarity == 'Extraordinary') amounts['Extraordinary']++
})

const drop = ref(null)
const drawCharacter = () => {
  effects = []
  const rollResult = gachaStore.rollGacha(currentBanner)
  if (rollResult) {
    drop.value = rollResult[0]
    if (rollResult[1] != 0)
      rollResult[1].forEach((tag) => {
        effects.push(tag)
      })
  }
  price.value = gachaStore.getPrice(currentBanner)
}

const rarityClasses = {
  Normal: 'text-gray-600',
  Extra: 'text-green-600',
  Extraordinary: 'text-purple-600',
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

.foil-text {
  /* Core Foil Effect */
  background: linear-gradient(
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
  -webkit-background-clip: text; /* Clip background to the shape of the text */
  background-clip: text;
  -webkit-text-fill-color: transparent; /* Make text transparent so background shows */
  color: transparent; /* Fallback for older browsers */

  /* Subtle shadow for depth */
  text-shadow: 2px 2px 5px rgba(255, 0, 242, 0.4);
}
</style>
