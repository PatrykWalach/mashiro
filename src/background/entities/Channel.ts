import { Resolvers } from './__generated__/Channel'
import { ItemModel } from './Item'
import fetch from 'cross-fetch'
import { parse } from 'fast-xml-parser'
import {
  anitomyLoader,
} from '../util'

interface Item {
  guid: string
  title: string
  link: string
  pubDate: string
  [key: string]: string | undefined
}
interface Channel {
  title: string
  description: string
  link: string
  item: Item[] | Item
}

interface Rss {
  channel: Channel
}

interface Data {
  rss: Rss
}

const itemToItems = <T>(item: T | T[]): T[] =>
  Array.isArray(item) ? item : [item]

const normalizeItem = (item: Item) =>
  Object.fromEntries(
    Object.entries(item).map(([key, value]) => [
      key.replace(/[^]+:/, ''),
      value,
    ]),
  ) as Item

export const getRssChannel = async (uri: string) => {
  try {
    const response = await fetch(uri)
    const xml = await response.text()
    const json: Data = parse(xml)

    return {
      ...json.rss.channel,
      items: itemToItems(json.rss.channel.item).map(normalizeItem),
    }
  } catch (e) {
    throw e
  }
}

export default /* GraphQL */ `

  "RssChannel"
  type Channel {
    title: String!
    description: String!
    link: String!
  }

  type Query {
    Channel(

      "Rss channel url"
      uri: String!
    ): Channel
  }
`

export interface ChannelModel {
  title: string
  description: string
  link: string
  items: ItemModel[]
}

export const ChannelResolvers: Resolvers = {
  Query: {
    async Channel(_, { uri }) {
      const channel = await getRssChannel(uri)

      const anitomyResults = await anitomyLoader.loadMany(
        channel.items.map(({ title }) => title),
      )

      return {
        ...channel,
        items: channel.items.map((item, i) =>
          Object.assign({}, item, anitomyResults[i]),
        ),
      }
    },
  },
}
