/* eslint-disable @typescript-eslint/no-var-requires*/
const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = {
  configureWebpack: config => {
    config.module.rules.push({
      test: /\.vue$/,
      use: [
        {
          loader: 'vue-windicss-preprocess',
          options: {
            config: 'tailwind.config.js', // tailwind config file path OR config object (optional)
            compile: false, // false: interpretation mode; true: compilation mode
            globalPreflight: true, // set preflight style is global or scoped
            globalUtility: true, // set utility style is global or scoped
            prefix: 'windi-', // set compilation mode style prefix
          },
        },
      ],
    })

    config.plugins.push(
      new CircularDependencyPlugin({
        exclude: /node_modules/,
        failOnError: true,
        allowAsyncCycles: false,
        cwd: process.cwd(),
      }),
    )
  },

  pluginOptions: {
    electronBuilder: {
      // mainProcessTypeChecking: true,
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
        'graphql',
        'apollo-server',
        '@prisma/client',
        // 'anitomy-js',
        'nexus-plugin-prisma',
        'nexus',
      ],
      mainProcessWatch: ['src/background/**/*'],
    },
    autoRouting: {
      chunkNamePrefix: 'page-',
    },
  },
}
