<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div
    class="border-dotted border border-gray-800 flex items-center justify-center relative w-[160px] h-[160px] bg-transparent"
  >
    <!-- Circle background: smaller than hunter but still visible -->
    <div
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-2/4 rounded-full bg-orange-400 border-2 border-orange-600 shadow"
      style="width: 96px; height: 96px; z-index: 0"
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
