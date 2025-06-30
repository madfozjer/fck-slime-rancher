import { defineStore } from 'pinia'
import { useHuntersStore } from './Hunters.js'
import { useWeaponsStore } from './Weapons.js'

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    hunters: [], // All obtained hunters
    weapons: [], // All obtained weapons
    activeHunters: 0,
    activeWeapons: 0,
    currentHunterID: 2,
    currentWeaponID: 2,
  }),
  actions: {
    initializeInventory() {
      if (this.hunters.length <= 0 && this.weapons.length <= 0) {
        this.addHunter('Jacob')
        this.hunters[0].id = 1
        this.addWeapon('Wooden Sword')
        console.log('Initialized inventory')
      }
    },

    async addHunter(name, effect) {
      const huntersStore = useHuntersStore()
      try {
        const hunter = huntersStore.getHunterByName(name)

        if (hunter) {
          const newHunter = { ...hunter }
          newHunter.id = 1 + this.currentHunterID
          this.currentHunterID++

          if (effect) {
            if (effect == 'Foil') newHunter['foil'] = true
          }

          this.hunters.push(newHunter)
        }
      } catch (error) {}
    },

    async addWeapon(name) {
      const weaponStore = useWeaponsStore()
      try {
        const weapon = weaponStore.getWeaponByName(name)

        if (weapon) {
          const newWeaapon = { ...weapon }
          newWeaapon.id = 1 + this.currentWeaponID
          this.currentWeaponID++
          this.weapons.push(newWeaapon)
        } else {
        }
      } catch (error) {}
    },
  },
})
