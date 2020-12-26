const itemToItems = <T>(item: T | undefined | T[]): T[] =>
  item === undefined ? [] : Array.isArray(item) ? item : [item]

const normalizeItem = <T>(item: T) =>
  Object.fromEntries(
    Object.entries(item).map(([key, value]) => [
      key.replace(/[^]+:/, ''),
      value,
    ]),
  ) as T

export type ItemModel = ItemWithTitle & AnitomyResultModel

import { objectType, stringArg, nonNull, queryField, list } from 'nexus'
import { join } from 'path'
import { fetchRssFeed, ItemWithTitle } from '../fetchRssFeed'
import { AnitomyResultModel } from '../loaders'

const FeedItem = objectType({
  name: 'FeedItem',
  sourceType: {
    module: join(__dirname, '../src/background/entities/Feed.ts'),
    export: 'ItemModel',
  },
  definition(t) {
    t.string('link')
    t.string('id', {
      resolve: ({ guid = null }) => guid,
    })
    t.string('pubDate')
    t.int('seeders')
    t.int('leechers')
    t.int('downloads')
    t.string('infoHash')
    t.string('categoryId')
    t.string('category')
    t.string('size')
    t.int('comments')
    t.boolean('trusted')
    t.boolean('remake')
    t.string('description')
    t.implements('AnitomyResult')
  },
})

const FeedQuery = queryField('feed', {
  description: 'Rss feed',
  args: {
    uri: nonNull(stringArg({ description: 'Rss feed url' })),
  },
  type: list(nonNull('FeedItem')),
  async resolve(_, { uri }, { anitomyLoader }) {
    const rss = await fetchRssFeed(uri)

    const items = itemToItems(rss.channel.item)
      .filter((item): item is ItemWithTitle => 'title' in item)
      .map(normalizeItem)

    return Promise.all(
      items.map(
        async (item): Promise<ItemModel> => {
          const anitomyResult = await anitomyLoader.load(item.title)
          return {
            ...item,
            ...anitomyResult,
          }
        },
      ),
    )
  },
})

export const Feed = {
  FeedQuery,
  FeedItem,
}
