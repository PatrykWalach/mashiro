/* eslint-disable @typescript-eslint/no-var-requires*/
const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = {
  configureWebpack: (config) => {
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
      experimentalNativeDepCheck: true,
      externals: [
        'graphql-tools',
        'graphql',
        'apollo-server-express',
        '@prisma/client',
        'nexus-plugin-prisma',
        'nexus',
        'express',
        '@urql/vue',
        '@urql/exchange-retry',
      ],
      mainProcessWatch: ['src/background/**/*'],
    },
    autoRouting: {
      chunkNamePrefix: 'page-',
    },
  },
}
