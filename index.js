'use strict';
const Transform = require('stream').Transform;

const transform = module.exports = function (generator, options) {
  const stream = new Transform(options || {});
  let result;
  let error = null;
  const iterator = generator.call(Object.assign(stream, {
    _transform(chunk, encoding, cb) {
      if (result.done || error) {
        return cb(error);
      }

      try {
        result = iterator.next(chunk);
      } catch (e) {
        error = e;
      }
      cb(error);
    },
    _flush(cb) {
      if (result.done || error) {
        return cb(error);
      }

      try {
        result = iterator.next(null);
      } catch (e) {
        error = e;
      }
      cb();
    }
  }));
  try {
    result = iterator.next();
  } catch (e) {
    error = e;
  }
  return stream;
};

transform.string = (generator, options) =>
 transform(generator, Object.assign(options || {}, {decodeStrings: false}));

transform.object = (generator, options) =>
  transform(generator, Object.assign(options || {}, {objectMode: true}));
