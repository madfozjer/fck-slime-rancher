import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    coins: 0,
    bits: 0,
  }),
  actions: {
    init() {
      if (localStorage.getItem('coins')) this.coins = parseInt(localStorage.getItem('coins'))
      if (localStorage.getItem('bits')) this.bits = parseInt(localStorage.getItem('bits'))
    },
    decrementCoins(price) {
      if (this.coins > 0) {
        this.coins -= price
        localStorage.setItem('coins', this.coins)
        return true
      }
      console.warn('Not enough coins to decrement.')
      return false
    },
    decrementBits(price) {
      if (this.bits > 0) {
        this.bits -= parseInt(price)
        localStorage.setItem('bits', this.bits)
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
      localStorage.setItem('coins', this.coins)
    },
    addBits(amount) {
      this.bits += amount
      localStorage.setItem('bits', this.bits)
    },
    setActiveHunters(array) {
      console.log(array)
      localStorage.setItem('activeHunters', JSON.stringify(array))
    },
    resetSave() {
      localStorage.setItem('coins', 0)
      localStorage.setItem('bits', 0)
      localStorage.setItem('hunters', JSON.stringify([]))
      localStorage.setItem('weapons', JSON.stringify([]))
      localStorage.setItem('currentHunterID', null)
      localStorage.setItem('currentWeaponID', null)
      localStorage.setItem('activeHunters', JSON.stringify([]))
      alert('Data was reset!')
    },
    downloandSave() {},
    uploadSave() {},
  },
})
