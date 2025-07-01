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
    clearInventorySave() {
      localStorage.setItem('hunters', JSON.stringify([]))
      localStorage.setItem('weapons', JSON.stringify([]))
      localStorage.setItem('activeHunters', JSON.stringify([]))
    },
    initializeInventory() {
      console.log(localStorage.getItem('hunters'))
      if (!localStorage.getItem('hunters') || !localStorage.getItem('activeHunters')) {
        this.clearInventorySave()
        return null
      }

      if (
        localStorage.getItem('hunters').length <= 0 &&
        localStorage.getItem('activeHunters') <= 0
      ) {
        this.fillInventory()
        return null
      }
    },

    fillInventory() {
      this.addHunter('Jacob')
      this.hunters[0].id = 1
      this.addWeapon('Wooden Sword')
      console.log('Initialized inventory') //
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
          this.updateStorage()
        }
      } catch (error) {}
    },

    async addWeapon(name) {
      const weaponStore = useWeaponsStore()
      try {
        const weapon = weaponStore.getWeaponByName(name)

        if (weapon) {
          const newWeapon = { ...weapon }
          newWeapon.id = 1 + this.currentWeaponID
          this.currentWeaponID++
          this.weapons.push(newWeapon)
          this.updateStorage()
        } else {
        }
      } catch (error) {}
    },

    updateStorage() {
      localStorage.setItem('hunters', JSON.stringify(this.hunters))
      localStorage.setItem('weapons', JSON.stringify(this.weapons))
      localStorage.setItem('currentHunterID', this.currentHunterID)
      localStorage.setItem('currentWeaponID', this.currentWeaponID)
    },
  },
})
