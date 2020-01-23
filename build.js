'use strict'

var fs = require('fs')
var path = require('path')
var chalk = require('chalk')

var doc = fs.readFileSync(require.resolve('lowlight'), 'utf8')

doc = doc
  .replace(/\blow(light)?\b/g, 'emphasize')
  .replace(/Virtual syntax[\s\S]+?\./, 'ANSI syntax highlighting.')

fs.writeFileSync(path.join('index.js'), doc)

console.log(chalk.green('✓') + ' wrote `index.js`')
