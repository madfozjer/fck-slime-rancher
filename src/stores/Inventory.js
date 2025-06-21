import { defineStore } from 'pinia'
import { useHuntersStore } from './Hunters.js'
import { useWeaponsStore } from './Weapons.js'

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    hunters: [], // All obtained hunters
    weapons: [], // All obtained weapons
  }),
  actions: {
    initializeInventory() {
      // For now, add all available hunters and weapons
      const huntersStore = useHuntersStore()
      const weaponsStore = useWeaponsStore()
      this.hunters = [...huntersStore.hunters]
      this.weapons = [...weaponsStore.weapons]
    },
    // Add more inventory management actions here later
  },
})
