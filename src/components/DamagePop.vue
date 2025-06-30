<template>
  <transition name="damage-pop" mode="out-in">
    <div v-if="show" class="absolute pointer-events-none select-none z-10" :style="styleObj">
      <span
        class="text-5xl font-extrabold drop-shadow-lg animate-damage-pop"
        :class="[color, rotation]"
        style="
          font-family:
            'Comic Sans MS', 'Comic Sans', 'Chalkboard SE', 'Comic Neue', cursive, sans-serif;
        "
      >
        {{ text }}
      </span>
    </div>
  </transition>
</template>
<script setup>
const props = defineProps({
  show: Boolean,
  text: String,
  color: String,
  rotation: String,
  styleObj: Object,
})
</script>
