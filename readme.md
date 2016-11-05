# emphasize [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Syntax highlighting in ANSI.  Like [highlight.js][highlight] (through
[lowlight][]), but for the terminal.

**emphasize** supports [all 168 syntaxes][names] of [highlight.js][highlight].

## Installation

[npm][]:

```bash
npm install emphasize
```

## Usage

Say `example.css` looks as follows:

```css
@font-face {
  font-family: Alpha;
  src: url('Bravo.otf');
}

body, .charlie, #delta {
  color: #bada55;
  background-color: rgba(33, 33, 33, 0.33);
  font-family: "Alpha", sans-serif;
}

@import url(echo.css);

@media print {
  a[href^=http]::after {
    content: attr(href)
  }
}
```

And `example.js` contains the following:

```javascript
var fs = require('fs');
var emphasize = require('emphasize');

var doc = fs.readFileSync('./example.css', 'utf8');

var output = emphasize.highlightAuto(doc).value;
```

Now, running `node example` yields:

```txt
@\u001b[32mfont-face\u001b[39m {
  \u001b[33mfont-family\u001b[39m: Alpha;
  \u001b[33msrc\u001b[39m: \u001b[31murl\u001b[39m(\u001b[36m'Bravo.otf'\u001b[39m);
}

\u001b[32mbody\u001b[39m, \u001b[34m.charlie\u001b[39m, \u001b[34m#delta\u001b[39m {
  \u001b[33mcolor\u001b[39m: \u001b[36m#bada55\u001b[39m;
  \u001b[33mbackground-color\u001b[39m: \u001b[31mrgba\u001b[39m(33, 33, 33, 0.33);
  \u001b[33mfont-family\u001b[39m: \u001b[36m\"Alpha\"\u001b[39m, sans-serif;
}

@\u001b[32mimport\u001b[39m url(echo.css);

@\u001b[32mmedia\u001b[39m print {
  \u001b[32ma\u001b[39m\u001b[35m[href^=http]\u001b[39m\u001b[35m::after\u001b[39m {
    \u001b[33mcontent\u001b[39m: \u001b[31mattr\u001b[39m(href)
  }
}
```

And looks as follows:

![Screenshot showing the code in terminal](screenshot.png)

## API

### `emphasize.highlight(language, value[, sheet])`

Parse `value` according to the `language` grammar.

###### Parameters

*   `name` (`string`)
    — See list of [names and aliases][names];
*   `value` (`string`)
    — Source to highlight;
*   `sheet` ([`Sheet?`][sheet], optional)
    — See below.

###### Returns

`Object`:

*   `relevance` (`number`)
    — Integer representing how sure **emphasize** is the given code is
    in the given language;
*   `language` (`string`)
    — The given `language`;
*   `value` (`string`)
    — Given document, wrapped in ANSI sequences.

### `emphasize.highlightAuto(value[, sheet | options])`

Parse `value` by guessing its grammar.

###### Parameters

*   `value` (`string`)
    — Source to highlight;
*   `sheet` ([`Sheet?`][sheet], optional)
    — See below;
*   `options` (`Object?`, optional):

    *   `sheet` ([`Sheet?`][sheet], optional)
        — See below;
    *   `subset` (`Array.<string>?`, optional, defaults to
        all registered languages.)
        — List of allowed languages.

###### Returns

`Object`:

*   `relevance` (`number`)
    — Integer representing how sure **emphasize** is the given code
    is in the detected language;
*   `language` (`string`)
    — Detected `language`;
*   `value` (`string`)
    — Given document, wrapped in ANSI sequences;
*   `secondBest` (`Object?`)
    — Object with the same structure as the top returned object, but
    containing information for the second-best result.  Can be `null`.

### `emphasize.registerLanguage(name, syntax)`

Register a syntax.  Useful in the browser or with custom grammars.

###### Parameters

*   `name` (`string`)
    — Name of language;
*   `syntax` (`Function`)
    — Syntax highlighter, see [`highlight.js`s docs][syntax] for more
    information.

### `Sheet`

A sheet is an object mapping [**highlight.js** classes][classes] to
functions.  The `hljs-` prefix must not be used in
those classes.  The “descendant selector” (a space) is supported.

Those functions receive a value (`string`), which they should wrap
in ANSI sequences, and return.  For convenience, [chalk’s chaining of
styles][styles] is suggested.

An abbreviated example is as follows:

```js
{
  'comment': chalk.gray,
  'meta meta-string': chalk.cyan,
  'meta keyword': chalk.magenta,
  'emphasis': chalk.italic,
  'strong': chalk.bold,
  'formula': chalk.inverse
};
```

## Emphasize in the browser

I do not suggest using the pre-built files or requiring `emphasize` in
the browser as that would include a _very_ large file.

Instead, require `emphasize/lib/core`, and include only the used
highlighters.  For example:

```js
var emphasize = require('emphasize/lib/core');
var js = require('highlight.js/lib/languages/javascript');

emphasize.registerLanguage('javascript', js);

emphasize.highlight('js', '"use strict";').value;
// '\u001b[35m"use strict"\u001b[39m;'
```

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/emphasize.svg

[travis]: https://travis-ci.org/wooorm/emphasize

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/emphasize.svg

[codecov]: https://codecov.io/github/wooorm/emphasize

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[sheet]: #sheet

[highlight]: https://github.com/isagalaev/highlight.js

[lowlight]: https://github.com/wooorm/lowlight

[names]: https://github.com/isagalaev/highlight.js/blob/master/docs/css-classes-reference.rst#language-names-and-aliases

[syntax]: https://github.com/isagalaev/highlight.js/blob/master/docs/language-guide.rst

[classes]: http://highlightjs.readthedocs.io/en/latest/css-classes-reference.html

[styles]: https://github.com/chalk/chalk#styles
