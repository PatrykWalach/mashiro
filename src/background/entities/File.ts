import { Resolvers } from './__generated__/File'

export default /* GraphQL */ `
  type Media {
    files: [File]
  }

  type File {
    id: ID!
    path: String!
    name: String!
    title: String!
    episode: Int!
  }
`

export interface FileModel {
  id: string
  path: string
  name: string
  mediaId?: number
  title: string
  episode: number
}

export const FileResolvers: Resolvers = {
  Media: {
    files: ({ id }, _, { data, session }) =>
      session
        .get('files')
        .filter({ mediaId: id })
        .value(),
  },
}
