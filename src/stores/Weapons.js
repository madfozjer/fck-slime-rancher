import { defineStore } from 'pinia'

export const useWeaponsStore = defineStore('weapons', {
  state: () => ({
    weapons: [
      {
        id: 1,
        name: 'Wooden Sword',
        physDamage: 1,
        psiDamage: 0,
        description: 'A simple wooden sword. Deals physical damage.',
      },
      {
        id: 2,
        name: 'Mind Wand',
        physDamage: 0,
        psiDamage: 1,
        description: 'A basic wand that channels psychic energy.',
      },
    ],
  }),
  actions: {
    getWeaponById(id) {
      return this.weapons.find((w) => w.id === id)
    },
    getWeaponByName(name) {
      return this.weapons.find((w) => w.name === name)
    },
  },
})
