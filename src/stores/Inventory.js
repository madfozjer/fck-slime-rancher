// Inventory.js
import { defineStore } from 'pinia'
import { useHuntersStore } from './Hunters.js' // Make sure paths are correct
import { useWeaponsStore } from './Weapons.js' // Make sure paths are correct

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    hunters: [], // All obtained hunters
    weapons: [], // All obtained weapons
    activeHunters: 0,
    activeWeapons: 0,
  }),
  actions: {
    initializeInventory() {
      if (this.hunters.length <= 0 && this.weapons.length <= 0) {
        const weaponsStore = useWeaponsStore()
        this.addHunter('Jacob')
        this.addWeapon('Wooden Sword')
        this.hunters[0].weapon = weaponsStore.getWeaponByName('Mind Wand')
        console.log('Initialized inventory')
      }
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

    async addWeapon(name) {
      const weaponStore = useWeaponsStore()
      try {
        const weapon = weaponStore.getWeaponByName(name)

        if (weapon) {
          const newWeaapon = { ...weapon }
          newWeaapon.id = 1 + this.weapons.length
          this.weapons.push(newWeaapon)
          console.log(`Weapon "${newWeaapon.name}" added to inventory.`)
        } else {
          console.warn(`newWeaapon "${name}" not found in WeaponsStore.`)
        }
      } catch (error) {
        console.error(`Error adding weapon "${name}":`, error)
      }
    },
    // Add more inventory management actions here later
  },
})
