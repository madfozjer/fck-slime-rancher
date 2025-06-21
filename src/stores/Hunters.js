import { defineStore } from 'pinia'

export const useHuntersStore = defineStore('hunters', {
  state: () => ({
    hunters: [
      {
        id: 1,
        name: 'Jacob',
        emoji: '🐱🤓',
        color: 'orange',
        speed: 0.33,
        img: '/hunters/Jacob/Jacob.png',
        weapon: null,
        rarity: 'Normal',
        modifier: {
          phys: 1.5, // x1.5 physical damage
          psi: 1, // x1 psychic damage (no change)
        },
      },
      {
        id: 2,
        name: 'Dandy',
        emoji: '🐱🦇',
        color: 'gray',
        speed: 0.2,
        img: '/hunters/Dandy/Dandy.png',
        weapon: null,
        rarity: 'Normal',
        modifier: {
          phys: 0.5, // x0.5 physical damage
          psi: 3, // x3 psychic damage
        },
      },

      // Add more hunters here as needed, following the same structure
    ],
  }),
  actions: {
    getHunterByName(name) {
      return this.hunters.find((hunter) => hunter.name === name)
    },
  },
})
