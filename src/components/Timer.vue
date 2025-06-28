<template>
  <div
    class="text-4xl text-red-800 font-bold border-4 border-red-900 border-dotted w-32 pt-2 pb-2 text-center mt-auto mb-8 hover:bg-red-100 hover:cursor-not-allowed"
  >
    {{ Math.floor(props.timeLeft / 60) }}:{{
      props.timeLeft % 60 == 0 ? '00' : props.timeLeft % 60
    }}
  </div>
</template>
<script setup>
const props = defineProps({
  timeLeft: Number,
  require: true,
})
</script>
