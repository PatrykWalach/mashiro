import { stitchSchemas } from 'graphql-tools'

import { ApolloServer } from 'apollo-server'
import { electronSubschema } from './schemas/electron'
import { anilistSubschema as createAnilistSubschema } from './schemas/anilist'
import { createContext } from './context'
import { promises } from 'fs'
import { printSchema } from 'graphql'
import { join } from 'path'

export const createServer = async (port: number) => {
  const [anilistSubchema, context] = await Promise.all([
    createAnilistSubschema(),
    createContext(),
  ])

  const schema = stitchSchemas({
    subschemas: [electronSubschema, anilistSubchema],
  })

  const server = new ApolloServer({
    schema,
    context,
  })

  promises.writeFile(
    join(__dirname, '../schema.graphql'),
    printSchema(schema),
    {
      encoding: 'utf8',
    },
  )

  await server.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
    console.log(
      `Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`,
    )
  })

  return server
}
