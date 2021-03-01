import { Win32Tracker } from './tracker/Win32'
import { parentPort } from 'worker_threads'
const tracker = new Win32Tracker()

console.log('thread-working')
parentPort && parentPort.postMessage({ type: 'thread-working' })

tracker.on('players-closed', (payload) => {
  parentPort && parentPort.postMessage({ type: 'players-closed', payload })
})

tracker.on('players-opened', (payload) => {
  parentPort &&
    parentPort.postMessage({
      type: 'players-opened',
      payload,
    })
})

// expose(
//   () =>
//     new Observable(observer => {
//     }),
// )
