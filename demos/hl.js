// Written by Max Calcagno with the help of ChatGPT

// Usage:  This can accept input from a file parameter
// or from stdin.  It wil syntax highlight whatever
// code it receives.

// Syntax example(s):
//   echo "console.log('valid js code')" | node hl.js
//   node hl.js valid_js_code.js

// Emphasize is from
// https://github.com/wooorm/emphasize

import fs from 'node:fs/promises';
import { createInterface } from "node:readline";
import {emphasize} from 'emphasize';

let sourceCodeText = '';

const filePath = process.argv.slice(2).join(' ');

if (filePath)
  sourceCodeText += String(await fs.readFile(filePath));
else // if path not defined, resort to stdin
  if (!process.stdin.isTTY)
    for await (const line of createInterface({ input: process.stdin }))
      sourceCodeText += line + '\n';

console.log(emphasize.highlightAuto(sourceCodeText).value);
