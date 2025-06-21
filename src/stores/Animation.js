import { defineStore } from 'pinia'

export const useAnimationStore = defineStore('animation', {
  state: () => ({
    hunterShakes: {}, // { [hunterId]: boolean }
    mobShake: false,
  }),
  actions: {
    triggerHunterShake(hunterId) {
      this.hunterShakes[hunterId] = false
      // Force reactivity by setting to false first
      setTimeout(() => {
        this.hunterShakes[hunterId] = true
        setTimeout(() => {
          this.hunterShakes[hunterId] = false
        }, 400)
      }, 10)
    },
    resetHunterShake(hunterId) {
      this.hunterShakes[hunterId] = false
    },
    triggerMobShake() {
      this.mobShake = false
      setTimeout(() => {
        this.mobShake = true
        setTimeout(() => {
          this.mobShake = false
        }, 400)
      }, 10)
    },
    resetMobShake() {
      this.mobShake = false
    },
  },
})
