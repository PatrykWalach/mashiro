/* eslint-disable @typescript-eslint/no-var-requires*/
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// A `main` function so that we can use async/await
async function main() {
  for (const service of ['ANILIST']) {
    try {
      const newStatus = await prisma.serviceEnum.create({
        data: {
          value: service,
        },
      })

      console.log(`new service created`, newStatus)
    } catch {
      console.log(`${service} exists`)
    }
  }
  for (const user of [
    {
      name: 'Hoodboi',
      services: {
        create: {
          service: 'ANILIST',
          token: process.env.VUE_APP_BEARER_TOKEN,
          accountUserId: process.env.VUE_APP_ANILIST_USER_ID,
        },
      },
    },
  ]) {
    try {
      const newUser = await prisma.user.create({
        data: user,
      })

      console.log(`new user created`, newUser)
    } catch {
      console.log(`${user} exists`)
    }
  }

  for (const status of [
    'CURRENT',
    'PLANNING',
    'COMPLETED',
    'DROPPED',
    'PAUSED',
    'REPEATING',
  ]) {
    try {
      const newStatus = await prisma.statusEnum.create({
        data: {
          value: status,
        },
      })

      console.log(`new status created`, newStatus)
    } catch {
      console.log(`${status} exists`)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    // process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
