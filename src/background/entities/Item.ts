export default /* GraphQL */ `
  type Match {
    id: ID!
  }
  type Item {
    title: String!
    link: String!
    id: ID!
    pubDate: String!
    seeders: Int
    leechers: Int
    downloads: Int
    infoHash: String
    categoryId: String
    category: String
    size: String
    comments: Int
    trusted: Boolean
    remake: Boolean
    description: String!
    match: Match
  }
`

export interface ItemModel {
  guid: string
  title: string
  link: string
  pubDate: string
  'nyaa:seeders'?: number
  'nyaa:leechers'?: number
  'nyaa:downloads'?: number
  'nyaa:infoHash'?: string
  'nyaa:categoryId'?: string
  'nyaa:category'?: string
  category?: string
  'nyaa:size'?: string
  'nyaa:comments'?: number
  'nyaa:trusted'?: string
  'nyaa:remake'?: string
  description: string
}

import { checkUndefined, keyToBoolean } from '../util'
import { Resolvers } from './__generated__/Item'

export const ItemResolvers: Resolvers = {
  Item: {
    id: ({ guid }) => guid,
    trusted: itemModel => keyToBoolean(itemModel, 'nyaa:trusted'),
    remake: itemModel => keyToBoolean(itemModel, 'nyaa:remake'),
    seeders: itemModel => checkUndefined(itemModel['nyaa:seeders']),
    leechers: itemModel => checkUndefined(itemModel['nyaa:leechers']),
    downloads: itemModel => checkUndefined(itemModel['nyaa:downloads']),
    infoHash: itemModel => checkUndefined(itemModel['nyaa:infoHash']),
    categoryId: itemModel => checkUndefined(itemModel['nyaa:categoryId']),
    category: itemModel => checkUndefined(itemModel['nyaa:category']),
    size: itemModel => checkUndefined(itemModel['nyaa:size']),
    comments: itemModel => checkUndefined(itemModel['nyaa:comments']),
  },
}
