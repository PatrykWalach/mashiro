import { stitchSchemas, SubschemaConfig } from 'graphql-tools'

import { ApolloServer } from 'apollo-server-express'
import { electronSubschema } from './schemas/electron'
import { anilistSubschema as createAnilistSubschema } from './schemas/anilist'
import { createContext } from './context'
import { promises } from 'fs'
import { printSchema } from 'graphql'
import { join } from 'path'

import express from 'express'
import { createServer } from 'http'

export const createApolloServer = async (port: number) => {
  const context = createContext()

  const anilistSubschema = await createAnilistSubschema().catch(() => null)

  const schema = stitchSchemas({
    subschemas: [
      electronSubschema,
      anilistSubschema,
    ].filter((value): value is SubschemaConfig => Boolean(value)),
  })

  const server = new ApolloServer({
    schema,
    context: ({ req, connection }) => {
      if (connection) {
        return context
      }
      return {
        authorization: req.headers.authorization || null,
        ...context,
      }
    },
  })

  promises.writeFile(
    join(__dirname, '../schema.graphql'),
    printSchema(schema),
    {
      encoding: 'utf8',
    },
  )

  const app = express()
  server.applyMiddleware({ app })

  const httpServer = createServer(app)
  server.installSubscriptionHandlers(httpServer)

  httpServer.listen(port, () => {
    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`,
    )
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`,
    )
  })

  return server
}
