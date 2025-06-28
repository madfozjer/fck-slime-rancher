import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMobsStore = defineStore('mobs', () => {
  // List of all mob templates
  const mobs = ref([
    {
      name: 'Green Slime',
      img: 'mobs/green-slime/green-slime.png',
      alt: 'Green Slime',
      hp: 20,
      maxHp: 20,
      price: 1,
      bits: 1,
      description: 'a weak, bouncy blob of goon. ',
      borderColor: '#22c55e', // lime-500
      damagedImg: 'mobs/green-slime/green-slime-damaged.png',
    },
    {
      name: 'Cutie Pie',
      img: `mobs/cutie-pie/cutie-pie.png`,
      alt: 'Cutie Pie',
      hp: 25,
      maxHp: 25,
      price: 0,
      bits: 0,
      description: 'hello :3 pwease dont hurtf me ',
      borderColor: '#c9f2fc ',
      damagedImg: `mobs/cutie-pie/cutie-pie-damaged.png`,
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

  function getMob(name) {
    // Find a mob by its name
    return mobs.value.find((mob) => mob.name === name)
  }

  return {
    mobs,
    generateMobQueue,
    getMob,
  }
})
