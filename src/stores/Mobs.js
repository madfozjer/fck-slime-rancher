import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMobsStore = defineStore('mobs', () => {
  const mobs = ref([
    {
      name: 'Green Slime',
      img: './mobs/green-slime/green-slime.png',
      alt: 'Green Slime',
      hp: 23,
      maxHp: 23,
      price: 1,
      bits: 1,
      description: 'a weak, bouncy blob of goon. ',
      borderColor: '#22c55e',
      damagedImg: 'mobs/green-slime/green-slime-damaged.png',
      boss: false,
    },
    {
      name: 'Cutie Pie',
      img: `./mobs/cutie-pie/cutie-pie.png`,
      alt: 'Cutie Pie',
      hp: 30,
      maxHp: 30,
      price: 0,
      bits: 1,
      description: 'hello :3 pwease dont hurtf me ',
      borderColor: '#c9f2fc ',
      damagedImg: `mobs/cutie-pie/cutie-pie-damaged.png`,
      boss: false,
    },
  ])

  const bosses = ref([
    {
      name: 'Cutie Pie Boss',
      img: `./mobs/cutie-pie/cutie-pie.png`,
      alt: 'Cutie Pie',
      hp: 175,
      maxHp: 175,
      price: 3,
      bits: 0,
      description: 'ima big boy now',
      borderColor: '#c9f2fc ',
      damagedImg: `mobs/cutie-pie/cutie-pie-damaged.png`,
      boss: true,
      bossTime: 10,
    },
  ])

  // Generate a mob queue (array of mob objects, shallow copies)
  function generateMobQueue(count = 12) {
    const mobQueue = Array.from({ length: count }, () => {
      // Pick a random mob template from the list
      const mobTemplate = mobs.value[Math.floor(Math.random() * mobs.value.length)]
      return { ...mobTemplate }
    })
    mobQueue.push(bosses.value[Math.floor(Math.random() * bosses.value.length)])
    return mobQueue
  }

  function getMob(name) {
    return mobs.value.find((mob) => mob.name === name)
  }

  return {
    mobs,
    generateMobQueue,
    getMob,
  }
})
