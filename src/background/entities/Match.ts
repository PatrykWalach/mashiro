import { Resolvers } from './__generated__/Match'

export default /* GraphQL */ `
  type Media {
    id: Int!
  }
  type Match {
    id: ID!
    title: String!
    media: Media!
  }
`

export interface MatchModel {
  _id: string
  title: string
  mediaId: number
}

export const MatchResolvers: Resolvers = {
  Match: {
    id: ({ _id }) => _id,
    media: ({ mediaId }, _, { data }) =>
      data
        .get('media')
        .find({ id: mediaId })
        .value(),
  },
}
