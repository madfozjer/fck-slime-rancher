import { defineStore } from 'pinia'

export const useHuntersStore = defineStore('hunters', {
  state: () => ({
    hunters: [
      {
        name: 'Jacob',
        color: 'orange',
        attack: 1,
        speed: 0.33, // attacks per second
        img: '/hunters/Jacob/Jacob.png',
      },
    ],
  }),
  actions: {
    getHunterByName(name) {
      return this.hunters.find((hunter) => hunter.name === name)
    },
  },
})
