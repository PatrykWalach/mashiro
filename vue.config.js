/* eslint-disable @typescript-eslint/no-var-requires*/
const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = {
  configureWebpack: {
    plugins: [
      new CircularDependencyPlugin({
        exclude: /node_modules/,
        failOnError: true,
        allowAsyncCycles: false,
        cwd: process.cwd(),
      }),
    ],
  },
  pluginOptions: {
    electronBuilder: {
      chainWebpackMainProcess: config =>
        config
          .entry('tracker.worker')
          .add('./src/background/tracker.ts')
          .end(),
      // nodeIntegration: true,
      experimentalNativeDepCheck: true,
      externals: [
        // 'ffi-napi',
        'graphql-tools',
        // 'graphql',
        'apollo-server',
        '@prisma/client',
        // 'anitomy-js',
        'nexus-plugin-prisma',
        'nexus',
      ],
      mainProcessWatch: ['src/background/**/*'],
    },
  },
}
