const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('composition-engine.js','utf8');
const sandbox={window:{},crypto:require('crypto').webcrypto,TextEncoder,structuredClone,Date,globalThis:null};
sandbox.globalThis=sandbox.window;
vm.createContext(sandbox);vm.runInContext(source,sandbox);
const engine=sandbox.window.CompositionEngine;
assert.strictEqual(engine.version,'2.9.0');
assert.ok(engine.representations.compact&&engine.representations.abc&&engine.representations.midi&&engine.representations.free);

const compact='H|["Test",96,4,4]\nV|["Piano",0,0]\nB|1|[[0,1,60,72],[1,1,64,76]]';
const c=engine.parseCompositionRepresentation(compact,'compact');
assert.strictEqual(c.format,'compact');assert.strictEqual(c.score.tracks[0].notes.length,2);

const midi='H|["Perf",120,4,4]\nV|["Piano",0,0]\nN|0|947|60|71\nN|956|931|64|77\nC|73|64|127\nC|3718|64|0';
const m=engine.parseCompositionRepresentation(midi,'midi');
assert.strictEqual(m.format,'midi');assert.strictEqual(m.score.tracks[0].notes[0][1],947/960);assert.strictEqual(m.score.tracks[0].cc.length,2);

const free=engine.parseCompositionRepresentation('FORMAT|MIDI\n'+midi,'free');
assert.strictEqual(free.format,'midi');

const pABC=engine.createPrompts({visibleTask:'Test',representation:'abc'}).composition;
const pMIDI=engine.createPrompts({visibleTask:'Test',representation:'midi'}).composition;
const pFree=engine.createPrompts({visibleTask:'Test',representation:'free'}).composition;
assert.ok(pABC.includes('ABC-NOTATION'));assert.ok(pMIDI.includes('960 PPQ'));assert.ok(pFree.includes('FORMAT|COMPACT'));
assert.strictEqual(typeof engine.analyzeScore,'function');assert.strictEqual(typeof engine.improveScore,'function');
assert.ok(source.includes("contextMode:'single-creative-source'"));assert.ok(!source.includes("'midi_translation'"));
assert.ok(source.includes("const analysisSource=(parsedFormat==='abc'||parsedFormat==='midi'||parsedFormat==='compact')?rawComposition:JSON.stringify(scoreToCompact(score));"));
console.log('Composition Engine 2.9.0 regression tests: OK');
