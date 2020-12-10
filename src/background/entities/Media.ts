import { Resolvers } from './__generated__/Media'

export default /* GraphQL */ `
  directive @computed(selectionSet: String!) on FIELD_DEFINITION

  type Media {
    id: Int
    episodeOffset: Int! @computed(selectionSet: "{ id }")
    alternativeTitles: [String] @computed(selectionSet: "{ id }")
  }

  type Query {
    _media(id_in: [Int!]!): [Media]
  }

  type Item {
    media: Media
  }

  type File {
    media: Media
  }

  type PastActivity {
    media: Media!
  }

  type PendingActivity {
    media: Media
  }

  type CurrentActivity {
    media: Media
  }
`

export const MediaResolvers: Resolvers = {
  Item: {
    async media({ mediaId = null, title }, _, context, info) {
      // console.log(title)
      // return delegateToSchema({
      //   context,
      //   info,
      //   schema: info.schema,
      //   operation: 'query',
      //   fieldName: 'Media',
      //   args: {
      //     search: title,
      //   },
      // })
      if (mediaId === null) {
        return null
      }

      return context.data
        .get(['media', mediaId], {
          id: mediaId,
          episodeOffset: 0,
        })
        .value()
    },
    // async media({ mediaId = null }, _, { data }) {
    //   if (mediaId === null) {
    //     return null
    //   }

    //   return data
    //     .get(['media', mediaId], {
    //       id: mediaId,
    //       episodeOffset: 0,
    //     })
    //     .value()
    // },
  },
  File: {
    async media({ mediaId = null }, _, { data }) {
      if (mediaId === null) {
        return null
      }

      return data
        .get(['media', mediaId], {
          id: mediaId,
          episodeOffset: 0,
        })
        .value()
    },
  },
  PastActivity: {
    async media({ id, mediaId = null }, _, { data }) {
      if (mediaId === null) {
        throw new Error(`Activity PastActivity:${id} does not have media id`)
      }

      return data
        .get(['media', mediaId], {
          id: mediaId,
          episodeOffset: 0,
        })
        .value()
    },
  },
  PendingActivity: {
    async media({ mediaId = null }, _, { data }) {
      if (mediaId === null) {
        return null
      }

      return data
        .get(['media', mediaId], {
          id: mediaId,
          episodeOffset: 0,
        })
        .value()
    },
  },
  CurrentActivity: {
    async media({ mediaId = null }, _, { data }) {
      if (mediaId === null) {
        return null
      }

      return data
        .get(['media', mediaId], {
          id: mediaId,
          episodeOffset: 0,
        })
        .value()
    },
  },
  Query: {
    _media: (_, { id_in = [] }, { data }) =>
      Promise.all(
        id_in.map(id =>
          data
            .get('media')
            .get(id, { id, episodeOffset: 0 })
            .value(),
        ),
      ),
  },
}

export interface MediaModel {
  id: number
  episodeOffset: number
  alternativeTitles?: string[]
}
