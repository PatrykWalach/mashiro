import fetch from 'cross-fetch'
import { parse } from 'fast-xml-parser'

type ItemBase = {
  link?: string
  author?: string
  category?: string
  comments?: string
  enclousure?: string
  guid?: string
  pubDate?: Date
  source?: string
}

export type ItemWithTitle = ItemBase & { title: string; description?: string }
type ItemWithDescription = ItemBase & { description: string; title?: string }

export type Item = ItemWithDescription | ItemWithTitle

interface Image {
  url: string
  title: string
  link: string
  width?: number
  height?: number
  description?: string
}

interface TextInput {
  title: string
  description: string
  name: string
  link: string
}

interface Channel {
  title: string
  description: string
  link: string
  language?: string
  copyright?: string
  managingEditor?: string
  webMaster?: string
  pubDate?: string
  lastBuildDate?: string
  category?: string
  generator?: string
  docs?: string
  cloud?: string
  ttl?: string
  image?: Image
  textInput?: TextInput
  skipHours?: string
  skipDays?: string
  item?: Item[] | Item
}

interface Rss2 {
  channel: Channel
}

interface Data {
  rss: Rss2
}

export const fetchRssFeed = async (uri: string): Promise<Rss2> => {
  const response = await fetch(uri)
  const xml = await response.text()
  const data: Data = parse(xml)

  return data.rss
}
