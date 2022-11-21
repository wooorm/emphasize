import fs from 'node:fs/promises'
import process from 'node:process'
import test from 'tape'
import chalk from 'chalk'
import {isHidden} from 'is-hidden'
import {emphasize} from '../lib/all.js'

/* eslint-disable no-await-in-loop */

test('emphasize.highlight(language, value[, sheet])', (t) => {
  const result = emphasize.highlight('js', '')

  t.throws(
    () => {
      // @ts-expect-error runtime.
      emphasize.highlight(true)
    },
    /Expected `string` for name, got `true`/,
    'should throw when not given `string` for `name`'
  )

  t.throws(
    () => {
      // @ts-expect-error runtime.
      emphasize.highlight('js', true)
    },
    /Expected `string` for value, got `true`/,
    'should throw when not given `string` for `value`'
  )

  t.throws(
    () => {
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

  t.test('fixture', (t) => {
    const result = emphasize.highlight(
      'java',
      'public void moveTo(int x, int y, int z);'
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
      '\u001B[32mpublic\u001B[39m \u001B[32mvoid\u001B[39m \u001B[34mmoveTo\u001B[39m(\u001B[33mint\u001B[39m x, \u001B[33mint\u001B[39m y, \u001B[33mint\u001B[39m z);',
      'should return the correct sequences for the fixture'
    )

    t.end()
  })

  t.test('custom `sheet`', (t) => {
    const result = emphasize.highlight(
      'java',
      'public void moveTo(int x, int y, int z);',
      {keyword: chalk.bold, title: chalk.italic}
    )

    t.deepEqual(
      result.value,
      '\u001B[1mpublic\u001B[22m \u001B[1mvoid\u001B[22m \u001B[3mmoveTo\u001B[23m(int x, int y, int z);',
      'should support custom sheets'
    )

    t.end()
  })

  t.end()
})

test('emphasize.highlightAuto(value[, settings | sheet])', (t) => {
  const result = emphasize.highlightAuto('')

  t.throws(
    () => {
      // @ts-expect-error runtime.
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

  t.test('fixture', (t) => {
    const result = emphasize.highlightAuto('"use strict";')

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

    t.deepEqual(
      result.value,
      '\u001B[35m"use strict"\u001B[39m;',
      'should return the correct sequences for the fixture'
    )

    t.end()
  })

  t.test('custom `sheet`', (t) => {
    const result = emphasize.highlightAuto('"use strict";', {meta: chalk.bold})

    t.deepEqual(
      result.value,
      '\u001B[1m"use strict"\u001B[22m;',
      'should support custom sheets'
    )

    t.end()
  })

  t.test('custom `subset`', (t) => {
    let result = emphasize.highlightAuto('"use strict";', {subset: ['java']})

    t.equal(result.language, 'java', 'should support a given custom `subset`')

    t.doesNotThrow(() => {
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

test('fixtures', async (t) => {
  const base = new URL('fixture/', import.meta.url)
  const files = await fs.readdir(base)
  let index = -1

  while (++index < files.length) {
    const dirname = files[index]

    if (isHidden(dirname)) continue

    const folder = new URL(dirname + '/', base)
    const parts = dirname.split('-')
    const language = parts[0]
    const name = parts.slice(1).join('-')
    const input = String(await fs.readFile(new URL('input.txt', folder))).trim()
    const actual = emphasize.highlight(language, input).value
    /** @type {string} */
    let expected

    try {
      if ('UPDATE' in process.env) {
        throw new Error('Updating')
      }

      expected = String(await fs.readFile(new URL('output.txt', folder))).trim()
    } catch {
      expected = actual
      await fs.writeFile(new URL('output.txt', folder), actual + '\n')
    }

    t.deepEqual(
      actual,
      expected,
      'should correctly process ' + name + ' in ' + language
    )
  }

  t.end()
})

/* eslint-enable no-await-in-loop */
