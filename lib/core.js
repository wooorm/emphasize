/**
 * @typedef {import('lowlight').Root} LowlightRoot
 * @typedef {import('lowlight').AutoOptions} LowlightAutoOptions
 * @typedef {import('lowlight/lib/core.js').Span} LowlightElementSpan
 * @typedef {import('lowlight/lib/core.js').Text} Text
 */

/**
 * @typedef {LowlightRoot['data'] & {value: string}} Result
 * @typedef {(value: string) => string} Style
 * @typedef {Record<string, Style>} Sheet
 * @typedef {{sheet?: Sheet, subset?: string[]}} AutoOptions
 */

// `unicorn` is wrong here.
// eslint-disable-next-line unicorn/import-style
import {Chalk} from 'chalk'
import {lowlight} from 'lowlight/lib/core.js'

const chalk = new Chalk({level: 2})
const own = {}.hasOwnProperty

export const emphasize = {
  highlight,
  highlightAuto,
  listLanguages: lowlight.listLanguages,
  registerLanguage: lowlight.registerLanguage,
  registerAlias: lowlight.registerAlias,
  registered: lowlight.registered
}

/**
 * Default style sheet.
 *
 * @type {Sheet}
 */
const defaultSheet = {
  comment: chalk.gray,
  quote: chalk.gray,

  keyword: chalk.green,
  'selector-tag': chalk.green,
  addition: chalk.green,

  number: chalk.cyan,
  string: chalk.cyan,
  'meta meta-string': chalk.cyan,
  literal: chalk.cyan,
  doctag: chalk.cyan,
  regexp: chalk.cyan,

  title: chalk.blue,
  section: chalk.blue,
  name: chalk.blue,
  'selector-id': chalk.blue,
  'selector-class': chalk.blue,

  attribute: chalk.yellow,
  attr: chalk.yellow,
  variable: chalk.yellow,
  'template-variable': chalk.yellow,
  'class title': chalk.yellow,
  type: chalk.yellow,

  symbol: chalk.magenta,
  bullet: chalk.magenta,
  subst: chalk.magenta,
  meta: chalk.magenta,
  'meta keyword': chalk.magenta,
  'selector-attr': chalk.magenta,
  'selector-pseudo': chalk.magenta,
  link: chalk.magenta,

  /* eslint-disable camelcase */
  built_in: chalk.red,
  /* eslint-enable camelcase */
  deletion: chalk.red,

  emphasis: chalk.italic,
  strong: chalk.bold,
  formula: chalk.inverse
}

/**
 * Highlight `value` as `language`.
 *
 * @param {string} language Language name
 * @param {string} value Code value
 * @param {Sheet} [sheet] Style sheet
 * @returns {Result}
 */
function highlight(language, value, sheet) {
  const result = lowlight.highlight(language, value)
  return {...result.data, value: visit(sheet || defaultSheet, result)}
}

/**
 * Guess `value`s syntax.
 *
 * @param {string} value Code value
 * @param {Sheet|AutoOptions} [options] Style sheet or options
 * @returns {Result}
 */
function highlightAuto(value, options) {
  /** @type {Sheet|undefined} */
  let sheet
  /** @type {LowlightAutoOptions|undefined} */
  let config

  if (options) {
    if ('subset' in options || 'sheet' in options) {
      // @ts-expect-error Looks like options.
      sheet = options.sheet
      // @ts-expect-error Looks like options.
      config = {subset: options.subset}
    } else {
      // @ts-expect-error Looks like options.
      sheet = options
    }
  }

  const result = lowlight.highlightAuto(value, config)
  return {...result.data, value: visit(sheet || defaultSheet, result)}
}

/**
 * Visit one `node`.
 *
 * @param {Sheet} sheet
 * @param {LowlightRoot|LowlightElementSpan|Text} node
 */
function visit(sheet, node) {
  const names = new Set(
    node.type === 'element'
      ? node.properties.className.map((d) => d.replace(/^hljs-/, ''))
      : []
  )
  /** @type {Sheet} */
  const scoped = {}
  /** @type {Style|undefined} */
  let style
  /** @type {string} */
  let content = ''
  /** @type {string} */
  let key

  for (key in sheet) {
    if (own.call(sheet, key)) {
      const parts = key.split(' ')
      const color = sheet[key]

      if (names.has(parts[0])) {
        if (parts.length === 1) {
          style = color
        } else {
          scoped[parts.slice(1).join(' ')] = color
        }
      } else {
        scoped[key] = color
      }
    }
  }

  if ('value' in node) {
    content = node.value
  } else if ('children' in node) {
    content = all(scoped, node.children)
  }

  if (style) {
    content = style(content)
  }

  return content
}

/**
 * Visit children in `node`.
 *
 * @param {Sheet} sheet
 * @param {Array<LowlightElementSpan|Text>} nodes
 * @returns {string}
 */
function all(sheet, nodes) {
  /** @type {string[]} */
  const result = []
  let index = -1

  while (++index < nodes.length) {
    result.push(visit(sheet, nodes[index]))
  }

  return result.join('')
}
