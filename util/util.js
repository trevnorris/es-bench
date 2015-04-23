'use strict';

module.exports.runTest = runTest;
module.exports.parseArgs = parseArgs;

function runTest(msg, cb, iter) {
  var args = [];

  if (arguments.length > 3)
    args = parseArgs(arguments, 3);

  // Set test to be run on the next loop. Declaring here is intentional.
  // Want each new run to re-enter the runtime.
  setImmediate(function() {
    // First warm up the call (300 is arbitrary). Always use .apply().
    for (var i = 0; i < 300; i++)
      cb.apply(null, args);

    // Now run test.
    var t = process.hrtime();
    for (var i = 0; i < iter; i++)
      cb.apply(null, args);
    printTime(msg, process.hrtime(t), iter);
  });
}


function parseArgs(args, start) {
  var arr = [];
  for (var i = start; i < args.length; i++)
    arr.push(args[i]);
  return arr;
}



function printTime(msg, t, iter) {
  var tt = t[0] * 1e9 + t[1];
  process._rawDebug(`${msg}: ${(tt/iter).toFixed(1)} ns/op`);
}
