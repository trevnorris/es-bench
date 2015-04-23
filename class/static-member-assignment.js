'use strict';

// Currently run these tests with "--harmony_classes"

const runTest = require('../util/util').runTest;
const ITER = 1e7;

function noop() {}


class Readable {
  constructor() {
    this._onreadable = null;

    // Acquire the default onreadable callback if it's been set.
    if (typeof this.constructor._onreadable === 'function')
      this._onreadable = this.constructor._onreadable;
  }

  static onreadable(cb) {
    if (typeof cb !== 'function')
      throw new TypeError('callback must be a function');
    this._onreadable = cb;
  }
}
Readable._onreadable = null;

class MyReadable extends Readable {
  constructor() {
    super();
  }
}
MyReadable._onreadable = undefined;

runTest('MyReadable', function MyReadableTest(MyReadable, noop) {
  new MyReadable();
  MyReadable.onreadable(noop);
}, 1e7, MyReadable, noop);



function Rfn() {
  this._onreadable = null;

  if (this.constructor._onreadable === 'function')
    this._onreadable = this.constructor._onreadable;
}

Rfn.onreadable = function onreadable(cb) {
  if (typeof cb !== 'function')
    throw new TypeError('callback must be a function');

  this._onreadable = cb;
};
Rfn._onreadable = undefined;

function Myfn() {
  Rfn.apply(this, arguments);
}
Myfn.__proto__ = Rfn;
Myfn.prototype.__proto__ = Rfn.prototype;
Myfn._onreadable = undefined;

runTest('Myfn', function MyfnTest(Myfn, noop) {
  new Myfn();
  Myfn.onreadable(noop);
}, ITER, Myfn, noop);
