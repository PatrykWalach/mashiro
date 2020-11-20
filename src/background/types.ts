import { default as Channel } from './entities/Channel'
import { default as File } from './entities/File'
import { default as Item } from './entities/Item'
import { default as MashiroActivity } from './entities/MashiroActivity'
import { default as Media } from './entities/Media'
import { default as Match } from './entities/Match'
import { mergeTypeDefs } from 'graphql-tools'

export default mergeTypeDefs([
  Channel,
  File,
  Item,
  MashiroActivity,
  Match,
  Media,
])
