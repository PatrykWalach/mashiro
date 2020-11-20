import { files } from './entities/File'
import { activities } from './entities/MashiroActivity'
import { media } from './entities/Media'
import { matches } from './entities/Match'
import { promise } from './util'

const db = {
  promise,
  activities,
  media,
  files,
  matches,
}

export default db
