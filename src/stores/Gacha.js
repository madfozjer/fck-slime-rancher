import { defineStore } from 'pinia'

import { useHuntersStore } from './Hunters.js'
import { usePlayerStore } from './Player.js'
import { useInventoryStore } from './Inventory'
import { useWeaponsStore } from './Weapons.js'

const BlankBanner = {
  name: 'exterminate (all) blankies',
  img: '',
  content: [
    { name: 'Jacob', rarity: 'Normal', type: 'Hunter' },
    { name: 'Dandy', rarity: 'Normal', type: 'Hunter' },
    { name: 'Cheese', rarity: 'Extra', type: 'Hunter' },
    { name: 'Swidlerton', rarity: 'Extraordinary', type: 'Hunter' },
    { name: 'Wooden Sword', rarity: 'Normal', type: 'Weapon' },
    { name: 'Mind Wand', rarity: 'Normal', type: 'Weapon' },
  ],
  baseTicketPrice: 1,
  costIncreasePerRoll: 0.25,
  luckIncreasePerNormalRoll: 1,
  currentPrice: 1,
  currentLuck: 0,
  currentPriceFloat: 1.0,
  chances: { Normal: 0.9, Extra: 0.09, Extraordinary: 0.01 },
}

const banners = { Blank: BlankBanner }

export const useGachaStore = defineStore('gacha', {
  state: () => ({
    banners: banners,
    HunterStore: useHuntersStore(),
    PlayerStore: usePlayerStore(),
    InventoryStore: useInventoryStore(),
    WeaponStore: useWeaponsStore(),
  }),
  actions: {
    rollGacha(banner) {
      if (!banners[banner]) {
        console.error(`Banner not found: ${banner}`)
        return null
      }

      if (this.PlayerStore.getBits() >= banners[banner].currentPrice) {
        this.PlayerStore.decrementBits(banners[banner].currentPrice)
        banners[banner].currentLuck += banners[banner].luckIncreasePerNormalRoll
        const roll = Math.random() + banners[banner].currentLuck

        let rarity = 'Normal'
        if (roll > 0.9) {
          if (roll > 0.99) rarity = 'Extraordinary'
          else rarity = 'Extra'
        }

        const itemsOfRarity = banners[banner].content.filter((item) => item.rarity === rarity)

        if (itemsOfRarity.length > 0) {
          const randomIndex = Math.floor(Math.random() * itemsOfRarity.length)

          const drop = itemsOfRarity[randomIndex]

          banners[banner].currentPriceFloat +=
            banners[banner].currentPrice * banners[banner].costIncreasePerRoll

          banners[banner].currentPrice = Math.floor(banners[banner].currentPriceFloat)

          console.log(`luck state: ${banners[banner].currentLuck}`)
          console.log(`chance for extra hunter: ${0.1 + banners[banner].currentLuck}`)

          if (rarity != 'Normal') {
            banners[banner].currentLuck = 0
          }

          if (drop.type == 'Hunter') {
            const effects = []
            drop['foil'] = false
            const effectDrop = Math.floor(Math.random() * 100)
            if (effectDrop > 93) {
              effects.push('Foil')
              this.InventoryStore.addHunter(drop.name, 'Foil')
            } else {
              // Add the hunter to the player's collection
              effects.push('Standard')
              this.InventoryStore.addHunter(drop.name)
            }

            // Return the rolled hunter
            return [this.HunterStore.getHunterByName(drop.name), effects]
          } else if (drop.type == 'Weapon') {
            // Add the weapon to the player's collection
            this.InventoryStore.addWeapon(drop.name)

            // Return the rolled weapon
            return [this.WeaponStore.getWeaponByName(drop.name), 0]
          }
        } else {
          console.error(`No hunter found for rarity: ${rarity} in banner: ${banner}`)
          return null
        }
      } else {
        alert(`Not enough bits to roll the gacha, you have only ${this.PlayerStore.getBits()} bits`)
        return null
      }
    },
    getPrice(banner) {
      if (!banners[banner]) {
        console.error(`Banner not found: ${banner}`)
        return null
      }
      return banners[banner].currentPrice
    },
  },
})
