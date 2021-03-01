import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { createServer } from 'http'
import { anitomy, createContext } from './context'
import { AnilistAPI } from './dataSources/anilistAPI'
import router from './paths'
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

  const anilistAPI = new AnilistAPI()

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

  const app = express()
  server.applyMiddleware({ app })

  app.use('/', router)

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
