import { SubschemaConfig } from 'graphql-tools'
import { Feed } from '../entities/Feed'
import { File } from '../entities/File'
// import { Item } from '../entities/Item'
import { Activity } from '../entities/Activity'
import { Media } from '../entities/Media'
import { AnitomyResult } from '../entities/AnitomyResult'
import { User } from '../entities/User'

import { nexusPrisma } from 'nexus-plugin-prisma'
import { makeSchema } from 'nexus'
import { join } from 'path'
import { valuesFromResults } from '../util'

const schema = makeSchema({
  shouldExitAfterGenerateArtifacts: process.argv.includes('--nexus-exit'),
  types: [Feed, Media, File, Activity, AnitomyResult, User],
  plugins: [
    nexusPrisma({
      experimentalCRUD: true,
    }),
  ],
  features: {
    abstractTypeStrategies: { __typename: true, resolveType: false },
  },
  // outputs: {
  //   schema: join(__dirname, '..', 'schema.graphql'),
  //   typegen: join(__dirname, '..', '__generated__', 'nexus.ts'),
  // },
  contextType: {
    module: join(__dirname, '../src/background/context.ts'),
    export: 'Context',
  },
  outputs: {
    typegen: join(__dirname, '../node_modules/@types/nexus-typegen/index.d.ts'),
    schema: join(__dirname, '../schema.graphql'),
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

export const electronSubschema: SubschemaConfig = {
  schema,
  batch: true,
  merge: {
    Media: {
      selectionSet: '{ id }',
      fieldName: 'media',
      key: ({ id }) => id,
      argsFromKeys: ids => ({ where: { id: { in: ids } } }),
      valuesFromResults: valuesFromResults('id'),
    },
    User: {
      selectionSet: '{ id }',
      fieldName: 'users',
      key: ({ id }) => id,
      argsFromKeys: ids => ({ where: { id: { in: ids } } }),
      valuesFromResults: valuesFromResults('id'),
    },
  },
}
