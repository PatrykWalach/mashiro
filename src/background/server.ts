import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import fs from 'fs'
import { createServer } from 'http'
import { createContext, prisma } from './context'
import { AnilistAPI } from './dataSources/anilistAPI'
import { Anitomy } from './dataSources/anitomy'
import { schema } from './schema'

function parseUserId(id: string | undefined) {
  if (typeof id !== 'string') {
    return null
  }

  const parsed = parseInt(id)

  if (isNaN(parsed)) {
    return null
  }

  return parsed
}

export const createApolloServer = async (port: number) => {
  const context = createContext()

  // const anilistSubschema = await createAnilistSubschema()

  // const schema = stitchSchemas({
  //   subschemas: [
  //     electronSubschema, //anilistSubschema
  //   ],
  // })

  const anilistAPI = new AnilistAPI()
  const anitomy = new Anitomy()

  const server = new ApolloServer({
    schema,
    tracing: true,
    dataSources: () => ({
      anilistAPI,
      anitomy,
    }),
    context: ({ req, connection }) => {
      if (connection) {
        return context
      }

      return {
        userId: parseUserId(req.headers.authorization),
        ...context,
      }
    },
  })

  // if (process.env.NODE_ENV !== 'production') {
  //   promises.writeFile(
  //     join(__dirname, '../schema.graphql'),
  //     printSchema(schema),
  //     {
  //       encoding: 'utf8',
  //     },
  //   )
  // }

  const app = express()
  server.applyMiddleware({ app })

  const httpServer = createServer(app)
  server.installSubscriptionHandlers(httpServer)

  httpServer.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
    console.log(
      `Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`,
    )
  })

  return server
}
