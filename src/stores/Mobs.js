import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMobsStore = defineStore('mobs', () => {
  // List of all mob templates
  const mobs = ref([
    {
      name: 'Green Slime',
      img: '/green-slime/green-slime.png',
      alt: 'Green Slime',
      hp: 10,
      maxHp: 10,
      price: 1,
      bits: 1,
      description: 'a weak, bouncy blob of goon. ',
      borderColor: '#22c55e', // lime-500
      damagedImg: '/green-slime/green-slime-damaged.png',
    },
    // Add more mobs here in the future
  ])

  // Generate a mob queue (array of mob objects, shallow copies)
  function generateMobQueue(count = 12) {
    // For now, only Green Slime
    return Array.from({ length: count }, () => {
      // Pick a random mob template from the list
      const mobTemplate = mobs.value[Math.floor(Math.random() * mobs.value.length)]
      return { ...mobTemplate }
    })
  }

  return {
    mobs,
    generateMobQueue,
  }
})
