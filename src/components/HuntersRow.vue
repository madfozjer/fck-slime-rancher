<script setup>
import Hunter from './Hunter.vue'
import { useAnimationStore } from '@/stores/Animation.js'
const animationStore = useAnimationStore()
const props = defineProps({
  hunters: Array,
})

for (let i = props.hunters.length; i < 4; i++) {
  if (props.hunters[i] == undefined) {
    props.hunters[i] = {}
  }
}

function handleRightClick(e, hunter) {
  e.preventDefault()
}
</script>

<template>
  <div class="flex gap-7 p-0.25 mt-8 w-fit">
    <Hunter
      v-for="(hunter, idx) in hunters"
      :key="`${hunter.name}-${idx}`"
      v-bind="hunter"
      :modifier="hunter.modifier"
      :shake="animationStore.hunterShakes[hunter.id]"
      @drop-weapon="$emit('drop-weapon', hunter.id)"
      @dragover.prevent
      @drop="$emit('drop-hunter', hunter.id)"
      @contextmenu="($emit('unequip', hunter.id), handleRightClick($event, hunter))"
      @double-click="$emit('pull-hunter', hunter.id, idx)"
    />
  </div>
</template>
