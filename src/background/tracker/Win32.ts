import { EventEmitter } from 'events'

const state = {
  extensions: ['mkv'],
  players: [''],
}

interface Player {
  id: string
  className: string
  title: string
}

import { Library, Callback } from 'ffi-napi'
import { diff } from '../util'

// const knl32 = K.load()
const user32 = Library('user32.dll', {
  EnumWindows: ['bool', ['pointer', 'int']],
  GetWindowTextLengthW: ['int', ['pointer']],
  GetClassNameA: ['int', ['pointer', 'pointer', 'int']],
  // GetWindowTextW: ['int', ['pointer', 'pointer', 'int']],
  GetWindowTextA: ['int', ['pointer', 'pointer', 'int']],
})

// const EnumWindowsProc = alloc(DTypes.WNDENUMPROC, (handle: number) => {
//   console.log(handle)
// })

const getWindows = () => {
  const windows: Player[] = []

  const EnumWindowsProc = Callback(
    'bool',
    ['pointer', 'int'],
    (handle: Buffer) => {
      const length = user32.GetWindowTextLengthW(handle)
      const classNameBuffer = Buffer.alloc(32)
      const titleBuffer = Buffer.alloc(length + 1)

      user32.GetClassNameA(handle, classNameBuffer, 32)

      user32.GetWindowTextA(handle, titleBuffer, length + 1)

      const className = classNameBuffer.toString('utf-8')
      const title = titleBuffer.toString('utf-8')

      windows.push({
        id: className + title,
        // className + title
        className,
        title,
      })

      return true
    },
  )

  user32.EnumWindows(EnumWindowsProc, 0)
  return windows
}

export declare interface Win32Tracker {
  on(event: 'players-closed', listener: (name: Player[]) => void): this
  on(event: 'players-opened', listener: (name: Player[]) => void): this
  emit(event: 'players-closed', name: Player[]): boolean
  emit(event: 'players-opened', name: Player[]): boolean
}

const playersComparator = (a: Player, b: Player) => a.id.localeCompare(b.id)

const createIsPlayer = () => {
  const regexp = new RegExp(state.extensions.map((ext) => `.${ext}`).join('|'))

  return ({ className, title }: Player) =>
    state.players.some((playerName) => className.includes(playerName)) &&
    regexp.test(title)
}

export class Win32Tracker extends EventEmitter {
  private prevPlayers: Player[]
  private interval: NodeJS.Timeout

  destroy() {
    clearInterval(this.interval)
  }

  constructor(prevPlayers: Player[] = []) {
    super()
    this.prevPlayers = prevPlayers
    this.interval = setInterval(() => {
      this.updatePlayers()
    }, 5000)
  }

  private updatePlayers() {
    const isPlayer = createIsPlayer()

    const nextPlayers = getWindows().filter(isPlayer).sort(playersComparator)

    const [opened, closed] = diff(
      this.prevPlayers,
      nextPlayers,
      playersComparator,
    )

    if (opened.length) {
      this.emit('players-opened', opened)
    }

    if (closed.length) {
      this.emit('players-closed', closed)
    }

    this.prevPlayers = nextPlayers
  }
}
