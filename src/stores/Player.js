import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    coins: 0,
    bits: 0,
  }),
  actions: {
    decrementCoins(price) {
      if (this.coins > 0) {
        this.coins -= price
        return true
      }
      console.warn('Not enough coins to decrement.')
      return false
    },
    decrementBits(price) {
      if (this.bits > 0) {
        this.bits -= parseInt(price)
        return true
      }
      console.warn('Not enough bits to decrement.')
      return false
    },
    getCoins() {
      return this.coins
    },
    getBits() {
      return this.bits
    },
    addCoins(amount) {
      this.coins += amount
    },
    addBits(amount) {
      this.bits += amount
    },
  },
})
