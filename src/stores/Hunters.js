// stores/hunters.js (or wherever your store is located)

import { defineStore } from 'pinia'

export const useHuntersStore = defineStore('hunters', {
  state: () => ({
    hunters: [
      {
        id: 1,
        name: 'Jacob',
        emoji: '🐱🤓',
        color: 'orange',
        speed: 3,
        // Corrected path: starts with the base URL and then the path relative to 'public'
        img: '/fck-slime-rancher/hunters/Jacob/Jacob.png',
        weapon: null,
        rarity: 'Normal',
        modifier: {
          phys: 1.5,
          psi: 1,
        },
      },
      {
        id: 2,
        name: 'Dandy',
        emoji: '🐱🦇',
        color: 'gray',
        speed: 2,
        // Corrected path
        img: '/fck-slime-rancher/hunters/Dandy/Dandy.png',
        weapon: null,
        rarity: 'Normal',
        modifier: {
          phys: 0.5,
          psi: 2,
        },
      },
      {
        id: 3,
        name: 'Cheese',
        emoji: '🖤🌙',
        color: 'black',
        speed: 1,
        // Corrected path
        img: '/fck-slime-rancher/hunters/Cheese/Cheese.png',
        weapon: null,
        rarity: 'Extra',
        modifier: {
          phys: 0,
          psi: 3,
        },
      },
      {
        id: 4,
        name: 'Swidlerton',
        emoji: '👑🦇💨',
        color: 'darkmagenta',
        speed: 100,
        // Corrected path
        img: '/fck-slime-rancher/hunters/Swidlerton/Swidlerton.png',
        weapon: null,
        rarity: 'Extraordinary',
        modifier: {
          phys: 1,
          psi: 1,
        },
      },
      // Add more hunters here as needed, following the same structure
    ],
  }),
  actions: {
    getHunterByName(name) {
      return this.hunters.find((hunter) => hunter.name === name)
    },
    getHunterById(id) {
      return this.hunters.find((hunter) => hunter.id === id)
    },
  },
})
