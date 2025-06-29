<script setup>
import { ref } from 'vue'
import { useInventoryStore } from '@/stores/Inventory.js'
import HunterTooltip from './HunterTooltip.vue'
import WeaponTooltip from './WeaponTooltip.vue'

const inventoryStore = useInventoryStore()
const inventoryTab = ref('hunters')
const showHunterTooltip = ref(null)
const showWeaponTooltip = ref(null)
</script>

<template>
  <div
    id="inventory"
    class="bg-white/90 border-t rounded shadow p-3 w-full h-full flex flex-col"
    style="min-height: 180px"
  >
    <div class="font-bold text-base text-blue-900 mb-2">Inventory</div>
    <div class="flex mb-2">
      <button
        class="flex-1 py-1 px-2 rounded-l border border-blue-300 text-xs font-semibold focus:outline-none"
        :class="inventoryTab === 'hunters' ? 'bg-blue-200 text-blue-900' : 'bg-white text-blue-500'"
        @click="inventoryTab = 'hunters'"
      >
        Hunters
      </button>
      <button
        class="flex-1 py-1 px-2 rounded-r border border-blue-300 text-xs font-semibold focus:outline-none -ml-px"
        :class="inventoryTab === 'weapons' ? 'bg-blue-200 text-blue-900' : 'bg-white text-blue-500'"
        @click="inventoryTab = 'weapons'"
      >
        Weapons
      </button>
    </div>

    <div class="flex-1 overflow-y-scroll" style="min-height: 0px">
      <div v-if="inventoryTab === 'hunters'">
        <div class="text-xs text-blue-900 mb-1">
          Hunters: {{ inventoryStore.hunters.length + inventoryStore.activeHunters }}
        </div>
        <div
          v-if="inventoryStore.hunters.length === 0"
          class="text-xs text-gray-400 text-center py-4"
        >
          No hunters in inventory.
        </div>
        <div class="grid grid-cols-5 gap-2">
          <div
            v-for="h in inventoryStore.hunters"
            :key="h.id"
            class="flex flex-col items-center p-1 border rounded bg-white/80 cursor-grab relative group"
            :draggable="h.id ? true : false"
            @dragstart="$emit('drag-hunter', h.id)"
            @mouseenter="showHunterTooltip = h.id"
            @mouseleave="showHunterTooltip = null"
            @click="console.log(h)"
          >
            <img :src="h.img" :alt="h.name" class="w-10 h-10 rounded-full border mb-1" />
            <span class="text-xs font-semibold text-blue-900 text-center">{{ h.name }}</span>
            <span class="text-xs text-gray-500 text-center">{{ h.rarity }}</span>
            <HunterTooltip
              v-if="h.name && showHunterTooltip === h.id"
              :hunter="h"
              position="right"
            />
          </div>
        </div>
      </div>
      <div v-else>
        <div class="text-xs text-blue-900 mb-1">
          Weapons: {{ inventoryStore.weapons.length + inventoryStore.activeWeapons }}
        </div>
        <div
          v-if="inventoryStore.weapons.length === 0"
          class="text-xs text-gray-400 text-center py-4"
        >
          No weapons in inventory.
        </div>
        <div class="grid grid-cols-5 gap-2">
          <div
            v-for="w in inventoryStore.weapons"
            :key="w.id"
            class="flex flex-col items-center p-1 border rounded bg-white/80 relative group hover:cursor-pointer"
            :draggable="w.id ? true : false"
            @click="$emit('drag-weapon', w.id)"
            @mouseenter="showWeaponTooltip = w.id"
            @mouseleave="showWeaponTooltip = null"
          >
            <span class="text-xs font-semibold text-blue-900 text-center">{{ w.name }}</span>
            <span class="text-xs text-gray-500 text-center"
              >Phys: {{ w.physDamage }}, Psi: {{ w.psiDamage }}</span
            >
            <WeaponTooltip
              v-if="w.name && showWeaponTooltip === w.id"
              :weapon="w"
              position="right"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
