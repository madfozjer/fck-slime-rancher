<script setup>
import { defineProps } from 'vue'

// Accept all hunter properties via v-bind for flexibility
const props = defineProps({
  name: String,
  color: String,
  img: String,
  attack: Number,
  // Add more hunter stats as needed
})
</script>

<template>
  <div class="w-fit h-fit flex items-center justify-center bg-transparent relative">
    <!-- Circle background: bigger than cat, 50% transparent, with shadow -->
    <div
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg"
      :style="{
        background: props.color ? `var(--tw-bg-${props.color}-400, ${props.color})` : '#a3a3a3',
        width: '114px',
        height: '114px',
        opacity: 0.4,
        zIndex: 1,
      }"
    ></div>
    <!-- Hunter image -->
    <img
      :src="props.img || `/hunters/${props.name}/${props.name}.png`"
      :alt="props.name"
      width="128"
      height="128"
      class="relative z-10"
    />
    <!-- Optionally show stats below -->
    <div
      v-if="props.attack !== undefined"
      class="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs font-bold bg-white bg-opacity-70 rounded px-2 py-0.5 z-20"
    >
      ATK: {{ props.attack }}
    </div>
  </div>
</template>
