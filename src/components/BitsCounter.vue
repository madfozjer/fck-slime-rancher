<template>
  <div
    class="absolute left-3/6 translate-x-2 top-2 h-16 flex items-center gap-2 font-bold bg-blue-50/90 rounded-full px-6 py-2 shadow border-4 border-blue-400 hover:bg-blue-100/90"
    :class="props.shake ? 'animate-counter-shake' : ''"
  >
    <span class="text-xl">💎</span>
    <span class="text-green-900 drop-shadow text-xl"> {{ count }}</span>
  </div>
</template>
<script setup>
import { watch } from 'vue'

const props = defineProps({
  count: Number,
  shake: Boolean,
})

const emit = defineEmits(['animation-end']) // Declare the custom event

watch(
  () => props.shake,
  (newShake) => {
    if (newShake) {
      setTimeout(() => {
        emit('animation-end') // Emit the event to the parent
      }, 400) // Match the duration of the animation
    }
  },
  { immediate: true },
)
</script>

<style scoped>
@keyframes counter-shake {
  0% {
    transform: translateX(0);
  }
  10% {
    transform: translateX(-4px);
  }
  20% {
    transform: translateX(3px);
  }
  30% {
    transform: translateX(-3px);
  }
  40% {
    transform: translateX(2px);
  }
  50% {
    transform: translateX(-2px);
  }
  60% {
    transform: translateX(1px);
  }
  70% {
    transform: translateX(-1px);
  }
  80% {
    transform: translateX(0.5px);
  }
  90% {
    transform: translateX(-0.5px);
  }
  100% {
    transform: translateX(0);
  }
}
.animate-counter-shake {
  animation: counter-shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
</style>
