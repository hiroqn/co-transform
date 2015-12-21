'use strict';
const fs = require('fs');

const test = require('ava');

const transform = require('./index');

test.cb('toUpperCase()', t => {
  let str = '';
  fs.createReadStream('index.js')
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
      t.is(fs.readFileSync('index.js', {encoding: 'utf8'}).toUpperCase(), str);
      t.end();
    });
});
