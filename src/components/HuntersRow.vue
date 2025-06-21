<script setup>
import Hunter from './Hunter.vue'
import { useAnimationStore } from '@/stores/Animation.js'
const animationStore = useAnimationStore()
const props = defineProps({
  hunters: Array,
})
</script>

<template>
  <div class="flex gap-7 p-0.25 mt-8 w-fit">
    <Hunter
      v-for="(hunter, idx) in hunters"
      :key="`${hunter.name}-${idx}`"
      v-bind="hunter"
      :shake="animationStore.hunterShakes[hunter.id]"
    />
  </div>
</template>
