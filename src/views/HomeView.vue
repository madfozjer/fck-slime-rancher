<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
/*TODO:
   PHONE PROTECTION/PHONE COMPATABILITY
   SAVE PROTECTION AND ENCRYPTION
*/
import { damageTexts, damageColors, damageRotations } from '@/stores/DamageTexts.js'
import MobDisplay from '@/components/MobDisplay.vue'
import CoinCounter from '@/components/CoinCounter.vue'
import HuntersRow from '@/components/HuntersRow.vue'
import { useMobsStore } from '@/stores/Mobs.js'
import { useHuntersStore } from '@/stores/Hunters.js'
import { useWeaponsStore } from '@/stores/Weapons.js'
import { usePlayerStore } from '@/stores/Player.js'
import { useAnimationStore } from '@/stores/Animation.js'
import { useInventoryStore } from '@/stores/Inventory.js'
import Inventory from '@/components/Inventory.vue'
import Gacha from '@/components/Gacha.vue'
import Base from '@/components/Base.vue'
import BitsCounter from '@/components/BitsCounter.vue'
import Timer from '../components/Timer.vue'

const topLeftTab = ref('gacha')

const mobsStore = useMobsStore()

const playerStore = usePlayerStore()
playerStore.init()

const mobQueue = mobsStore.generateMobQueue(20)

// Track which mob is currently active
const currentMobIndex = ref(0)
// The current mob object (copied from mobQueue)
const mob = ref({ ...mobQueue[currentMobIndex.value] })
// The current mob's HP
const hp = ref(mob.value.hp)

// When the mob changes, update mob and hp refs
watch(currentMobIndex, (idx) => {
  mob.value = { ...mobQueue[idx] }
  hp.value = mob.value.hp
  if (mob.value.boss) startTimer(mob.value.bossTime)
  if (currentMobIndex.value >= mobQueue.length) dungeonEnd()
})

var dungeonActive = ref(true)

function dungeonEnd() {
  dungeonActive.value = false
  playerStore.bits += 20
  alert('ГОООООООООООООООЛ')
}

function retry() {
  dungeonActive.value = true
  console.log(dungeonActive.value)
  mobQueue.value = mobsStore.generateMobQueue(1)
  currentMobIndex.value = 0
  mob.value = { ...mobQueue[currentMobIndex.value] }
}

function killMob() {
  handleDeath()
}

// For HP bar animation and shake effect
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

// Resources shaking
const shakeCointer = ref(false)
const shakeBits = ref(false)

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
    shakeCointer.value = true
    hp.value = Math.max(0, Math.round(hp.value * 100) / 100) // Round to 2 decimal place
    if (Math.random() > 0.95) {
      playerStore.addCoins(mob.value.price)
    }
    // If mob dies, move to next and add coins
    if (hp.value <= 0 && currentMobIndex.value < mobQueue.length) {
      handleDeath()
    }
  }
}

// State for showing damaged image
const showDamagedImg = ref(false)

// Use the hunters store
const huntersStore = useHuntersStore()
const weaponsStore = useWeaponsStore()
const inventoryStore = useInventoryStore()
inventoryStore.initializeInventory()

// Use hunters from the store as a reactive array
const hunters = ref(null)
if (localStorage.getItem('activeHunters'))
  hunters.value = JSON.parse(localStorage.getItem('activeHunters'))
else hunters.value = []

if (hunters.value.length <= 0) {
  hunters.value.push(huntersStore.getHunterById(2))
  hunters.value[0].weapon = weaponsStore.getWeaponById(2)
  inventoryStore.activeHunters++
  inventoryStore.activeWeapons++
}

// Calculate the average attack interval based on all hunters' speed
const avgAttackInterval = computed(() => {
  const baseInterval = 1000 // Represents 1000ms or 1 second for a speed of 1

  const validHunterIntervals = hunters.value
    .map((hunter) => {
      // Ensure speed is a positive number; otherwise, use a default slow speed
      const effectiveSpeed = hunter?.speed && hunter.speed > 0 ? hunter.speed : 1 // Default to 1 if speed is invalid

      // Higher speed results in a shorter interval (faster attack)
      return baseInterval / effectiveSpeed
    })
    .filter((interval) => !isNaN(interval) && isFinite(interval)) // Filter out any non-numeric or infinite results

  if (validHunterIntervals.length === 0) {
    return baseInterval // Return a default interval if no valid hunters
  }

  // Calculate the average of the valid intervals
  const totalIntervalSum = validHunterIntervals.reduce((sum, interval) => sum + interval, 0)
  return totalIntervalSum / validHunterIntervals.length
})

let attackInterval = null

