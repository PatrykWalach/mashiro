import {
  Executor,
  loadSchema,
  MergedTypeConfig,
  RenameRootFields,
  SubschemaConfig,
  UrlLoader,
} from 'graphql-tools'
import { valuesFromResults, createMergeResolverWithTransform } from '../util'

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
    canonical: true,
  },
  Media: {
    canonical: true,
    selectionSet: '{ id }',
    key: ({ id }) => id,
    resolve: createMergeResolverWithTransform({
      argsFromKeys: id_in => ({ id_in }),
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

// const executor: AsyncExecutor = async ({ document, variables, context }) =>
//   // : ExecutionParams<any, Context>
//   {
//     const query = print(document)
//     const fetchResult = await fetch('https://graphql.anilist.co', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         authorization:
//           (context && ((context as unknown) as Context).authorization) || '',
//       },
//       body: JSON.stringify({ query, variables }),
//     })
//     return fetchResult.json()
//   }

// const executorFromLink = linkToExecutor(
//   new HttpLink({ uri: 'https://graphql.anilist.co', fetch }),
// )

const isContext = (c: unknown): c is Context =>
  c instanceof Object &&
  'authorization' in c &&
  typeof c['authorization'] === 'string'

// const anilistLink = new HttpLink({
//   uri: process.env.VUE_APP_ANILIST_API_URL,
//   fetch,
// })

// const executor: Executor = ctx => {
//   const authLink = setContext((_, { headers }) => {
//     const context = ctx.context

//     if (!isContext(context)) {
//       return {
//         headers,
//       }
//     }

//     return {
//       headers: {
//         ...headers,
//         authorization: context.authorization,
//       },
//     }
//   })

//   return linkToExecutor(authLink.concat(anilistLink))(ctx)
// }

export const anilistExecutor: Executor = async ({
  document,
  variables,
  context,
}) => {
  const query = print(document)
  const fetchResult = await fetch(
    process.env.VUE_APP_ANILIST_API_URL || 'https://graphql.anilist.co',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: isContext(context)
          ? `Bearer ${context.authorization}`
          : ``,
      },
      body: JSON.stringify({ query, variables }),
    },
  )
  return fetchResult.json()
}

export const anilistSubschema = async (): Promise<SubschemaConfig<
  unknown,
  unknown,
  Context
>> => ({
  executor: anilistExecutor,
  schema: await loadSchema(process.env.VUE_APP_ANILIST_API_URL || '', {
    loaders: [new UrlLoader()],
    fetch,
  }),
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
