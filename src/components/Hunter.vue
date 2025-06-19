<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'gray',
  },
})
</script>

<template>
  <div
    class="border-dotted border border-gray-800 w-fit h-fit flex items-center justify-center bg-transparent relative"
  >
    <!-- Circle background: bigger than cat, 50% transparent -->
    <div
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
      :class="`bg-${props.color}-400`"
      style="width: 114px; height: 114px; opacity: 0.4"
    ></div>
    <!-- Hunter image -->
    <img
      :src="`/hunters/${props.name}/${props.name}.png`"
      :alt="props.name"
      width="128"
      height="128"
      class="relative z-10"
    />
  </div>
</template>
