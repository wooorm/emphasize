// @ts-expect-error: this registers types for the language files.
/** @typedef {import('highlight.js/types/index.js')} DoNotTochItRegistersLanguageFiles */
import arduino from 'highlight.js/lib/languages/arduino'
import bash from 'highlight.js/lib/languages/bash'
import c from 'highlight.js/lib/languages/c'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import css from 'highlight.js/lib/languages/css'
import diff from 'highlight.js/lib/languages/diff'
import go from 'highlight.js/lib/languages/go'
import graphql from 'highlight.js/lib/languages/graphql'
import ini from 'highlight.js/lib/languages/ini'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import kotlin from 'highlight.js/lib/languages/kotlin'
import less from 'highlight.js/lib/languages/less'
import lua from 'highlight.js/lib/languages/lua'
import makefile from 'highlight.js/lib/languages/makefile'
import markdown from 'highlight.js/lib/languages/markdown'
import objectivec from 'highlight.js/lib/languages/objectivec'
import perl from 'highlight.js/lib/languages/perl'
import php from 'highlight.js/lib/languages/php'
import phpTemplate from 'highlight.js/lib/languages/php-template'
import plaintext from 'highlight.js/lib/languages/plaintext'
import python from 'highlight.js/lib/languages/python'
import pythonRepl from 'highlight.js/lib/languages/python-repl'
import r from 'highlight.js/lib/languages/r'
import ruby from 'highlight.js/lib/languages/ruby'
import rust from 'highlight.js/lib/languages/rust'
import scss from 'highlight.js/lib/languages/scss'
import shell from 'highlight.js/lib/languages/shell'
import sql from 'highlight.js/lib/languages/sql'
import swift from 'highlight.js/lib/languages/swift'
import typescript from 'highlight.js/lib/languages/typescript'
import vbnet from 'highlight.js/lib/languages/vbnet'
import wasm from 'highlight.js/lib/languages/wasm'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'
import {emphasize} from './core.js'

emphasize.registerLanguage('arduino', arduino)
emphasize.registerLanguage('bash', bash)
emphasize.registerLanguage('c', c)
emphasize.registerLanguage('cpp', cpp)
emphasize.registerLanguage('csharp', csharp)
emphasize.registerLanguage('css', css)
emphasize.registerLanguage('diff', diff)
emphasize.registerLanguage('go', go)
emphasize.registerLanguage('graphql', graphql)
emphasize.registerLanguage('ini', ini)
emphasize.registerLanguage('java', java)
emphasize.registerLanguage('javascript', javascript)
emphasize.registerLanguage('json', json)
emphasize.registerLanguage('kotlin', kotlin)
emphasize.registerLanguage('less', less)
emphasize.registerLanguage('lua', lua)
emphasize.registerLanguage('makefile', makefile)
emphasize.registerLanguage('markdown', markdown)
emphasize.registerLanguage('objectivec', objectivec)
emphasize.registerLanguage('perl', perl)
emphasize.registerLanguage('php', php)
emphasize.registerLanguage('php-template', phpTemplate)
emphasize.registerLanguage('plaintext', plaintext)
emphasize.registerLanguage('python', python)
emphasize.registerLanguage('python-repl', pythonRepl)
emphasize.registerLanguage('r', r)
emphasize.registerLanguage('ruby', ruby)
emphasize.registerLanguage('rust', rust)
emphasize.registerLanguage('scss', scss)
emphasize.registerLanguage('shell', shell)
emphasize.registerLanguage('sql', sql)
emphasize.registerLanguage('swift', swift)
emphasize.registerLanguage('typescript', typescript)
emphasize.registerLanguage('vbnet', vbnet)
emphasize.registerLanguage('wasm', wasm)
emphasize.registerLanguage('xml', xml)
emphasize.registerLanguage('yaml', yaml)

export {emphasize} from './core.js'
