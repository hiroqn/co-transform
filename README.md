# co-transform
stream.Transform with generator

#Usage

`transform(generator, options)`

`generator`

```js
transform(function* () {
  this instanceof require('stream').Transform;
  let chunk = yield;              // you yield and get value
  throw new Error('SomeError')    // and you can throw error  = error event emit
  return                          // you can return           = end event emit
})
```

`options` is [stream.Transform](http://nodejs.org/docs/latest/api/stream.html#stream_class_stream_transform) options,
so, [stream.Readable options](https://nodejs.org/docs/latest/api/stream.html#stream_new_stream_readable_options) and
[stream.Writable options](https://nodejs.org/docs/latest/api/stream.html#stream_new_stream_writable_options)

#example

##String

```js
const transform = require('co-transform');

process.stdin
  .setEncoding('utf8')
  .pipe(transform(function* () {
    let chunk;
    while(chunk = yield) {
      this.push(chunk.toUpperCase());
    }
  }, {decodeStrings: false}))
  .pipe(process.stdout);
```

##Object

```js
objectStream
  .pipe(transform(function* () {
    let obj;
    while(obj = yield) {
      this.push(obj);
    }
  }, {objectMode: true}))
  .pipe(distStream);

```
