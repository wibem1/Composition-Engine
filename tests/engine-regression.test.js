const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const source = fs.readFileSync('composition-engine.js', 'utf8');
const sandbox = {
  window: {},
  crypto: require('crypto').webcrypto,
  TextEncoder,
  structuredClone,
  Date
};
vm.createContext(sandbox);
vm.runInContext(source, sandbox);
const engine = sandbox.window.CompositionEngine;

assert.strictEqual(engine.version, '2.2.3');

// Regression 2.2.2: JSON short decimals outside strings are accepted without altering strings.
const shortDecimals = '{"t":"Punkt .5 bleibt Text","b":96,"m":[4,4],"v":[["Piano",0,0,[[1,0,.5,60,80],[1,.5,.25,62,80]]]]}';
const parsedShort = engine.extractJson(shortDecimals);
assert.strictEqual(parsedShort.t, 'Punkt .5 bleibt Text');
assert.strictEqual(parsedShort.v[0][3][0][2], 0.5);
assert.strictEqual(parsedShort.v[0][3][1][1], 0.5);
assert.strictEqual(parsedShort.v[0][3][1][2], 0.25);

// Regression 2.2.3: exactly one missing outer v-array bracket can be closed
// only when the resulting complete score is structurally valid.
const missingOuterV = '{"t":"Duo","b":88,"m":[4,4],"v":[["RH",0,0,[[1,0,.5,60,80]]],["LH",0,1,[[1,0,.5,48,80]]]}';
const repaired = engine.extractJson(missingOuterV);
assert.strictEqual(repaired.v.length, 2);
assert.strictEqual(repaired.v[0][3].length, 1);
assert.strictEqual(repaired.v[1][3].length, 1);

// Truncated musical data must not be silently repaired.
assert.throws(() => engine.extractJson('{"t":"Bad","b":90,"v":[["P",0,0,[[1,0,.5,60,80]'), SyntaxError);

// A score with an empty voice must not pass the special closing repair.
assert.throws(() => engine.extractJson('{"t":"Bad","b":90,"v":[["P",0,0,[]]}'), SyntaxError);

console.log('Composition Engine 2.2.3 regression tests: OK');
