import express from 'express'
import { GraphQLSchema } from 'graphql'
import { makeExecutableSchema, stitchSchemas } from 'graphql-tools'
import typeDefs from './types'
import resolvers from './resolvers'
// const { merge } = require('./entities/anilist')
import { Media } from './entities/anilist'
import { graphqlHTTP } from 'express-graphql'
import cors from 'cors'
import { createRemoteSchema } from './util'
import { Context } from '@apollo/client'

export const createSchema = async () => {
  const electronSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  })

  const anilistSubschema = await createRemoteSchema({
    uri: 'https://graphql.anilist.co',
    batch: true,
    batchingOptions: {
      dataLoaderOptions: { maxBatchSize: 50 },
    },
    merge: { Media },
  })

  const schema = stitchSchemas({
    subschemas: [
      {
        schema: electronSchema,
        merge: {
          Media: {
            selectionSet: '{ id }',
            computedFields: {
              alternativeTitles: { selectionSet: '{ id }' },
              episodeOffset: { selectionSet: '{ id }' },
              files: { selectionSet: '{ id }' },
            },
            fieldName: '_media',
            key: ({ id }) => ({ id }),
            argsFromKeys: id_in => ({ id_in }),
          },
        },
      },
      anilistSubschema,
    ],
  })

  return schema
}

export const createServer = async (
  schema: GraphQLSchema,
  port: number,
  context: Context,
) => {
  const app = express()

  app.use(
    '/graphql',
    cors(),
    graphqlHTTP({
      schema,
      graphiql: true,
      context,
    }),
  )

  app.listen(port, () =>
    console.info(
      `Running a GraphQL API server at http://localhost:${port}/graphql`,
    ),
  )

  // graphql(schema, query)

  return app
}
