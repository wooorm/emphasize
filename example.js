// Dependencies:
var fs = require('fs');
var emphasize = require('./index.js');

// Read a sample file:
var doc = fs.readFileSync('./example.css', 'utf8');

// Which yields:
console.log('css', doc);

// Compile:
var output = emphasize.highlightAuto(doc).value;

// Yields:
console.log('txt', JSON.stringify(output).slice(1, -1).replace(/\\n/g, '\n'));

// And looks as follows:
// ![Screenshot showing the code in terminal](screenshot.png)
