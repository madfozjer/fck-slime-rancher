<template>
  <div
    class="absolute left-1/2 -translate-x-1/2 top-2 flex items-center gap-2 text-3xl font-bold select-none bg-green-50/90 rounded-full px-6 py-2 shadow border-4 border-green-600"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 drop-shadow" viewBox="0 0 32 32">
      <path
        d="M16 3 Q28 5 29 16 Q28 27 16 29 Q4 27 3 16 Q4 5 16 3 Z"
        fill="#6ee7b7"
        stroke="#065f46"
        stroke-width="3"
      />
      <ellipse
        cx="16"
        cy="16"
        rx="9"
        ry="8"
        fill="#bbf7d0"
        stroke="#065f46"
        stroke-width="2"
        transform="rotate(-7 16 16)"
      />
      <circle cx="12" cy="13" r="1.5" fill="#fff" opacity="0.7" />
      <circle cx="20" cy="19" r="1" fill="#fff" opacity="0.5" />
      <circle cx="22" cy="11" r="0.7" fill="#22d3ee" opacity="0.7" />
      <circle cx="10" cy="20" r="0.5" fill="#22d3ee" opacity="0.7" />
      <path d="M10 25 Q16 28 22 25" stroke="#065f46" stroke-width="1" fill="none" opacity="0.6" />
    </svg>
    <span class="text-green-900 drop-shadow">{{ count }}</span>
  </div>
</template>
<script setup>
const props = defineProps({
  count: Number,
})
</script>
