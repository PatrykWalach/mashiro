export default /* GraphQL */ `
  type Channel {
    items: [Item!]!
  }

  type Item {
    link: String!
    id: String!
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
    description: String

    "anime_title by [anitomy-js](https://github.com/skiptirengu/anitomy-js)"
    animeTitle: String
    
    "episode_number by [anitomy-js](https://github.com/skiptirengu/anitomy-js)"
    episodeNumber: String
    
    "release_group by [anitomy-js](https://github.com/skiptirengu/anitomy-js)"
    subgroup: String
    
    "video_resolution by [anitomy-js](https://github.com/skiptirengu/anitomy-js)"
    videoResolution: String
    
    "file_name by [anitomy-js](https://github.com/skiptirengu/anitomy-js)"
    fileName: String!

    "file_extension by [anitomy-js](https://github.com/skiptirengu/anitomy-js)"
    fileExtension: String

    #anime_season?: string
    #season_prefix?: string
    #anime_type?: string
    #anime_year?: string
    #audio_term?: string
    #device_compatibility?: string
    #episode_number_alt?: string
    #episode_prefix?: string
    #episode_title?: string
    #file_checksum?: string
    #language?: string
    #other?: string
    #release_group?: string
    #release_information?: string
    #release_version?: string
    #source?: string
    #subtitles?: string
    #video_resolution?: string
    #video_term?: string
    #volume_number?: string
    #volume_prefix?: string
    #unknown?: string
  }
`

export interface ItemModel {
  guid: string
  title: string
  link: string
  pubDate: string
  seeders?: number
  leechers?: number
  downloads?: number
  infoHash?: string
  categoryId?: string
  category?: string
  size?: string
  comments?: number
  trusted?: string
  remake?: string
  description?: string

  mediaId?: number
}

import { Resolvers } from './__generated__/Item'

export const ItemResolvers: Resolvers = {
  Item: {
    id: ({ guid }) => guid,
  },
}
