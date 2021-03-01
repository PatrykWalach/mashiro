import { objectType } from 'nexus'

const AnimeTitleType = objectType({
  name: 'AnimeTitle',
  definition(t) {
    t.model.id()
    t.model.title()
  },
})

export default [AnimeTitleType]
