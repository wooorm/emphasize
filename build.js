import fs from 'node:fs'
import path from 'node:path'
import chalk from 'chalk'

fs.writeFileSync(
  path.join('lib', 'all.js'),
  String(
    fs.readFileSync(path.join('node_modules', 'lowlight', 'lib', 'all.js'))
  ).replace(/\blowlight\b/g, 'emphasize')
)

fs.writeFileSync(
  path.join('lib', 'common.js'),
  String(
    fs.readFileSync(path.join('node_modules', 'lowlight', 'lib', 'common.js'))
  ).replace(/\blowlight\b/g, 'emphasize')
)

console.log(chalk.green('✓') + ' wrote `all`, `common`')
