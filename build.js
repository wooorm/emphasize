import fs from 'fs'
import path from 'path'
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
