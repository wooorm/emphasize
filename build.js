import fs from 'node:fs/promises'
import chalk from 'chalk'

const prefix = `// @ts-expect-error: this registers types for the language files.
/** @typedef {import('highlight.js/types/index.js')} DoNotTochItRegistersLanguageFiles */
`

await fs.writeFile(
  new URL('lib/all.js', import.meta.url),
  prefix +
    String(
      await fs.readFile(
        new URL('node_modules/lowlight/lib/all.js', import.meta.url)
      )
    ).replace(/\blowlight\b/g, 'emphasize')
)

await fs.writeFile(
  new URL('lib/common.js', import.meta.url),
  prefix +
    String(
      await fs.readFile(
        new URL('node_modules/lowlight/lib/common.js', import.meta.url)
      )
    ).replace(/\blowlight\b/g, 'emphasize')
)

console.log(chalk.green('✓') + ' wrote `all`, `common`')
