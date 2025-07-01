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
      try {
        // this.clearInventorySave()
        if (
          localStorage.getItem('hunters') != null &&
          localStorage.getItem('activeHunters') != null
        ) {
          if (
            JSON.parse(localStorage.getItem('hunters')).length <= 0 &&
            JSON.parse(localStorage.getItem('activeHunters')).length <= 0
          ) {
            this.addHunter('Jacob')
            this.hunters[0].id = 1
            this.addWeapon('Wooden Sword')
            console.log('Initialized inventory')
          } else {
            this.currentHunterID = parseInt(localStorage.getItem('currentHunterID'))
            this.currentWeaponID = parseInt(localStorage.getItem('currentWeaponID'))
            this.hunters = JSON.parse(localStorage.getItem('hunters'))
            this.weapons = JSON.parse(localStorage.getItem('weapons'))
          }
        } else {
          this.addHunter('Jacob')
          this.hunters[0].id = 1
          this.addWeapon('Wooden Sword')
          console.log('Initialized inventory')
        }
      } catch (err) {
        console.error('Error while trying to load previous save:', err)
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
