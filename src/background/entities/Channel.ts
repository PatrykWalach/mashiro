import { Resolvers } from './__generated__/Channel'
import { ItemModel } from './Item'
import fetch from 'cross-fetch'
import { parse } from 'fast-xml-parser'

interface RssModel {
  channel: ChannelModel
}

interface DataModel {
  rss: RssModel
}

export const getRssChannel = async (uri: string): Promise<ChannelModel> => {
  const response = await fetch(uri)
  const xml = await response.text()
  const json: DataModel = parse(xml)
  return json && json.rss && json.rss.channel
}

export const ChannelResolvers: Resolvers = {
  Channel: { items: ({ item }) => (Array.isArray(item) ? item : [item]) },
  Query: {
    Channel: (_, { uri }) => getRssChannel(uri),
  },
}

export default /* GraphQL */ `
  type Item {
    id: ID
  }

  """
  RssChannel
  """
  type Channel {
    title: String!
    description: String!
    link: String!
    items: [Item!]!
  }

  type Query {
    Channel(
      """
      Rss channel url
      """
      uri: String!
    ): Channel
  }
`

export interface ChannelModel {
  title: string
  description: string
  link: string
  item: ItemModel[] | ItemModel
}
