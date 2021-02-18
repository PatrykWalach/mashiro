import { FileModel } from './entities/File'
import Lowdb from 'lowdb'
import Memory from 'lowdb/adapters/Memory'
import { PubSub } from 'apollo-server-express'
import { PrismaClient, PromiseReturnType } from '@prisma/client'

export interface Session {
  files: FileModel[]
}

enum Events {
  ACTIVITY_UPDATED = 'ACTIVITY_UPDATED',
  ACTIVITY_ADDED = 'ACTIVITY_ADDED',
}

import { anitomyLoader, mediaIdLoader } from './loaders'

export const createContext = () => {
  //async
  return {
    events: Events,
    pubsub: new PubSub(),
    prisma: new PrismaClient(),
    anitomyLoader,
    mediaIdLoader,
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
  authorization: string
}
