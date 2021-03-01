import { prisma } from '../../../../context'
import { streamNextSSearchHandler } from '../../../../__generated__/paths'

const handler: streamNextSSearchHandler = async (req, res) => {
  const user = await prisma.user.findFirst({
    orderBy: {
      lastLoggedInAt: 'desc',
    },
    rejectOnNotFound: true,
  })

  console.log('user', user)

  const listEntry = await prisma.listEntry.findFirst({
    where: {
      userId: {
        equals: user.id,
      },
      anime: {
        title: {
          contains: req.params.search,
        },
      },
    },
    rejectOnNotFound: true,
    include: {
      anime: true,
    },
  })

  console.log('listEntry', listEntry)

  res.redirect(
    `/${user.name}/stream/${listEntry.progress + 1}/${listEntry.anime.title}`,
  )
}

export default handler
