<script setup>
// Import Vue Composition API helpers
import { ref, watch, computed } from 'vue'
import Hunter from '@/components/Hunter.vue'

// Mob data and mobQueue can be moved to a separate file or MobData.js

// Damage pop logic and arrays can be moved to a MobDisplay.vue component

// HP bar and HP text can be moved to a HpBar.vue component

// Coin counter can be moved to a CoinCounter.vue component

// Mob image, click logic, and shake/damage image logic can be moved to MobDisplay.vue

// Define a GreenSlime mob template
const GreenSlime = {
  name: 'Green Slime',
  img: '/green-slime/green-slime.png',
  alt: 'Green Slime',
  hp: 10,
  maxHp: 10,
  price: 1,
  damagedImg: '/green-slime/green-slime-damaged.png', // <-- add damaged image
}

// Create a queue of mobs (all GreenSlime for now)
const mobQueue = [
  GreenSlime,
  GreenSlime,
  GreenSlime,
  GreenSlime,
  GreenSlime,
  GreenSlime,
  GreenSlime,
  GreenSlime,
  GreenSlime,
  GreenSlime,
  GreenSlime,
  GreenSlime,
]

// Track which mob is currently active
const currentMobIndex = ref(0)
// The current mob object (copied from mobQueue)
const mob = ref({ ...mobQueue[currentMobIndex.value] })
// The player's coin count
const count = ref(0)
// The current mob's HP
const hp = ref(mob.value.hp)

// When the mob changes, update mob and hp refs
watch(currentMobIndex, (idx) => {
  mob.value = { ...mobQueue[idx] }
  hp.value = mob.value.hp
})

// For HP bar animation and shake effect
const hpBar = ref(null)
const isShaking = ref(false)

// Damage pop effect state
const showDamagePop = ref(false)
const damagePopStyle = ref({})
const damagePopText = ref('OUCH!')
const damagePopColor = ref('text-red-500')
const damagePopRotation = ref('rotate-0')

// Funny damage texts
const damageTexts = [
  'OUCH!',
  'BAM!',
  'LOL',
  'POW!',
  'WHACK!',
  'BONK!',
  'ZAP!',
  'YIKES!',
  'SMACK!',
  'BOOM!',
  'SHABONK!',
  'KAPOW!',
  'OUCHIE!',
  'OOPSIE DAISY!',
  'HOT SEX!',
]

// Possible colors and rotations
const damageColors = [
  'text-red-500',
  'text-yellow-400',
  'text-green-500',
  'text-blue-500',
  'text-pink-500',
  'text-purple-500',
  'text-orange-500',
]
const damageRotations = [
  'rotate-3',
  '-rotate-3',
  'rotate-6',
  '-rotate-6',
  'rotate-12',
  '-rotate-12',
  'rotate-1',
  '-rotate-1',
  'rotate-0',
]

// Show damage pop randomly every 3-5 impacts
let impactCounter = 0
let nextImpactPop = Math.floor(Math.random() * 3) + 3 // 3-5

function triggerDamagePop() {
  // Randomize position (as % offsets)
  const x = 40 + Math.random() * 20 // 40% to 60% left
  const y = 20 + Math.random() * 60 // 20% to 80% top
  damagePopStyle.value = {
    left: `${x}%`,
    top: `${y}%`,
    transform: 'translate(-50%, -50%)',
  }
  // Randomize text, color, and rotation
  damagePopText.value = damageTexts[Math.floor(Math.random() * damageTexts.length)]
  damagePopColor.value = damageColors[Math.floor(Math.random() * damageColors.length)]
  damagePopRotation.value = damageRotations[Math.floor(Math.random() * damageRotations.length)]
  showDamagePop.value = false
  // Force reflow to restart animation
  void document.body.offsetWidth
  showDamagePop.value = true
  setTimeout(() => {
    showDamagePop.value = false
  }, 400)
}

// Compute the HP bar's color and shake class
const hpBarClass = computed(() => {
  let colorClass =
    hp.value === mob.value.maxHp
      ? 'bg-lime-400'
      : hp.value > mob.value.maxHp * 0.5
        ? 'bg-yellow-300'
        : hp.value > 0
          ? 'bg-red-400'
          : 'bg-gray-400'
  return [colorClass, isShaking.value ? 'animate-hp-shake' : '']
})

// Watch for HP changes to trigger shake animation
watch(hp, (newHp, oldHp) => {
  if (newHp < oldHp) {
    isShaking.value = false
    void hpBar.value?.offsetWidth
    isShaking.value = true

    // Randomly show damaged image (30% chance)
    showDamagedImg.value = false
    if (Math.random() < 0.3) {
      showDamagedImg.value = true
      setTimeout(() => {
        showDamagedImg.value = false
      }, 250)
    }

    setTimeout(() => {
      isShaking.value = false
    }, 400)

    // Damage pop logic
    impactCounter++
    if (impactCounter >= nextImpactPop) {
      triggerDamagePop()
      impactCounter = 0
      nextImpactPop = Math.floor(Math.random() * 3) + 3 // 3-5
    }
  }
})

// Handle clicking the mob (damage and coin logic)
function increment() {
  if (hp.value > 0) {
    hp.value--
    hp.value = Math.max(0, Math.round(hp.value * 100) / 100) // Round to 2 decimal place
    // If mob dies, move to next and add coins
    if (hp.value === 0 && currentMobIndex.value < mobQueue.length - 1) {
      currentMobIndex.value++
      count.value += mob.value.price
    }
  }
}

