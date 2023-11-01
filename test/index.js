import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import process from 'node:process'
import test from 'node:test'
import {Chalk} from 'chalk'
import {all, common, createEmphasize} from 'emphasize'

const chalk = new Chalk({level: 2})

test('emphasize', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('emphasize')).sort(), [
      'all',
      'common',
      'createEmphasize'
    ])
  })
})

test('highlight', async function (t) {
  await t.test(
    'should throw when not given `string` for `name`',
    async function () {
      const emphasize = createEmphasize()

      assert.throws(function () {
        // @ts-expect-error: check how the runtime handles an invalid value.
        emphasize.highlight(true)
      }, /expected `string` as `name`/)
    }
  )

  await t.test(
    'should throw when not given `string` for `value`',
    async function () {
      const emphasize = createEmphasize()

      assert.throws(function () {
        // @ts-expect-error: check how the runtime handles an invalid value.
        emphasize.highlight('js', true)
      }, /expected `string` as `value`/)
    }
  )

  await t.test(
    'should throw when given an unknown `language`',
    async function () {
      const emphasize = createEmphasize()

      assert.throws(function () {
        emphasize.highlight('fooscript', '')
      }, /^Error: Unknown language: `fooscript` is not registered$/)
    }
  )

  await t.test('should work when empty', async function () {
    const emphasize = createEmphasize(common)
    assert.deepEqual(emphasize.highlight('js', ''), {
      language: 'js',
      relevance: 0,
      value: ''
    })
  })

  await t.test('should work', function () {
    const emphasize = createEmphasize(common)

    assert.deepEqual(
      emphasize.highlight('java', 'public void moveTo(int x, int y, int z);'),
      {
        language: 'java',
        relevance: 6,
        value:
          '\u001B[32mpublic\u001B[39m \u001B[32mvoid\u001B[39m \u001B[34mmoveTo\u001B[39m(\u001B[33mint\u001B[39m x, \u001B[33mint\u001B[39m y, \u001B[33mint\u001B[39m z);'
      }
    )
  })

  await t.test('should support custom sheets', function () {
    const emphasize = createEmphasize(common)

    assert.equal(
      emphasize.highlight('java', 'public void moveTo(int x, int y, int z);', {
        keyword: chalk.bold,
        title: chalk.italic
      }).value,
      '\u001B[1mpublic\u001B[22m \u001B[1mvoid\u001B[22m \u001B[3mmoveTo\u001B[23m(int x, int y, int z);'
    )
  })

  await t.test('should silently ignore illegals', async function () {
    const emphasize = createEmphasize(common)

    assert.deepEqual(emphasize.highlight('js', '# foo'), {
      language: 'js',
      relevance: 0,
      value: '# foo'
    })
  })
})

test('highlightAuto', async function (t) {
  await t.test('should throw when not given a string', async function () {
    const emphasize = createEmphasize(common)

    assert.throws(function () {
      // @ts-expect-error: check how the runtime handles an invalid value.
      emphasize.highlightAuto(true)
    }, /expected `string` as `value`/)
  })

  await t.test('should work when empty', async function () {
    const emphasize = createEmphasize(common)
    const result = emphasize.highlightAuto('')
    assert.deepEqual(result, {
      language: undefined,
      relevance: 0,
      value: ''
    })
  })

  await t.test('should work', async function () {
    const emphasize = createEmphasize(common)
    const result = emphasize.highlightAuto('"use strict";')

    assert.deepEqual(result, {
      language: 'javascript',
      relevance: 10,
      value: '\u001B[35m"use strict"\u001B[39m;'
    })
  })

  await t.test('should support custom sheets', async function () {
    const emphasize = createEmphasize(common)
    const result = emphasize.highlightAuto('"use strict";', {
      meta: chalk.bold
    })

    assert.deepEqual(result, {
      language: 'javascript',
      relevance: 10,
      value: '\u001B[1m"use strict"\u001B[22m;'
    })
  })

  await t.test('should support a `subset`', async function () {
    const emphasize = createEmphasize(common)
    const result = emphasize.highlightAuto('"use strict";', {subset: ['java']})

    assert.equal(result.language, 'java')
  })

  await t.test(
    'should ignore unregistered subset languages (#1)',
    async function () {
      const emphasize = createEmphasize(common)
      const result = emphasize.highlightAuto('"use strict";', {
        subset: ['fooscript', 'javascript']
      })

      assert.equal(result.language, 'javascript')
    }
  )
})

test('fixtures', async function (t) {
  const base = new URL('fixture/', import.meta.url)
  const files = await fs.readdir(base)
  let index = -1
  const emphasize = createEmphasize(all)

  while (++index < files.length) {
    const dirname = files[index]

    if (dirname.charAt(0) === '.') continue

    const folder = new URL(dirname + '/', base)
    const language = dirname.split('-')[0]

    await t.test(dirname, async function () {
      const input = String(
        await fs.readFile(new URL('input.txt', folder))
      ).trim()
      const actual = emphasize.highlight(language, input).value
      /** @type {string} */
      let expected

      try {
        if ('UPDATE' in process.env) {
          throw new Error('Updating')
        }

        expected = String(
          await fs.readFile(new URL('output.txt', folder))
        ).trim()
      } catch {
        expected = actual
        await fs.writeFile(new URL('output.txt', folder), actual + '\n')
      }

      assert.equal(actual, expected)
    })
  }
})