var timeLeft = ref(0)
var timerRunning = false
var timerInterval = null // To store the interval ID

onMounted(() => {})

function startTimer(time) {
  resetTimer(time)

  timerRunning = true
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      mob.value = undefined
      dungeonActive.value = false
      console.log(`dungeonActive ${dungeonActive.value}`)
      stopTimer()
      // Add your "time's up" logic here, e.g., $emit('timer-end');
    }
  }, 1000)
}

function stopTimer() {
  clearInterval(timerInterval)
  timerRunning = false
  timerInterval = null
}

function resetTimer(time) {
  timeLeft.value = time
}

// Lifecycle hook to clean up the timer when the component is destroyed
onUnmounted(() => {
  stopTimer()
})

onMounted(() => {
  attackInterval = setInterval(() => {
    if (hp.value > 0 && mob.value) {
      // Trigger shake for all hunters via animation store
      hunters.value.forEach((h) => {
        animationStore.triggerHunterShake(h.id)
      })
      // Sum all hunters' weapon damage (phys + psi), applying modifiers
      const totalAtk = hunters.value.reduce((sum, h) => {
        const w = h.weapon
        const mod = h.modifier || { phys: 0, psi: 0 }
        return sum + (w?.physDamage || 0) * (mod.phys || 0) + (w?.psiDamage || 0) * (mod.psi || 0)
      }, 0)
      if (totalAtk > 0) {
        hp.value = Math.max(0, Math.round((hp.value - totalAtk) * 100) / 100)
        // If mob dies, move to next and add coins
        if (hp.value <= 0 && currentMobIndex.value < mobQueue.length) {
          handleDeath()
        }
      }
    }
  }, avgAttackInterval.value)
})

onUnmounted(() => {
  if (attackInterval) clearInterval(attackInterval)
})

function handleDeath() {
  if (mob.value.boss) stopTimer()
  currentMobIndex.value++
  playerStore.addCoins(mob.value.price)
  playerStore.addBits(mob.value.bits)
  shakeCointer.value = true
  shakeBits.value = true
}

// DPS calculation (damage per second)
const dps = computed(() => {
  const totalDps = hunters.value.reduce((sum, h) => {
    if (!h || !h.name) {
      return sum
    }

    const weapon = h.weapon || { physDamage: 0, psiDamage: 0 }
    const modifier = h.modifier || { phys: 0, psi: 0 }

    const physDmg = weapon.physDamage || 0
    const psiDmg = weapon.psiDamage || 0
    const physMod = modifier.phys || 0
    const psiMod = modifier.psi || 0

    const hunterDps = physDmg * physMod + psiDmg * psiMod

    return sum + hunterDps
  }, 0)

  // Handle cases where totalDps might still be NaN (e.g., if initial hunters.value is weird)
  // or if all calculations somehow resulted in NaN despite the precautions.
  if (isNaN(totalDps)) {
    return '0.000'
  }

  return totalDps.toFixed(2)
})

const dpsTooltip = ref(false)
let draggedWeaponId = ref(null)
let draggedHunterId = ref(null)

const saveEditor = ref(false)

function onDragWeapon(weaponId) {
  draggedWeaponId.value = weaponId
}

function onDragHunter(hunterId) {
  if (hunterId) draggedHunterId.value = hunterId
}

// TODO: checkout later and maybe refactor
function onDropWeapon(hunterId) {
  if (draggedWeaponId.value == null) return
  // Find the hunter and weapon
  const hunter = hunters.value.find((h) => h.id === hunterId)
  const weaponIdx = inventoryStore.weapons.findIndex((w) => w.id === draggedWeaponId.value)
  if (!hunter || weaponIdx === -1) return
  // Swap the hunter's weapon with the inventory weapon
  const oldWeapon = hunter.weapon
  hunter.weapon = inventoryStore.weapons[weaponIdx]

  if (oldWeapon) inventoryStore.weapons[weaponIdx] = oldWeapon
  else {
    inventoryStore.weapons.splice(weaponIdx, 1)
  }

  // Trigger shake animation for this hunter
  animationStore.triggerHunterShake(hunter.id)
  draggedWeaponId.value = null
  inventoryStore.activeWeapons++
  playerStore.setActiveHunters(hunters.value)
  inventoryStore.updateStorage()
}

