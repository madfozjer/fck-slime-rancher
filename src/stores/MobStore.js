import { defineStore } from 'pinia'

export const useMobStore = defineStore('mob', {
  state: () => ({
    mobs: [], // Array of mob objects: { id, name, hp, maxHp, img, damagedImg, ... }
  }),
  actions: {
    setMobs(mobs) {
      this.mobs = mobs
    },
    damageMob(id, amount) {
      const mob = this.mobs.find((m) => m.id === id)
      if (mob) {
        mob.hp = Math.max(0, mob.hp - amount)
      }
    },
    healMob(id, amount) {
      const mob = this.mobs.find((m) => m.id === id)
      if (mob) {
        mob.hp = Math.min(mob.maxHp, mob.hp + amount)
      }
    },
    resetMobHp(id) {
      const mob = this.mobs.find((m) => m.id === id)
      if (mob) {
        mob.hp = mob.maxHp
      }
    },
  },
})