// State for showing damaged image
const showDamagedImg = ref(false)
</script>

<template>
  <div class="h-screen w-screen">
    <div
      class="ml-auto border w-1/3 h-1/2 min-h-3/4 flex flex-col items-center justify-start relative"
      id="mob-container"
    >
      <div class="flex flex-col items-center w-full">
        <!-- Mob image, click to damage -->
        <div class="relative">
          <img
            :src="showDamagedImg ? mob.damagedImg : mob.img"
            :alt="mob.alt"
            class="block border p-4 h-fit hover:cursor-pointer mt-8"
            width="270"
            height="270"
            @click="increment"
            :class="isShaking ? 'animate-slime-shake' : ''"
          />
          <!-- Damage effect: floating text, random position, random text, random color, random rotation, big, random trigger -->
          <transition name="damage-pop" mode="out-in">
            <div
              v-if="showDamagePop"
              class="absolute pointer-events-none select-none z-10"
              :style="damagePopStyle"
            >
              <span
                :class="[
                  'text-5xl font-extrabold drop-shadow-lg animate-damage-pop',
                  damagePopColor,
                  damagePopRotation,
                ]"
                style="
                  font-family:
                    'Comic Sans MS', 'Comic Sans', 'Chalkboard SE', 'Comic Neue', cursive,
                    sans-serif;
                "
              >
                {{ damagePopText }}
              </span>
            </div>
          </transition>
        </div>
        <!-- Mob name, shakes on damage -->
        <div
          class="mt-2 text-xl font-extrabold text-green-700 drop-shadow-lg tracking-wider px-0 py-0"
          :class="hpBarClass"
          style="
            background: none;
            font-family:
              'Comic Sans MS', 'Comic Sans', 'Chalkboard SE', 'Comic Neue', cursive, sans-serif;
            letter-spacing: 0.08em;
            text-shadow:
              2px 2px 0 #bbf7d0,
              4px 4px 0 #22d3ee;
          "
        >
          {{ mob.name }}
        </div>
        <!-- HP Bar with shake and color change -->
        <div class="w-1/2 mt-1">
          <div
            class="w-full h-2 bg-lime-200 rounded-full border-2 border-lime-500 overflow-hidden shadow-inner"
          >
            <div
              ref="hpBar"
              class="h-full transition-all duration-300"
              :class="hpBarClass"
              :style="{ width: (hp / mob.maxHp) * 100 + '%' }"
            ></div>
          </div>
          <!-- HP text below the bar -->
          <div
            class="text-[10px] text-lime-800 font-extrabold mt-0.5 text-center select-none"
            style="
              font-family:
                'Comic Sans MS', 'Comic Sans', 'Chalkboard SE', 'Comic Neue', cursive, sans-serif;
              letter-spacing: 0.04em;
              text-shadow:
                1px 1px 0 #fff176,
                2px 2px 0 #bef264;
              transform: rotate(-3deg) skewX(-8deg);
            "
          >
            {{ hp }} / {{ mob.maxHp }} HP LOL
          </div>
        </div>
      </div>
      <!-- Coin counter in top center of mob container -->
      <div
        class="absolute left-1/2 -translate-x-1/2 top-2 flex items-center gap-2 text-3xl font-bold select-none bg-green-50/90 rounded-full px-6 py-2 shadow border-4 border-green-600"
      >
        <!-- SVG coin icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 drop-shadow" viewBox="0 0 32 32">
          <!-- Funky, paint-like green coin with wobbly outline and dots -->
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
          <path
            d="M10 25 Q16 28 22 25"
            stroke="#065f46"
            stroke-width="1"
            fill="none"
            opacity="0.6"
          />
        </svg>
        <span class="text-green-900 drop-shadow">{{ count }}</span>
      </div>
    </div>
    <!-- Hunters section with circular background -->
    <div class="flex justify-center w-fit p-4 border ml-auto" id="hunters">
      <!-- Hunters row -->
      <div class="flex gap-7 p-0.25 mt-8 w-fit">
        <Hunter name="Jacob" color="orange" />
        <Hunter name="Jacob" color="lime" />
        <Hunter name="Jacob" />
        <Hunter name="Jacob" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Slight shake animation for HP bar and mob name */
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
    transform: translateX(1.5px);
  }
  70% {
    transform: translateX(-1.5px);
  }
  80% {
    transform: translateX(1px);
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

/* Damage pop animation */
@keyframes damage-pop {
  0% {
    opacity: 0;
    transform: scale(0.7) translateY(0);
    filter: blur(2px);
  }
  20% {
    opacity: 1;
    transform: scale(1.1) translateY(-6px);
    filter: blur(0);
  }
  60% {
    opacity: 1;
    transform: scale(1) translateY(-18px);
    filter: blur(0);
  }
  100% {
    opacity: 0;
    transform: scale(0.8) translateY(-32px);
    filter: blur(2px);
  }
}
.animate-damage-pop {
  animation: damage-pop 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97);
  pointer-events: none;
}
.damage-pop-enter-active,
.damage-pop-leave-active {
  transition: opacity 0.4s;
}
.damage-pop-enter-from,
.damage-pop-leave-to {
  opacity: 0;
}

/* Slime shake animation for mob image */
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
</style>
