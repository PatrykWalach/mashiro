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
