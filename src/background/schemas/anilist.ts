import {
  AsyncExecutor,
  ExecutionParams,
  Executor,
  introspectSchema,
  MergedTypeConfig,
  RenameRootFields,
  SubschemaConfig,
} from 'graphql-tools'
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
import { Context } from '../context'
import { print } from 'graphql'
import { fetch } from 'cross-fetch'

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

const executor: AsyncExecutor = async ({ document, variables, context }) =>
  // : ExecutionParams<any, Context>
  {
    const query = print(document)
    const fetchResult = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization:
          (((context as unknown) as Context) &&
            ((context as unknown) as Context).authorization) ||
          '',
      },
      body: JSON.stringify({ query, variables }),
    })
    return fetchResult.json()
  }

export const anilistSubschema = async () =>
  // : Promise<
  //   SubschemaConfig<unknown, unknown, Context>
  // >
  ({
    executor,
    schema: await introspectSchema(executor),
    batch: true,
    batchingOptions: {
      dataLoaderOptions: { maxBatchSize: 50 },
    },
    merge,
    transforms: [new RenameRootFields((operation, name) => `anilist${name}`)],
  })
// createRemoteSchema({
//   uri: 'https://graphql.anilist.co',
//   batch: true,
//   batchingOptions: {
//     dataLoaderOptions: { maxBatchSize: 50 },
//   },
//   merge,
//   transforms: [new RenameRootFields((operation, name) => `anilist${name}`)],
// })
