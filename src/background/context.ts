import { PrismaClient } from '@prisma/client'
import { PubSub } from 'apollo-server-express'
// import { anitomyLoader, mediaIdLoader } from './loaders'
import type { AnilistAPI } from './dataSources/anilistAPI'
import { Anitomy } from './dataSources/anitomy'
import { FileModel } from './entities/File'

export interface Session {
  files: FileModel[]
}

enum Events {
  ACTIVITY_UPDATED = 'ACTIVITY_UPDATED',
  ACTIVITY_ADDED = 'ACTIVITY_ADDED',
}

export const prisma = new PrismaClient()

export const createContext = () => {
  //async
  return {
    events: Events,
    pubsub: new PubSub(),
    prisma,
    // anitomyLoader,
    // mediaIdLoader,
    // session: await Lowdb(
    //   new Memory<Session>('', {
    //     defaultValue: {
    //       files: [],
    //     },
    //   }),
    // ),
  }
}
// export interface Context {
//   prisma: PrismaClient
// }
export type Context = ReturnType<typeof createContext> & {
  // authorization: string
  userId: number | null
  dataSources: { anilistAPI: AnilistAPI; anitomy: Anitomy }
}
