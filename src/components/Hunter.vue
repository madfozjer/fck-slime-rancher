<script setup>
import { defineProps, ref, watch, onBeforeUnmount } from 'vue' // Add onBeforeUnmount here
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

const emit = defineEmits(['drop-weapon', 'single-click', 'double-click', 'unequip'])

// Add these lines below isExist
const clickTimer = ref(null)
const clickCount = ref(0)
const doubleClickThreshold = 300

const animationStore = useAnimationStore()
const isShaking = ref(false)
const isAttacking = ref(false)
const isTooltipVisible = ref(false)

const isExist = ref(true)

if (props.id == undefined) isExist.value = false

// Add these functions below the isExist check
function handleMainClick() {
  if (!isExist.value) {
    return
  }

  clickCount.value++

  if (clickCount.value === 1) {
    clickTimer.value = setTimeout(() => {
      emit('single-click', props.id)
      emit('drop-weapon', props.id)
      resetClickState()
    }, doubleClickThreshold)
  } else if (clickCount.value === 2) {
    clearTimeout(clickTimer.value)
    emit('double-click', props.id)
    resetClickState()
  } else {
    resetClickState()
  }
}

function resetClickState() {
  clickCount.value = 0
  clickTimer.value = null
}

// Add this onBeforeUnmount hook
onBeforeUnmount(() => {
  if (clickTimer.value) {
    clearTimeout(clickTimer.value)
  }
})

watch(
  () => animationStore.hunterShakes[props.id],
  (val, oldVal) => {
    if (val && !oldVal && isExist) {
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
    class="w-fit h-fit flex items-center justify-center bg-transparent relative hover:cursor-help"
    @mouseenter="isTooltipVisible = true"
    @mouseleave="isTooltipVisible = false"
    @dragover.prevent
    @click="handleMainClick"
    @rightclick="$emit('unequip', w.id)"
  >
    <!-- Circle background: bigger than cat, 50% transparent, with shadow -->
    <div
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg opacity-[0.4] z-1"
      :style="{
        background: props.color ? `var(--tw-bg-${props.color}-400, ${props.color})` : '#a3a3a3',
        width: '114px',
        height: '114px',
      }"
    ></div>
    <!-- Hunter image -->
    <img
      :src="
        isExist
          ? isAttacking
            ? `/hunters/${props.name}/${props.name}-attack.png`
            : props.img || `/hunters/${props.name}/${props.name}.png`
          : ''
      "
      :alt="props.name"
      width="128"
      height="128"
      class="relative z-10"
      :class="isShaking && isExist ? 'animate-hunter-shake' : ''"
    />
    <!-- Info tooltip -->
    <HunterTooltip v-if="isTooltipVisible && isExist" :hunter="props" position="left" />
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
