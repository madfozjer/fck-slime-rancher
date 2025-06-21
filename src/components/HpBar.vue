<template>
  <div class="w-full mt-1 flex justify-center flex-col items-center">
    <div
      class="w-full max-w-md h-2 bg-lime-200 rounded-full border-2 border-lime-500 overflow-hidden shadow-inner"
    >
      <div
        class="h-full transition-all duration-300"
        :class="barClass"
        :style="{ width: (hp / maxHp) * 100 + '%' }"
      ></div>
    </div>
    <div
      class="text-[18px] text-lime-800 font-extrabold mt-0.5 text-center select-none"
      :class="isShaking ? 'animate-hp-shake' : ''"
      style="
        font-family:
          'Comic Sans MS', 'Comic Sans', 'Chalkboard SE', 'Comic Neue', cursive, sans-serif;
        letter-spacing: 0.04em;
        text-shadow:
          1px 1px 0 #fff176,
          2px 2px 0 #bef264;
        transform: rotate(-3deg) skewX(-8deg);
      "
    >
      {{ hp }} / {{ maxHp }} HP LOL
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({
  hp: Number,
  maxHp: Number,
  isShaking: Boolean,
})
const barClass = computed(() => {
  if (props.hp === props.maxHp) return 'bg-lime-400'
  if (props.hp > props.maxHp * 0.5) return 'bg-yellow-300'
  if (props.hp > 0) return 'bg-red-400'
  return 'bg-gray-400'
})
</script>
