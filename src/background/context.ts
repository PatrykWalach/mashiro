import { FileModel } from './entities/File'
import {
  CurrentActivityModel,
  PendingActivityModel,
  PastActivityModel,
} from './entities/MashiroActivity'
import { MediaModel } from './entities/Media'
// import { MatchModel } from './entities/Match'
import Lowdb, { LowdbAsync, LowdbSync } from 'lowdb'
import FileAsync from 'lowdb/adapters/FileAsync'
import Memory from 'lowdb/adapters/Memory'
import { join } from 'path'
import { app } from 'electron'

type Entries<T> = {
  [key: string]: T //| undefined
}

export interface Data {
  media: Entries<MediaModel>
  activities: Entries<
    CurrentActivityModel | PendingActivityModel | PastActivityModel
  >
  // matches: Entries<number>
}

export interface Session {
  files: Entries<FileModel>
}
export interface Context {
  data: LowdbAsync<Data>
  session: LowdbSync<Session>
}

export const createContext = async (): Promise<Context> => ({
  data: await Lowdb(
    new FileAsync<Data>(join(app.getPath('appData'), 'mashiro', 'data.db'), {
      defaultValue: {
        media: {},
        activities: {},
        // matches: {},
      },
    }),
  ),
  session: await Lowdb(
    new Memory<Session>('', {
      defaultValue: {
        files: {},
      },
    }),
  ),
})
