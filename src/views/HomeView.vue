<script setup>
// Import Vue Composition API helpers
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import Hunter from '@/components/Hunter.vue'
import { useMobsStore } from '@/stores/Mobs.js'
import { damageTexts, damageColors, damageRotations } from '@/stores/DamageTexts.js'
import MobDisplay from '@/components/MobDisplay.vue'
import CoinCounter from '@/components/CoinCounter.vue'
import HuntersRow from '@/components/HuntersRow.vue'
import { useHuntersStore } from '@/stores/Hunters.js'
import { useWeaponsStore } from '@/stores/Weapons.js'
import { toRaw } from 'vue'
import { useAnimationStore } from '@/stores/Animation.js'

// Use the mobs store
const mobsStore = useMobsStore()

// Generate mob queue from store
const mobQueue = mobsStore.generateMobQueue(12)

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
const animationStore = useAnimationStore()

const isShaking = computed(() => animationStore.mobShake)

// Damage pop effect state
const showDamagePop = ref(false)
const damagePopStyle = ref({})
const damagePopText = ref('OUCH!')
const damagePopColor = ref('text-red-500')
const damagePopRotation = ref('rotate-0')

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
    animationStore.triggerMobShake()
    // Randomly show damaged image (30% chance)
    showDamagedImg.value = false
    if (Math.random() < 0.3) {
      showDamagedImg.value = true
      setTimeout(() => {
        showDamagedImg.value = false
      }, 250)
    }
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

// Use the hunters store
const huntersStore = useHuntersStore()
const weaponsStore = useWeaponsStore()

// Use hunters from the store as a reactive array
const hunters = ref([
  {
    ...huntersStore.getHunterByName('Jacob'),
    weapon: weaponsStore.getWeaponById(1),
    id: 1,
  },
  {
    ...huntersStore.getHunterByName('Jacob'),
    weapon: weaponsStore.getWeaponById(2),
    id: 2,
  },
  {
    ...huntersStore.getHunterByName('Jacob'),
    weapon: weaponsStore.getWeaponById(1),
    id: 3,
  },
  {
    ...huntersStore.getHunterByName('Jacob'),
    weapon: weaponsStore.getWeaponById(2),
    id: 4,
  },
])

// Calculate the average attack interval based on all hunters' speed
const avgAttackInterval = computed(() => {
  const intervals = hunters.value.map((h) => (h?.speed ? 1000 / h.speed : 1000))
  if (intervals.length === 0) return 1000
  return intervals.reduce((a, b) => a + b, 0) / intervals.length
})

let attackInterval = null

onMounted(() => {
  attackInterval = setInterval(() => {
    if (hp.value > 0) {
      // Trigger shake for all hunters via animation store
      hunters.value.forEach((h) => {
        animationStore.triggerHunterShake(h.id)
      })
      // Sum all hunters' weapon damage (phys + psi), applying modifiers
      const totalAtk = hunters.value.reduce((sum, h) => {
        const w = h.weapon
        const mod = h.modifier || { phys: 1, psi: 1 }
        return sum + (w?.physDamage || 0) * (mod.phys || 1) + (w?.psiDamage || 0) * (mod.psi || 1)
      }, 0)
      if (totalAtk > 0) {
        hp.value = Math.max(0, Math.round((hp.value - totalAtk) * 100) / 100)
        // If mob dies, move to next and add coins
        if (hp.value === 0 && currentMobIndex.value < mobQueue.length - 1) {
          currentMobIndex.value++
          count.value += mob.value.price
        }
      }
    }
  }, avgAttackInterval.value)
})

onUnmounted(() => {
  if (attackInterval) clearInterval(attackInterval)
})

// DPS calculation (damage per second)
const dps = computed(() => {
  // For each hunter, their DPS is ((phys*mod)+(psi*mod)) * speed
  return hunters.value
    .reduce((sum, h) => {
      const w = h.weapon
      const mod = h.modifier || { phys: 1, psi: 1 }
      return (
        sum +
        ((w?.physDamage || 0) * (mod.phys || 1) + (w?.psiDamage || 0) * (mod.psi || 1)) *
          (h?.speed || 1)
      )
    }, 0)
    .toFixed(2)
})
</script>

<template>
  <div class="h-screen w-screen">
    <div
      class="ml-auto border w-1/3 h-1/2 min-h-3/4 flex flex-col items-center justify-start relative"
      id="mob-container"
    >
      <MobDisplay
        :mob="mob"
        :hp="hp"
        :isShaking="isShaking"
        :showDamagedImg="showDamagedImg"
        :showDamagePop="showDamagePop"
        :damagePopText="damagePopText"
        :damagePopColor="damagePopColor"
        :damagePopRotation="damagePopRotation"
        :damagePopStyle="damagePopStyle"
        :onDamage="increment"
      />
      <CoinCounter :count="count" />
    </div>

    <div class="flex flex-col ml-auto w-fit border">
      <!-- DPS display above hunters -->
      <div class="w-full flex justify-center items-center mt-2 mb-1">
        <div class="text-lg font-bold text-blue-700 bg-blue-100 rounded px-4 py-1 shadow">
          DPS: {{ dps }}
        </div>
      </div>
      <!-- Hunters section with circular background -->
      <div class="flex p-4 -mt-8" id="hunters">
        <HuntersRow :hunters="hunters" />
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>
