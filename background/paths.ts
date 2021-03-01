import { Router } from 'express'
const router = Router()
import streamSSearch from './paths/stream/s/[search]'
import streamNextSSearch from './paths/stream/next/s/[search]'
import userNameStreamAnimeEpisodeAnimeTitle from './paths/[userName]/stream/[animeEpisode]/[animeTitle]'
router.route('/stream/s/:search').get(streamSSearch)

router.route('/stream/next/s/:search').get(streamNextSSearch)

router
  .route('/:userName/stream/:animeEpisode/:animeTitle')
  .get(userNameStreamAnimeEpisodeAnimeTitle)
export default router
