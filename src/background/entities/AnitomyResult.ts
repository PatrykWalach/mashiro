import { interfaceType } from 'nexus'

export default interfaceType({
  name: 'AnitomyResult',
  description:
    'mapped AnitomyResult from [anitomy-js](https://github.com/skiptirengu/anitomy-js)',
  definition(t) {
    t.string('animeTitle')
    t.string('episodeNumber')
    t.string('releaseGroup')
    t.string('videoResolution')
    t.nonNull.string('fileName')
    t.string('fileExtension')
  },
})
