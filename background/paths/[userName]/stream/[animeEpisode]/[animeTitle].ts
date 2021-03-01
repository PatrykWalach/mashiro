import { createReadStream, promises } from 'fs'
import { join } from 'path'

import { anitomy } from '../../../../context'

import { userNameStreamAnimeEpisodeAnimeTitleHandler } from '../../../../__generated__/paths'

async function findPathToFile(
  options: Record<'animeEpisode' | 'animeTitle', string>,
  dirPath: string,
): Promise<string> {
  const fileOrDirNames = await promises.readdir(dirPath)

  return Promise.any<string>(
    fileOrDirNames.map(async (fileOrDirName) => {
      const fileOrDirPath = join(dirPath, fileOrDirName)
      const stats = await promises.lstat(fileOrDirPath)

      if (stats.isDirectory()) {
        return findPathToFile(options, fileOrDirPath)
      }

      if (!stats.isFile()) {
        throw new Error()
      }
      const fileName = fileOrDirName
      const result = await anitomy.getResult(fileName)

      if (
        !(
          result.episodeNumber &&
          result.episodeNumber.includes(options.animeEpisode)
        ) ||
        result.animeTitle !== options.animeTitle
      ) {
        throw new Error()
      }

      return fileOrDirPath
    }),
  )
}

const FILES_DIR = 'D:\\Pobrane'

const handler: userNameStreamAnimeEpisodeAnimeTitleHandler = async (
  req,
  res,
) => {
  const path = await findPathToFile(req.params, FILES_DIR)

  console.log('path', path)

  // Ensure there is a range given for the video
  const stat = await promises.stat(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    console.log('play range')
    const parts = range.replace(/bytes=/, '').split('-')
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
    const chunksize = end - start + 1
    const file = createReadStream(path, { start, end })
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    // console.log(head)
    res.writeHead(206, head)

    file.pipe(res).on('finish', () => {
      console.log('finish pipe')
    })
  } else {
    console.log('play no range')
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    createReadStream(path).pipe(res)
  }
}

export default handler
