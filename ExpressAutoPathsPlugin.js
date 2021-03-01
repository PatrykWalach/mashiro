/* eslint-disable @typescript-eslint/no-var-requires*/
const fs = require('fs')
const fg = require('fast-glob')

function extractCatchPaths(path) {
  return path.replaceAll(/\[|\]/g, '')
}

function pathToCamelCase(path) {
  const cased = extractCatchPaths(path)
    .split('/')
    .map((key) => key[0].toUpperCase() + key.substr(1))
    .join('')
  return cased[0].toLowerCase() + cased.substr(1)
}

module.exports = class ExpressAutoPathsPlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(
      'ExpressAutoPathsPlugin',
      (compilation) => {
        try {
          const paths = fg
            .sync(['**/*.ts', '!**/_*.ts', '!**/_*/**'], {
              cwd: this.options.paths,
              onlyFiles: true,
            })
            .map((path) => path.replace(/\.\w+$/, ''))

          const code = `import { Router } from 'express'
          const router = Router()
          ${paths
            .map(
              (path) =>
                `import ${pathToCamelCase(path)} from '${
                  this.options.importPrefix
                }${path}'`,
            )
            .join('\n')}
            ${paths
              .map((path) => {
                return `router.route('/${extractCatchPaths(
                  path.replace(/\[/g, ':'),
                )}').get(${pathToCamelCase(path)})`
              })
              .join('\n\n')}
              export default router
              `
          fs.writeFileSync(this.options.output, code)

          fs.writeFileSync(
            this.options.types,
            `import { RequestHandler } from 'express'
            ${paths
              .map((path) => {
                const keys = {}

                for (const key of path.split('/')) {
                  if (!key.includes('[') || !key.includes(']')) {
                    continue
                  }
                  if (key in keys) {
                    keys[key] = 'string[]'
                  }
                  keys[key] = 'string'
                }

                const camelCasedPath = pathToCamelCase(path)
                return `export type ${camelCasedPath}Params = {${Object.entries(
                  keys,
                )
                  .map(([key, value]) => `${extractCatchPaths(key)}: ${value}`)
                  .join('\n')}}
                  export type ${camelCasedPath}Handler = RequestHandler<${camelCasedPath}Params>`
              })
              .join('\n\n')}`,
          )
        } catch (error) {
          compilation.errors.push(error)
        }
      },
    )
  }
}
