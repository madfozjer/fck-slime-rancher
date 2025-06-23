// Inventory.js
import { defineStore } from 'pinia'
import { useHuntersStore } from './Hunters.js' // Make sure paths are correct
import { useWeaponsStore } from './Weapons.js' // Make sure paths are correct

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    hunters: [], // All obtained hunters
    weapons: [], // All obtained weapons
  }),
  actions: {
    initializeInventory() {
      const huntersStore = useHuntersStore()
      const weaponsStore = useWeaponsStore()
      this.hunters = [...huntersStore.hunters]
      this.weapons = [...weaponsStore.weapons]
      console.log('Inventory initialized.')
    },

    async addHunter(name) {
      const huntersStore = useHuntersStore()
      try {
        const hunter = huntersStore.getHunterByName(name)

        if (hunter) {
          const newHunter = { ...hunter }
          newHunter.id = 1 + this.hunters.length
          this.hunters.push(newHunter)
          console.log(`Hunter "${newHunter.name}" added to inventory.`)
        } else {
          console.warn(`Hunter "${name}" not found in HuntersStore.`)
        }
      } catch (error) {
        console.error(`Error adding hunter "${name}":`, error)
      }
    },
    // Add more inventory management actions here later
  },
})
