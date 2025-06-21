import { defineStore } from 'pinia'

export const useHuntersStore = defineStore('hunters', {
  state: () => ({
    hunters: [
      {
        id: 1,
        name: 'Jacob',
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
      // Add more hunters here as needed, following the same structure
    ],
  }),
  actions: {
    getHunterByName(name) {
      return this.hunters.find((hunter) => hunter.name === name)
    },
  },
})
