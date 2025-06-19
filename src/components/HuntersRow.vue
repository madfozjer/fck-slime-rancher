<template>
  <div class="flex gap-7 p-0.25 mt-8 w-fit">
    <Hunter v-for="(hunter, idx) in hunters" :key="idx" v-bind="hunter" />
  </div>
</template>
<script setup>
import Hunter from './Hunter.vue'
const props = defineProps({
  hunters: Array,
})
</script>
