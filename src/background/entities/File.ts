import { join } from 'path'
import { extendType, objectType } from 'nexus'
export interface FileModel {
  id: string
  path: string
  // name: string
  mediaId?: number
  fileName: string
  // episode: number
}

const ExtendMedia = extendType({
  type: 'Media',
  definition(t) {
    t.nonNull.list.field('files', {
      type: 'File',
      resolve: ({ id }, _, { session }) =>
        session.get('files').filter({ mediaId: id }).value(),
    })
  },
})

const FileType = objectType({
  name: 'File',
  definition(t) {
    t.nonNull.id('id')
    t.nonNull.string('path')
    // t.nonNull.string('name')
    // t.nonNull.string('title')
    // t.nonNull.int('episode')
    t.implements('AnitomyResult')
  },
  sourceType: {
    module: join(__dirname, '../src/background/entities/File.ts'),
    export: 'FileModel',
  },
})

export default [ExtendMedia, FileType]
