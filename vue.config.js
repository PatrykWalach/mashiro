// const ThreadsPlugin = require('threads-plugin')
// const WorkerPlugin = require('worker-plugin')

module.exports = {
  pluginOptions: {
    electronBuilder: {
      chainWebpackMainProcess: config =>
        config
          .entry('tracker.worker')
          .add('./src/background/tracker.ts')
          .end(),
      // nodeIntegration: true,
      externals: ['ffi-napi', 'graphql-tools', 'graphql'],
      mainProcessWatch: ['src/background/**/*'],
    },
  },
}
