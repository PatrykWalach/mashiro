import db from './database'

export interface Context {
  db: typeof db
}
