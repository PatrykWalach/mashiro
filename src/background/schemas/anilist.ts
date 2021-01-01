import { MergedTypeConfig, RenameRootFields } from 'graphql-tools'
import {
  valuesFromResults,
  createMergeResolverWithTransform,
  createRemoteSchema,
} from '../util'

import {
  AddFields,
  AddQueryVariables,
  Int,
  List,
  WrapQueryWithField,
} from '../transforms'
import { Media, User } from '@prisma/client'

interface Merge {
  Media: MergedTypeConfig<number, Media>
  User: MergedTypeConfig<number, User>
  [key: string]: MergedTypeConfig
}

const merge: Merge = {
  User: {
    selectionSet: '{ id }',
    fieldName: 'anilistUser',
    args: ({ id }) => ({ id }),
  },
  Media: {
    selectionSet: '{ id }',
    key: ({ id }) => id,
    resolve: createMergeResolverWithTransform({
      argsFromKeys: (id_in) => ({ id_in }),
      valuesFromResults: valuesFromResults('id'),
      fieldName: 'anilistPage',
      transforms: [
        new WrapQueryWithField({
          path: ['anilistPage'],
          fieldName: 'media',
          arguments: {
            id_in: 'id_in_variable',
          },
        }),
        new AddFields(['anilistPage'], 'id'),
        new AddQueryVariables({
          id_in_variable: {
            from: 'id_in',
            type: List(Int),
          },
        }),
      ],
    }),
  },
}

export const anilistSubschema = () =>
  createRemoteSchema({
    uri: 'https://graphql.anilist.co',
    batch: true,
    batchingOptions: {
      dataLoaderOptions: { maxBatchSize: 50 },
    },
    merge,
    transforms: [new RenameRootFields((operation, name) => `anilist${name}`)],
    // transforms: [new RenameTypes(name => `Anilist_${name}`)],
  })
