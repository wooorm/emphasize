'use strict'

var fs = require('fs')
var path = require('path')
var test = require('tape')
var chalk = require('chalk')
var negate = require('negate')
var hidden = require('is-hidden')
var emphasize = require('..')

var read = fs.readFileSync
var join = path.join

var FIXTURES = path.join(__dirname, 'fixture')
var INPUT = 'input.txt'
var OUTPUT = 'output.txt'

test('emphasize.highlight(language, value[, sheet])', function(t) {
  var result = emphasize.highlight('js', '')

  t.throws(
    function() {
      emphasize.highlight(true)
    },
    /Expected `string` for name, got `true`/,
    'should throw when not given `string` for `name`'
  )

  t.throws(
    function() {
      emphasize.highlight('js', true)
    },
    /Expected `string` for value, got `true`/,
    'should throw when not given `string` for `value`'
  )

  t.throws(
    function() {
      emphasize.highlight('fooscript', '')
    },
    /^Error: Unknown language: `fooscript` is not registered$/,
    'should throw when given an unknown `language`'
  )

  t.equal(result.relevance, 0, 'should return a `0` for `relevance` when empty')

  t.deepEqual(
    result.value,
    '',
    'should return an empty string for `value` when empty'
  )

  t.deepEqual(
    emphasize.highlight('js', '# foo').value,
    '# foo',
    'should silently ignore illegals #1'
  )

  t.test('fixture', function(t) {
    var result = emphasize.highlight(
      'java',
      ['public void moveTo(int x, int y, int z);'].join('\n')
    )

    t.equal(
      result.relevance,
      6,
      'should return the correct relevance for the fixture'
    )

    t.equal(
      result.language,
      'java',
      'should return the correct language for the fixture'
    )

    t.deepEqual(
      result.value,
      '\u001B[32mpublic\u001B[39m \u001B[32mvoid\u001B[39m ' +
        '\u001B[34mmoveTo\u001B[39m(\u001B[32mint\u001B[39m x, ' +
        '\u001B[32mint\u001B[39m y, \u001B[32mint\u001B[39m z);',
      'should return the correct sequences for the fixture'
    )

    t.end()
  })

  t.test('custom `sheet`', function(t) {
    var result = emphasize.highlight(
      'java',
      ['public void moveTo(int x, int y, int z);'].join('\n'),
      {
        keyword: chalk.bold,
        title: chalk.italic
      }
    )

    t.deepEqual(
      result.value,
      '\u001B[1mpublic\u001B[22m \u001B[1mvoid\u001B[22m ' +
        '\u001B[3mmoveTo\u001B[23m(\u001B[1mint\u001B[22m x, ' +
        '\u001B[1mint\u001B[22m y, \u001B[1mint\u001B[22m z);',
      'should support custom sheets'
    )

    t.end()
  })

  t.end()
})

test('emphasize.highlightAuto(value[, settings | sheet])', function(t) {
  var result = emphasize.highlightAuto('')

  t.throws(
    function() {
      emphasize.highlightAuto(true)
    },
    /Expected `string` for value, got `true`/,
    'should throw when not given a string'
  )

  t.equal(result.relevance, 0, 'should return a `0` for `relevance` when empty')

  t.equal(
    result.language,
    null,
    'should return `null` for `language` when empty'
  )

  t.deepEqual(
    result.value,
    '',
    'should return an empty string for `value` when empty'
  )

  t.test('fixture', function(t) {
    var result = emphasize.highlightAuto('"use strict";')

    t.equal(
      result.relevance,
      10,
      'should return the correct relevance for the fixture'
    )

    t.equal(
      result.language,
      'javascript',
      'should return the correct language for the fixture'
    )

    t.equal(
      typeof result.secondBest,
      'object',
      'should return a `secondBest` result'
    )

    t.equal(
      result.secondBest.language,
      'abnf',
      'should return a `secondBest` `language`'
    )

    t.equal(
      result.secondBest.relevance,
      2,
      'should return a `secondBest` `relevance`'
    )

    t.deepEqual(
      result.value,
      '\u001B[35m"use strict"\u001B[39m;',
      'should return the correct sequences for the fixture'
    )

    t.end()
  })

  t.test('custom `sheet`', function(t) {
    var result = emphasize.highlightAuto('"use strict";', {meta: chalk.bold})

    t.deepEqual(
      result.value,
      '\u001B[1m"use strict"\u001B[22m;',
      'should support custom sheets'
    )

    t.end()
  })

  t.test('custom `subset`', function(t) {
    var result = emphasize.highlightAuto('"use strict";', {subset: ['java']})

    t.equal(result.language, 'java', 'should support a given custom `subset`')

    t.doesNotThrow(function() {
      result = emphasize.highlightAuto('"use strict";', {
        subset: ['fooscript', 'javascript']
      })
    }, 'should ignore unregistered subset languages (#1)')

    t.equal(
      result.language,
      'javascript',
      'should ignore unregistered subset languages (#2)'
    )

    t.end()
  })

  t.end()
})

test('fixtures', function(t) {
  fs
    .readdirSync(FIXTURES)
    .filter(negate(hidden))
    .forEach(function(filePath) {
      var parts = filePath.split('-')
      subtest(parts[0], parts.slice(1).join('-'), filePath)
    })

  function subtest(language, name, directory) {
    var input = read(join(FIXTURES, directory, INPUT), 'utf8').trim()
    var output = read(join(FIXTURES, directory, OUTPUT), 'utf8').trim()

    t.deepEqual(
      emphasize.highlight(language, input).value,
      output,
      'should correctly process ' + name + ' in ' + language
    )
  }

  t.end()
})
