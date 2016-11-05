'use strict';

/* Dependencies. */
var fs = require('fs');
var path = require('path');
var test = require('tape');
var chalk = require('chalk');
var negate = require('negate');
var hidden = require('is-hidden');
var emphasize = require('..');

var read = fs.readFileSync;
var join = path.join;

var FIXTURES = path.join(__dirname, 'fixture');
var INPUT = 'input.txt';
var OUTPUT = 'output.txt';

/* Tests. */
test('emphasize.highlight(language, value[, sheet])', function (t) {
  var result = emphasize.highlight('js', '');

  t.throws(
    function () {
      emphasize.highlight(true);
    },
    /Expected `string` for name, got `true`/,
    'should throw when not given `string` for `name`'
  );

  t.throws(
    function () {
      emphasize.highlight('js', true);
    },
    /Expected `string` for value, got `true`/,
    'should throw when not given `string` for `value`'
  );

  t.throws(
    function () {
      emphasize.highlight('fooscript', '');
    },
    /Expected `fooscript` to be registered/,
    'should throw when given an unknown `language`'
  );

  t.equal(
    result.relevance,
    0,
    'should return a `0` for `relevance` when empty'
  );

  t.deepEqual(
    result.value,
    '',
    'should return an empty string for `value` when empty'
  );

  t.deepEqual(
    emphasize.highlight('js', '# foo').value,
    '# foo',
    'should silently ignore illegals #1'
  );

  t.test('fixture', function (st) {
    var result = emphasize.highlight('java', [
      'public void moveTo(int x, int y, int z);'
    ].join('\n'));

    st.equal(
      result.relevance,
      6,
      'should return the correct relevance for the fixture'
    );

    st.equal(
      result.language,
      'java',
      'should return the correct language for the fixture'
    );

    st.deepEqual(
      result.value,
      '\x1B[32mpublic\x1B[39m \x1B[32mvoid\x1B[39m ' +
      '\x1B[34mmoveTo\x1B[39m(\x1B[32mint\x1B[39m x, ' +
      '\x1B[32mint\x1B[39m y, \x1B[32mint\x1B[39m z);',
      'should return the correct sequences for the fixture'
    );

    st.end();
  });

  t.test('custom `sheet`', function (st) {
    var result = emphasize.highlight('java', [
      'public void moveTo(int x, int y, int z);'
    ].join('\n'), {
      keyword: chalk.bold,
      title: chalk.italic
    });

    st.deepEqual(
      result.value,
      '\x1B[1mpublic\x1B[22m \x1B[1mvoid\x1B[22m ' +
      '\x1B[3mmoveTo\x1B[23m(\x1B[1mint\x1B[22m x, ' +
      '\x1B[1mint\x1B[22m y, \x1B[1mint\x1B[22m z);',
      'should support custom sheets'
    );

    st.end();
  });

  t.end();
});

test('emphasize.highlightAuto(value[, settings | sheet])', function (t) {
  var result = emphasize.highlightAuto('');

  t.throws(
    function () {
      emphasize.highlightAuto(true);
    },
    /Expected `string` for value, got `true`/,
    'should throw when not given a string'
  );

  t.equal(
    result.relevance,
    0,
    'should return a `0` for `relevance` when empty'
  );

  t.equal(
    result.language,
    null,
    'should return `null` for `language` when empty'
  );

  t.deepEqual(
    result.value,
    '',
    'should return an empty string for `value` when empty'
  );

  t.test('fixture', function (st) {
    var result = emphasize.highlightAuto('"use strict";');

    st.equal(
      result.relevance,
      10,
      'should return the correct relevance for the fixture'
    );

    st.equal(
      result.language,
      'javascript',
      'should return the correct language for the fixture'
    );

    st.equal(
      typeof result.secondBest,
      'object',
      'should return a `secondBest` result'
    );

    st.equal(
      result.secondBest.language,
      'mipsasm',
      'should return a `secondBest` `language`'
    );

    st.equal(
      result.secondBest.relevance,
      2,
      'should return a `secondBest` `relevance`'
    );

    st.deepEqual(
      result.value,
      '\x1B[35m"use strict"\x1B[39m;',
      'should return the correct sequences for the fixture'
    );

    st.end();
  });

  t.test('custom `sheet`', function (st) {
    var result = emphasize.highlightAuto('"use strict";', {meta: chalk.bold});

    st.deepEqual(
      result.value,
      '\x1b[1m"use strict"\x1b[22m;',
      'should support custom sheets'
    );

    st.end();
  });

  t.test('custom `subset`', function (st) {
    var result = emphasize.highlightAuto('"use strict";', {subset: ['java']});

    t.equal(
      result.language,
      'java',
      'should support a given custom `subset`'
    );

    t.doesNotThrow(function () {
      result = emphasize.highlightAuto('"use strict";', {
        subset: ['fooscript', 'javascript']
      });
    }, 'should ignore unregistered subset languages (#1)');

    t.equal(
      result.language,
      'javascript',
      'should ignore unregistered subset languages (#2)'
    );

    st.end();
  });

  t.end();
});

test('fixtures', function (t) {
  fs
    .readdirSync(FIXTURES)
    .filter(negate(hidden))
    .forEach(function (filePath) {
      var parts = filePath.split('-');
      subtest(parts[0], parts.slice(1).join('-'), filePath);
    });

  function subtest(language, name, directory) {
    var input = read(join(FIXTURES, directory, INPUT), 'utf8').trim();
    var output = read(join(FIXTURES, directory, OUTPUT), 'utf8').trim();

    t.deepEqual(
      emphasize.highlight(language, input).value,
      output,
      'should correctly process ' + name + ' in ' + language
    );
  }

  t.end();
});