function onDropHunter(targetHunterId) {
  if (draggedHunterId.value == null) return
  // Find the dragged hunter in inventory
  const invIdx = inventoryStore.hunters.findIndex((h) => h.id === draggedHunterId.value)
  if (invIdx === -1) return
  // Replace the target hunter and put the old one back to inventory
  const idxTarget = hunters.value.findIndex((h) => h.id === targetHunterId)
  if (idxTarget === -1) return
  const newHunter = inventoryStore.hunters.splice(invIdx, 1)[0]
  // Save the weapon from the currently equipped hunter
  const oldWeapon = hunters.value[idxTarget].weapon
  // Give the swapped-in hunter the old weapon
  newHunter.weapon = oldWeapon
  // Put the old hunter (with NO weapon) back to inventory
  const oldHunter = { ...hunters.value[idxTarget], weapon: null }
  if (oldHunter.id) inventoryStore.hunters.push(oldHunter)
  hunters.value[idxTarget] = newHunter
  animationStore.triggerHunterShake(newHunter.id)
  draggedHunterId.value = null
  inventoryStore.activeHunters++
  playerStore.setActiveHunters(hunters.value)
  inventoryStore.updateStorage()
}

function onUnequipHunter(hunterId) {
  if (hunterId == null) return
  // Find the hunter
  const hunter = hunters.value.find((h) => h.id === hunterId)
  if (!hunter) return

  // Delete weapon from hunter's hand
  if (hunter.weapon != undefined) inventoryStore.addWeapon(hunter.weapon.name)
  hunter.weapon = undefined

  // Trigger shake animation for this hunter
  animationStore.triggerHunterShake(hunter.id)
  inventoryStore.activeWeapons--
  playerStore.setActiveHunters(hunters.value)
  inventoryStore.updateStorage()
}

function onPullHunter(hunterId, hunterSlot) {
  // Find activated hunter
  const hunter = hunters.value.find((h) => h.id === hunterId)
  if (!hunter) return
  // Retrieve weapon from hunter
  if (hunter.weapon != undefined) inventoryStore.addWeapon(hunter.weapon.name)
  hunter.weapon = undefined
  inventoryStore.activeWeapons--

  // Put the old hunter (with NO weapon) back to inventory
  inventoryStore.hunters.push(hunter)
  hunters.value.splice(hunterSlot, 1)

  hunters.value.push({})
  console.log(hunters.value)
  inventoryStore.activeHunters--
  playerStore.setActiveHunters(hunters.value)
  inventoryStore.updateStorage()
}

const handleAnimationEnd = (type) => {
  if (type === 'coin') {
    shakeCointer.value = false
  } else if (type === 'bits') {
    shakeBits.value = false
  }
}
</script>

