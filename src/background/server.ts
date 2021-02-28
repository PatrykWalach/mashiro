import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { createReadStream, promises } from 'fs'
import { createServer } from 'http'
import { join } from 'path'
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

  app.get<Record<'search', string>>('/stream/s/:search', async (req, res) => {
    res.redirect(`/stream/next/s/${req.params.search}`)
  })

  app.get<Record<'search', string>>(
    '/stream/next/s/:search',
    async (req, res) => {
      const user = await prisma.user.findFirst({
        orderBy: {
          lastLoggedInAt: 'desc',
        },
        rejectOnNotFound: true,
      })

      console.log('user', user)

      const listEntry = await prisma.listEntry.findFirst({
        where: {
          userId: {
            equals: user.id,
          },
          anime: {
            title: {
              contains: req.params.search,
            },
          },
        },
        rejectOnNotFound: true,
        include: {
          anime: true,
        },
      })

      console.log('listEntry', listEntry)

      res.redirect(
        `/${user.name}/stream/${listEntry.progress + 1}/${
          listEntry.anime.title
        }`,
      )
    },
  )

  async function findPathToFile(
    options: Record<'animeEpisode' | 'animeTitle', string>,
    dirPath: string,
  ): Promise<string> {
    const fileOrDirNames = await promises.readdir(dirPath)

    return Promise.any<string>(
      fileOrDirNames.map(async (fileOrDirName) => {
        const fileOrDirPath = join(dirPath, fileOrDirName)
        const stats = await promises.lstat(fileOrDirPath)

        if (stats.isDirectory()) {
          return findPathToFile(options, fileOrDirPath)
        }

        if (!stats.isFile()) {
          throw new Error()
        }
        const fileName = fileOrDirName
        const result = await anitomy.getResult(fileName)

        if (
          !(
            result.episodeNumber &&
            result.episodeNumber.includes(options.animeEpisode)
          ) ||
          result.animeTitle !== options.animeTitle
        ) {
          throw new Error()
        }

        return fileOrDirPath
      }),
    )
  }

  const FILES_DIR = 'D:\\Pobrane'

  app.get<Record<'animeEpisode' | 'animeTitle' | 'userName', string>>(
    '/:userName/stream/:animeEpisode/:animeTitle',
    async (req, res) => {
      const path = await findPathToFile(req.params, FILES_DIR)

      console.log('path', path)

      // Ensure there is a range given for the video
      const stat = await promises.stat(path)
      const fileSize = stat.size
      const range = req.headers.range
      if (range) {
        console.log('play range')
        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
        const chunksize = end - start + 1
        const file = createReadStream(path, { start, end })
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        }
        // console.log(head)
        res.writeHead(206, head)

        file.pipe(res).on('finish', () => {
          console.log('finish pipe')
        })
      } else {
        console.log('play no range')
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        createReadStream(path).pipe(res)
      }
    },
  )

  return server
}
