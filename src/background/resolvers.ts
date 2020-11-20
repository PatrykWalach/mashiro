import { ChannelResolvers } from './entities/Channel'
import { FileResolvers } from './entities/File'
import { ItemResolvers } from './entities/Item'
import { MashiroActivityResolvers } from './entities/MashiroActivity'
import { MatchResolvers } from './entities/Match'
import { MediaResolvers } from './entities/Media'
import { mergeResolvers } from 'graphql-tools'
import { Context } from './context'

export default mergeResolvers<Context, any>([
  ChannelResolvers,
  FileResolvers,
  ItemResolvers,
  MashiroActivityResolvers,
  MatchResolvers,
  MediaResolvers,
])
