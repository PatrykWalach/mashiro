import { streamSSearchHandler } from '../../../__generated__/paths'

const handler: streamSSearchHandler = async (req, res) => {
  res.redirect(`/stream/next/s/${req.params.search}`)
}

export default handler
