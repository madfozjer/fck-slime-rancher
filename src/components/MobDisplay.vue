<template>
  <div v-if="mob && mob.img" class="flex flex-col items-center w-full">
    <div
      class="relative"
      @mouseenter="isTooltipVisible = true"
      @mouseleave="isTooltipVisible = false"
    >
      <img
        :src="showDamagedImg ? mob.damagedImg : mob.img"
        :alt="mob.alt"
        class="block border p-4 h-fit hover:cursor-pointer mt-8"
        width="270"
        height="270"
        @click="onDamage"
        :class="slimeShaking ? 'animate-slime-shake' : ''"
        @mouseenter="isTooltipVisible = true"
        @mouseleave="isTooltipVisible = false"
      />
      <!-- Mob info tooltip -->
      <div
        v-if="isTooltipVisible"
        class="absolute right-full top-1/2 -translate-y-1/2 mr-4 bg-white bg-opacity-90 border-2 rounded shadow-lg px-7 py-6 text-base z-30 pointer-events-none transition-opacity duration-200 overflow-hidden"
        :style="`min-width: 320px; max-width: 480px; white-space: normal; border-color: ${mob.borderColor || '#22c55e'}; border-style: solid; border-width: 2px;`"
      >
        <div class="font-bold mb-2">{{ mob.name }}</div>
        <div v-if="mob.description" class="italic text-gray-500 mb-2 text-base">
          {{ mob.description }}
        </div>
        <div v-if="hp !== undefined && mob.maxHp !== undefined">HP: {{ hp }} / {{ mob.maxHp }}</div>
        <div v-if="mob.price !== undefined">Price: {{ mob.price }}</div>
        <div v-if="mob.attack !== undefined">ATK: {{ mob.attack }}</div>
        <div v-if="mob.rarity">
          Rarity: <span class="ml-1 text-green-700 font-semibold">{{ mob.rarity }}</span>
        </div>
        <div v-if="mob.type">Type: {{ mob.type }}</div>
      </div>
      <DamagePop
        :show="showDamagePop"
        :text="damagePopText"
        :color="damagePopColor"
        :rotation="damagePopRotation"
        :styleObj="damagePopStyle"
      />
    </div>
    <div
      class="mt-2 text-xl font-extrabold text-green-700 drop-shadow-lg tracking-wider px-0 py-0"
      :class="slimeShaking ? 'animate-hp-shake' : ''"
      style="
        background: none;
        font-family:
          'Comic Sans MS', 'Comic Sans', 'Chalkboard SE', 'Comic Neue', cursive, sans-serif;
        letter-spacing: 0.08em;
        text-shadow:
          2px 2px 0 #bbf7d0,
          4px 4px 0 #22d3ee;
      "
      @mouseenter="isTooltipVisible = true"
      @mouseleave="isTooltipVisible = false"
    >
      {{ mob.name }}
    </div>
    <div
      class="w-full mt-1"
      @mouseenter="isTooltipVisible = true"
      @mouseleave="isTooltipVisible = false"
    >
      <HpBar :hp="hp" :maxHp="mob.maxHp" :isShaking="slimeShaking" />
    </div>
  </div>
</template>

<script setup>
import HpBar from './HpBar.vue'
import DamagePop from './DamagePop.vue'
import { useAnimationStore } from '@/stores/Animation.js'
import { ref, watch } from 'vue'

const props = defineProps({
  mob: Object,
  hp: Number,
  isShaking: Boolean, // keep for compatibility, but will use store
  showDamagedImg: Boolean,
  showDamagePop: Boolean,
  damagePopText: String,
  damagePopColor: String,
  damagePopRotation: String,
  damagePopStyle: Object,
  onDamage: Function,
})

const animationStore = useAnimationStore()
const slimeShaking = ref(false)
const isTooltipVisible = ref(false)

watch(
  () => animationStore.mobShake,
  (val, oldVal) => {
    if (val && !oldVal) {
      slimeShaking.value = false
      void document.body.offsetWidth
      slimeShaking.value = true
      setTimeout(() => {
        slimeShaking.value = false
        animationStore.resetMobShake()
      }, 400)
    }
  },
)
</script>

<style scoped>
@keyframes slime-shake {
  0% {
    transform: rotate(0deg) scale(1);
  }
  10% {
    transform: rotate(-4deg) scale(1.02);
  }
  20% {
    transform: rotate(3deg) scale(0.99);
  }
  30% {
    transform: rotate(-3deg) scale(1.01);
  }
  40% {
    transform: rotate(2deg) scale(0.99);
  }
  50% {
    transform: rotate(-2deg) scale(1.01);
  }
  60% {
    transform: rotate(1deg) scale(1);
  }
  70% {
    transform: rotate(-1deg) scale(1);
  }
  80% {
    transform: rotate(0.5deg) scale(1);
  }
  90% {
    transform: rotate(-0.5deg) scale(1);
  }
  100% {
    transform: rotate(0deg) scale(1);
  }
}
.animate-slime-shake {
  animation: slime-shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

/* Add this for the mob name shake */
@keyframes hp-shake {
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
.animate-hp-shake {
  animation: hp-shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
</style>
