import Account from './entities/Account'
import Anime from './entities/Anime'
import ListEntry from './entities/ListEntry'
import User from './entities/User'
import { nexusPrisma } from 'nexus-plugin-prisma'
import { makeSchema } from 'nexus'
import { join } from 'path'

export const schema = makeSchema({
  // shouldExitAfterGenerateArtifacts: process.argv.includes('--generate-schema'),
  types: [User, Account, Anime, ListEntry],
  plugins: [
    nexusPrisma({
      experimentalCRUD: true,
      computedInputs: {
        user: ({ ctx }) => ({
          connect: {
            id: ctx.userId,
          },
        }),
      },
    }),
  ],
  features: {
    abstractTypeStrategies: { __typename: true, resolveType: false },
  },
  contextType: {
    module: join(__dirname, '../background/context.ts'),
    export: 'Context',
  },
  outputs: {
    typegen: join(__dirname, '../node_modules/@types/nexus-typegen/index.d.ts'),
    schema: join(__dirname, '../schemas/nexus.graphql'),
  },
  sourceTypes: {
    modules: [
      {
        module: join(__dirname, '../node_modules/.prisma/client/index.d.ts'),
        alias: 'prisma',
      },
    ],
  },
})
