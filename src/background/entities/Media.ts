import { Resolvers } from './__generated__/Media'
import { valuesFromResults } from '../util'

export const MediaResolvers: Resolvers = {
  Media: {
    async alternativeTitles({ id }, _, { data }) {
      const matches = await data
        .get('matches')
        .filter({ mediaId: id })
        .value()

      return matches.map(({ title }) => title)
    },
  },
  Query: {
    async _media(_, { id_in = [] }, { data }) {
      const found = await data
        .get('media')
        .filter(({ id }) => id_in.includes(id))
        .value()

      return valuesFromResults('id')(found, id_in)
    },
  },
}

export default /* GraphQL */ `
  type File {
    id: ID!
  }

  type Media {
    id: Int
    #  files: [File]
    episodeOffset: Int!
    alternativeTitles: [String]
  }

  type Query {
    _media(id_in: [Int!]!): [Media]
  }
`

export interface MediaModel {
  id: number
  episodeOffset: number
}
