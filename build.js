'use strict';

/* Dependencies. */
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

/* Read. */
var doc = fs.readFileSync(path.join('node_modules', 'lowlight', 'index.js'), 'utf8');

doc = doc
  .replace(/\blow(light)?\b/g, 'emphasize')
  .replace(/Virtual syntax[\s\S]+?\./, 'Syntax highlighting in ANSI.');

/* Write. */
fs.writeFileSync(path.join('index.js'), doc);

/* Report. */
console.log(chalk.green('✓') + ' wrote `index.js`');
