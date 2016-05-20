/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module emphasize
 * @fileoverview Create the language registry.
 */

'use strict';

/* eslint-env node */

/*
 * Dependencies.
 */

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

/*
 * Read.
 */

var doc = fs.readFileSync(path.join(
    __dirname,
    '..',
    'node_modules',
    'lowlight',
    'index.js'
), 'utf8');

/*
 * Write.
 */

fs.writeFileSync(
    path.join(__dirname, '..', 'index.js'),
    doc
        .replace(/\blow(light)?\b/g, 'emphasize')
        .replace(/Virtual syntax[\s\S]+?\./, 'Syntax highlighting in ANSI.')
);

/*
 * Report.
 */

/* eslint-disable no-console */

console.log(chalk.green('✓') + ' wrote `index.js`');
