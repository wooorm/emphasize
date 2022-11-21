import fs from 'node:fs'
import path from 'node:path'
import chalk from 'chalk'

const prefix = `// @ts-expect-error: this registers types for the language files.
/** @typedef {import('highlight.js/types/index.js')} DoNotTochItRegistersLanguageFiles */
`

fs.writeFileSync(
  path.join('lib', 'all.js'),
  prefix +
    String(
      fs.readFileSync(path.join('node_modules', 'lowlight', 'lib', 'all.js'))
    ).replace(/\blowlight\b/g, 'emphasize')
)

fs.writeFileSync(
  path.join('lib', 'common.js'),
  prefix +
    String(
      fs.readFileSync(path.join('node_modules', 'lowlight', 'lib', 'common.js'))
    ).replace(/\blowlight\b/g, 'emphasize')
)

console.log(chalk.green('✓') + ' wrote `all`, `common`')
