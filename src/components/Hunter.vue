<script setup>
import { defineProps, ref, watch } from 'vue'
import { useAnimationStore } from '@/stores/Animation.js'
import HunterTooltip from '@/components/HunterTooltip.vue'

const props = defineProps({
  id: Number,
  name: String,
  emoji: String,
  color: String,
  img: String,
  weapon: Object,
  rarity: String,
  speed: Number,
  modifier: Object,
  // Add more hunter stats as needed
})

const animationStore = useAnimationStore()
const isShaking = ref(false)
const isAttacking = ref(false)
const isTooltipVisible = ref(false)

watch(
  () => animationStore.hunterShakes[props.id],
  (val, oldVal) => {
    if (val && !oldVal) {
      isShaking.value = false
      isAttacking.value = true
      void document.body.offsetWidth // force reflow
      isShaking.value = true
      setTimeout(() => {
        isShaking.value = false
        isAttacking.value = false
        animationStore.resetHunterShake(props.id)
      }, 400)
    }
  },
)
</script>

<template>
  <div
    class="w-fit h-fit flex items-center justify-center bg-transparent relative"
    @mouseenter="isTooltipVisible = true"
    @mouseleave="isTooltipVisible = false"
    @dragover.prevent
    @drop="$emit('drop-weapon', props.id)"
  >
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
      :src="
        isAttacking
          ? `/hunters/${props.name}/${props.name}-attack.png`
          : props.img || `/hunters/${props.name}/${props.name}.png`
      "
      :alt="props.name"
      width="128"
      height="128"
      class="relative z-10"
      :class="isShaking ? 'animate-hunter-shake' : ''"
    />
    <!-- Info tooltip -->
    <HunterTooltip v-if="isTooltipVisible" :hunter="props" position="left" />
  </div>
</template>

<style scoped>
@keyframes hunter-shake {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-6px);
  }
  40% {
    transform: translateX(6px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(4px);
  }
  100% {
    transform: translateX(0);
  }
}
.animate-hunter-shake {
  animation: hunter-shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
</style>
