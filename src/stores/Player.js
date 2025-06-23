import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    coins: 0,
    bits: 0,
  }),
  actions: {},
})
