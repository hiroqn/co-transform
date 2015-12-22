'use strict';
const fs = require('fs');

const test = require('ava');

const transform = require('./index');

test.cb('toUpperCase()', t => {
  let str = '';
  fs.createReadStream('README.md')
    .setEncoding('utf8')
    .pipe(transform(function * () {
      let chunk;
      while (Boolean(chunk = yield)) {
        this.push(chunk.toUpperCase());
      }
    }, {decodeStrings: false}))
    .on('data', chunk => {
      str += chunk;
    })
    .on('end', () => {
      t.is(fs.readFileSync('README.md', {encoding: 'utf8'}).toUpperCase(), str);
      t.end();
    });
});

test.cb('error at generator', t => {
  fs.createReadStream('README.md')
    .pipe(transform(function * () {
      let chunk;
      while (Boolean(chunk = yield)) {
        this.push(chunk);
        throw new Error('SomeError');
      }
    }))
    .on('error', error => {
      t.is(error.message, 'SomeError');
      t.end();
    })
    .on('end', () => {
      t.fail();
    });
});
