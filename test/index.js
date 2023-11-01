import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import process from 'node:process'
import test from 'node:test'
// `unicorn` is wrong here.
// eslint-disable-next-line unicorn/import-style
import {Chalk} from 'chalk'
import {isHidden} from 'is-hidden'
import {all, createEmphasize} from '../index.js'

/* eslint-disable no-await-in-loop */

const chalk = new Chalk({level: 2})

test('emphasize.highlight(language, value[, sheet])', async (t) => {
  const emphasize = createEmphasize(all)
  const result = emphasize.highlight('js', '')

  assert.throws(
    () => {
      // @ts-expect-error runtime.
      emphasize.highlight(true)
    },
    /expected `string` as `name`/,
    'should throw when not given `string` for `name`'
  )

  assert.throws(
    () => {
      // @ts-expect-error runtime.
      emphasize.highlight('js', true)
    },
    /expected `string` as `value`/,
    'should throw when not given `string` for `value`'
  )

  assert.throws(
    () => {
      emphasize.highlight('fooscript', '')
    },
    /^Error: Unknown language: `fooscript` is not registered$/,
    'should throw when given an unknown `language`'
  )

  assert.equal(
    result.relevance,
    0,
    'should return a `0` for `relevance` when empty'
  )

  assert.deepEqual(
    result.value,
    '',
    'should return an empty string for `value` when empty'
  )

  assert.deepEqual(
    emphasize.highlight('js', '# foo').value,
    '# foo',
    'should silently ignore illegals #1'
  )

  await t.test('fixture', () => {
    const result = emphasize.highlight(
      'java',
      'public void moveTo(int x, int y, int z);'
    )

    assert.equal(
      result.relevance,
      6,
      'should return the correct relevance for the fixture'
    )

    assert.equal(
      result.language,
      'java',
      'should return the correct language for the fixture'
    )

    assert.deepEqual(
      result.value,
      '\u001B[32mpublic\u001B[39m \u001B[32mvoid\u001B[39m \u001B[34mmoveTo\u001B[39m(\u001B[33mint\u001B[39m x, \u001B[33mint\u001B[39m y, \u001B[33mint\u001B[39m z);',
      'should return the correct sequences for the fixture'
    )
  })

  await t.test('custom `sheet`', () => {
    const result = emphasize.highlight(
      'java',
      'public void moveTo(int x, int y, int z);',
      {keyword: chalk.bold, title: chalk.italic}
    )

    assert.deepEqual(
      result.value,
      '\u001B[1mpublic\u001B[22m \u001B[1mvoid\u001B[22m \u001B[3mmoveTo\u001B[23m(int x, int y, int z);',
      'should support custom sheets'
    )
  })
})

test('emphasize.highlightAuto(value[, settings | sheet])', async (t) => {
  const emphasize = createEmphasize(all)
  const result = emphasize.highlightAuto('')

  assert.throws(
    () => {
      // @ts-expect-error runtime.
      emphasize.highlightAuto(true)
    },
    /expected `string` as `value`/,
    'should throw when not given a string'
  )

  assert.equal(
    result.relevance,
    0,
    'should return a `0` for `relevance` when empty'
  )

  assert.equal(
    result.language,
    undefined,
    'should return `undefined` for `language` when empty'
  )

  assert.deepEqual(
    result.value,
    '',
    'should return an empty string for `value` when empty'
  )

  await t.test('fixture', () => {
    const result = emphasize.highlightAuto('"use strict";')

    assert.equal(
      result.relevance,
      10,
      'should return the correct relevance for the fixture'
    )

    assert.equal(
      result.language,
      'javascript',
      'should return the correct language for the fixture'
    )

    assert.deepEqual(
      result.value,
      '\u001B[35m"use strict"\u001B[39m;',
      'should return the correct sequences for the fixture'
    )
  })

  await t.test('custom `sheet`', () => {
    const result = emphasize.highlightAuto('"use strict";', {meta: chalk.bold})

    assert.deepEqual(
      result.value,
      '\u001B[1m"use strict"\u001B[22m;',
      'should support custom sheets'
    )
  })

  await t.test('custom `subset`', () => {
    let result = emphasize.highlightAuto('"use strict";', {subset: ['java']})

    assert.equal(
      result.language,
      'java',
      'should support a given custom `subset`'
    )

    assert.doesNotThrow(() => {
      result = emphasize.highlightAuto('"use strict";', {
        subset: ['fooscript', 'javascript']
      })
    }, 'should ignore unregistered subset languages (#1)')

    assert.equal(
      result.language,
      'javascript',
      'should ignore unregistered subset languages (#2)'
    )
  })
})

test('fixtures', async () => {
  const base = new URL('fixture/', import.meta.url)
  const files = await fs.readdir(base)
  let index = -1
  const emphasize = createEmphasize(all)

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

    assert.equal(
      actual,
      expected,
      'should correctly process ' + name + ' in ' + language
    )
  }
})

/* eslint-enable no-await-in-loop */