<template>
  <div id="app" class="h-screen w-screen flex flex-col overflow-hidden">
    <!-- DEV TOOLS
    <button class="fixed" @click="(illMob())">kill</button>
    <div class="fixed ml-8">{{ dungeonActive }}</div>
    -->
    <div class="flex flex-col md:flex-row w-full flex-grow-[3]">
      <div class="w-full md:w-2/3 p-1">
        <div class="flex mb-2">
          <button
            class="flex-1 py-1 px-2 rounded-l border border-blue-300 text-xs font-semibold focus:outline-none"
            :class="topLeftTab == 'gacha' ? 'bg-blue-200 text-blue-900' : 'bg-white text-blue-500'"
            @click="topLeftTab = 'gacha'"
          >
            Gacha
          </button>
          <button
            class="flex-1 py-1 px-2 rounded-r border border-blue-300 text-xs font-semibold focus:outline-none"
            :class="topLeftTab == 'base' ? 'bg-blue-200 text-blue-900' : 'bg-white text-blue-500'"
            @click="topLeftTab = 'base'"
          >
            XX Base
          </button>
        </div>
        <Base v-if="topLeftTab === 'base'" />
        <Gacha v-else-if="topLeftTab === 'gacha'" />
      </div>

      <div
        class="w-full md:w-1/3 border-t h-full flex flex-col items-center justify-start relative border"
        id="mob-container"
      >
        <div class="z-1">
          <CoinCounter
            :count="playerStore.coins"
            :shake="shakeCointer"
            @animation-end="handleAnimationEnd('coin')"
          />
          <BitsCounter
            :count="playerStore.bits"
            :shake="shakeBits"
            @animation-end="handleAnimationEnd('bits')"
          />
        </div>
        <div v-if="dungeonActive">
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
        </div>
        <button
          @click="retry()"
          v-if="!dungeonActive"
          class="text-xl text-green-800 font-bold border-4 border-dotted p-2 px-4 mt-64 mb-64 hover:bg-green-50 hover:cursor-pointer"
        >
          RETRY
        </button>
        <Timer
          :timeLeft="timeLeft"
          v-if="timerRunning & dungeonActive"
          class="justify-end items-end"
        />
      </div>
    </div>

    <div class="flex flex-col md:flex-row w-full h-1/3">
      <div class="w-full md:w-2/3 h-full">
        <Inventory @drag-weapon="onDragWeapon" @drag-hunter="onDragHunter" />
      </div>

      <div class="w-full md:w-1/3 flex flex-col border-t md:border-t-0 md:border-l h-full">
        <div class="w-full flex justify-center items-center mt-2 mb-1 hover:cursor-pointer">
          <div
            class="relative group text-lg font-bold text-blue-700 bg-blue-100 rounded px-4 py-1 shadow"
            @mouseenter="dpsTooltip = true"
            @mouseleave="dpsTooltip = false"
          >
            <div
              v-if="dpsTooltip && dps > 0.0"
              class="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 bg-white bg-opacity-95 border border-blue-400 rounded shadow px-6 py-5 text-base z-30 w-80 sm:w-[400px] pointer-events-none transition-opacity duration-200 text-gray-900"
            >
              <div class="mb-2 font-semibold text-blue-700 text-lg">DPS Breakdown</div>
              <div v-for="h in hunters" :key="h.id" class="mb-2">
                <div v-if="h.id">
                  <span class="font-bold text-blue-900">{{ h.name }}</span>
                  <span v-if="h.weapon" class="text-blue-700"> ({{ h.weapon.name }})</span>:
                  <span class="text-pink-700"
                    >Speed: <span class="font-mono">{{ h.speed }}</span></span
                  >,
                  <span v-if="h.weapon" class="text-red-700"
                    >Phys: <span class="font-mono">{{ h.weapon.physDamage }}</span></span
                  >,
                  <span v-if="h.weapon" class="text-purple-700"
                    >Psi: <span class="font-mono">{{ h.weapon.psiDamage }}</span></span
                  >
                  <span v-if="h.modifier" class="text-green-700">
                    | Mod: Phys x{{ h.modifier.phys }}, Psi x{{ h.modifier.psi }}
                  </span>
                  <span v-if="h.weapon" class="block mt-1 text-gray-700 ml-2">
                    <span class="font-semibold">Total:</span>
                    <span class="text-blue-800">(</span
                    ><span class="text-red-700">{{ h.weapon.physDamage }}</span
                    ><span class="text-blue-800">×</span
                    ><span class="text-green-700">{{ h.modifier?.phys ?? 1 }}</span
                    ><span class="text-blue-800">)</span> <span class="text-blue-800">+(</span>
                    <span class="text-purple-700">{{ h.weapon.psiDamage }}</span
                    ><span class="text-blue-800">×</span
                    ><span class="text-green-700">{{ h.modifier?.psi ?? 1 }})</span>
                    <span class="text-blue-800">=</span>
                    <span class="font-mono text-orange-600">{{
                      (
                        (h.weapon.physDamage || 0) * (h.modifier?.phys ?? 1) +
                        (h.weapon.psiDamage || 0) * (h.modifier?.psi ?? 1)
                      ).toFixed(3)
                    }}</span>
                  </span>
                </div>
              </div>
              <div class="mt-4 pt-2 border-t border-blue-200 text-lg font-bold text-center">
                Final Total: <span class="text-orange-600">{{ dps }}</span
                ><br />
                Attack interval:
                <span class="text-green-600">{{ (avgAttackInterval / 1000).toFixed(2) }}</span>
              </div>
            </div>
            DPS: {{ dps }}
            <span class="block text-xs text-blue-900 font-normal mt-0.5"
              >Hunters attack every {{ (avgAttackInterval / 1000).toFixed(2) }}s</span
            >
          </div>
        </div>
        <div class="flex p-4" id="hunters" v-if="hunters">
          <HuntersRow
            :hunters="hunters"
            @drop-weapon="onDropWeapon"
            @drop-hunter="onDropHunter"
            @unequip="onUnequipHunter"
            @pull-hunter="onPullHunter"
          />
        </div>
      </div>
    </div>
    <div class="font-mono opacity-65 text-gray-700 fixed bottom-2 right-8 pointer-events-none">
      v. a.0.1
    </div>
    <div
      class="border p-1 rounded-md fixed right-2 top-2 text-2xl hover:cursor-pointer font-bold"
      @click="saveEditor = !saveEditor"
    >
      =
    </div>
    <div
      class="border fixed p-2 text-2xl flex flex-col gap-2"
      style="
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%); /* Moves the element back by half its own width/height */
      "
    >
      This is save editor.
      <button
        class="border rounded-md w-fit p-1 text-xl bg-red-100 font-semibold hover:cursor-pointer"
        @click="playerStore.resetSave()"
      >
        reset save
      </button>
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

/* Ensure these are in your global CSS */
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#app {
  height: 100%;
}
</style>
