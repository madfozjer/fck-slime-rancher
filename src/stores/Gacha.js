import { defineStore } from 'pinia'

import { useHuntersStore } from './Hunters.js'
import { usePlayerStore } from './Player.js'
import { useInventoryStore } from './Inventory'

const BlankBanner = {
  name: 'exterminate (all) blankies',
  img: '',
  content: [
    { name: 'Jacob', rarity: 'Normal' },
    { name: 'Dandy', rarity: 'Normal' },
    { name: 'Cheese', rarity: 'Extra' },
  ],
  baseTicketPrice: 1,
  costIncreasePerRoll: 0.25,
  luckIncreasePerNormalRoll: 0.01,
  currentPrice: 1,
  currentLuck: 0,
  currentPriceFloat: 1.0,
}

const banners = { Blank: BlankBanner }

export const useGachaStore = defineStore('gacha', {
  state: () => ({
    banners: banners,
    HunterStore: useHuntersStore(),
    PlayerStore: usePlayerStore(),
    InventoryStore: useInventoryStore(),
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
          rarity = 'Extra'
        }

        const hunter = banners[banner].content.find((h) => h.rarity === rarity)
        if (!hunter) {
          console.error(`No hunter found for rarity: ${rarity} in banner: ${banner}`)
          return null
        }

        // Reset luck if a normal hunter is rolled
        if (rarity === 'Extra') {
          banners[banner].currentLuck = 0
        }

        // Add the hunter to the player's collection
        this.InventoryStore.addHunter(hunter.name)
        banners[banner].currentPriceFloat +=
          banners[banner].currentPrice * banners[banner].costIncreasePerRoll

        banners[banner].currentPrice = Math.floor(banners[banner].currentPriceFloat)

        console.log(`luck state: ${banners[banner].currentLuck}`)
        console.log(`chance for extra hunter: ${0.1 + banners[banner].currentLuck}`)

        // Return the rolled hunter
        return this.HunterStore.getHunterByName(hunter.name)
      } else {
        console.warn('Not enough bits to roll the gacha.')
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
