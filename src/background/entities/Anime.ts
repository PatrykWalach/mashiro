import { mutationField, objectType } from 'nexus'

const Anime = objectType({
  name: 'Anime',
  definition(t) {
    t.model.id()
    t.model.allTitles({
      pagination: false,
    })
    t.model.title()
    t.model.serviceId()
    t.model.serviceUrl()
    t.model.coverImage()
    t.model.episodes()
  },
})
const AnimeMutation = mutationField((t) => {
  // t.field('changeStatus', {
  //   args: {listEntry:'',to:'Status'},
  //   type: nonNull('Anime'),
  //   resolve() {},
  // })
})

export default [Anime, AnimeMutation]
