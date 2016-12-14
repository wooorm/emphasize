'use strict';

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

var doc = fs.readFileSync(path.join('node_modules', 'lowlight', 'index.js'), 'utf8');

doc = doc
  .replace(/\blow(light)?\b/g, 'emphasize')
  .replace(/Virtual syntax[\s\S]+?\./, 'Syntax highlighting in ANSI.');

fs.writeFileSync(path.join('index.js'), doc);

console.log(chalk.green('✓') + ' wrote `index.js`');
