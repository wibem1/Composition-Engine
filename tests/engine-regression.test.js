const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('composition-engine.js','utf8');
const sandbox={window:{},crypto:require('crypto').webcrypto,TextEncoder,structuredClone,Date,globalThis:null};
sandbox.globalThis=sandbox.window;
vm.createContext(sandbox);vm.runInContext(source,sandbox);
const engine=sandbox.window.CompositionEngine;
assert.strictEqual(engine.version,'2.11.0');
assert.ok(engine.representations.compact&&engine.representations.abc&&engine.representations.midi&&engine.representations.free);

const compact='H|["Test",96,4,4]\nV|["Piano",0,0]\nB|1|[[0,1,60,72],[1,1,64,76]]';
const c=engine.parseCompositionRepresentation(compact,'compact');
assert.strictEqual(c.format,'compact');assert.strictEqual(c.score.tracks[0].notes.length,2);

const midi='H|["Perf",120,4,4]\nV|["Piano",0,0]\nN|0|947|60|71\nN|956|931|64|77\nC|73|64|127\nC|3718|64|0';
const m=engine.parseCompositionRepresentation(midi,'midi');
assert.strictEqual(m.format,'midi');assert.strictEqual(m.score.tracks[0].notes[0][1],947/960);assert.strictEqual(m.score.tracks[0].cc.length,2);

const free=engine.parseCompositionRepresentation('FORMAT|MIDI\n'+midi,'free');
assert.strictEqual(free.format,'midi');


const dyn=engine.abcVelocityMap('!mf! C D E F !diminuendo(! G A B c !diminuendo)! d e f g !f! a b');
assert.ok(Math.min(...dyn)>=28,'ABC dynamics must not run away below ppp');
assert.ok(dyn.slice(4,8)[0]>dyn.slice(4,8)[3],'diminuendo hairpin must descend');
assert.strictEqual(dyn[dyn.length-2],94,'explicit forte must reset the dynamic level');

const noDynamics={tracks:[{notes:[[0,1,60,80]]}]};
engine.applyAbcVelocities('X:1\\nT:Plain\\nK:C\\nC D E F',noDynamics);
assert.strictEqual(noDynamics.tracks[0].notes[0][3],80,'ABC without dynamics must preserve parser velocity');
assert.ok(source.includes('VERGEBENE WERKTITEL'),'prior titles must be included in composition prompt');
const pABC=engine.createPrompts({visibleTask:'Test',representation:'abc'}).composition;
const pMIDI=engine.createPrompts({visibleTask:'Test',representation:'midi'}).composition;
const pFree=engine.createPrompts({visibleTask:'Test',representation:'free'}).composition;
assert.ok(pABC.includes('ABC-NOTATION'));assert.ok(pMIDI.includes('960 PPQ'));assert.ok(pFree.includes('FORMAT|COMPACT'));
assert.strictEqual(typeof engine.analyzeScore,'function');assert.strictEqual(typeof engine.improveScore,'function');
assert.ok(source.includes("contextMode:'single-creative-source'"));assert.ok(!source.includes("'midi_translation'"));
assert.ok(source.includes("const analysisSource=(parsedFormat==='abc'||parsedFormat==='midi'||parsedFormat==='compact')?rawComposition:JSON.stringify(scoreToCompact(score));"));
console.log('Composition Engine 2.11.0 consolidated regression tests: OK');

const abc=`X:1
T:Three voices
M:4/4
L:1/8
K:Am
V:Vln name="Violine"
V:RH name="Klavier"
V:LH name="Bass"
[V:Vln]
A2 c2 e2 a2 | g4 e4 |
[V:RH]
[Ace]4 [GBe]4 | [Ace]8 |
[V:LH]
A,,4 E,4 | A,,8 |`;
const parsed=engine.parseCompositionRepresentation(abc,'abc').score;
assert.strictEqual(parsed.barCount,2);
assert.strictEqual(parsed.tracks.length,3);
assert.deepStrictEqual(Array.from(parsed.tracks,t=>t.program),[40,0,0]);
assert.deepStrictEqual(Array.from(parsed.tracks,t=>t.notes[0][0]),[0,0,0]);
assert.deepStrictEqual(Array.from(parsed.tracks,t=>t.notes[0][2]),[69,69,45]);
console.log('Engine-owned ABC multi-voice regression: OK');

const decorated=`X:1
T:Decorations
M:4/4
L:1/8
K:Dm
V:Vln name="Violine" clef=treble
V:RH name="Klavier" clef=treble
V:LH name="Klavier" clef=bass
[V:Vln]
!p!d2 f2 a2 g2 | !mf!d2 f2 a2 g2 | !<(!g2 f2 e2 d2 | !<)! !pp!f2 e2 d4 |
[V:RH]
[df]2 [fa]2 [ad']2 [fa]2 | [df]2 [fa]2 [ad']2 [fa]2 | [df]2 [fa]2 [ad']2 [fa]2 | [df]2 [fa]2 [ad']2 [fa]2 |
[V:LH]
D,2 A,2 D,2 A,2 | D,2 A,2 D,2 A,2 | D,2 A,2 D,2 A,2 | D,2 A,2 D,2 A,2 |`;
const ds=engine.parseCompositionRepresentation(decorated,'abc').score;
assert.strictEqual(ds.barCount,4,'ABC decorations must not create phantom notes or extra bars');
assert.strictEqual(ds.tracks.length,3);
assert.deepStrictEqual(Array.from(ds.tracks,t=>Math.max(...t.notes.map(n=>n[0]+n[1]))),[16,16,16]);
assert.strictEqual(ds.tracks[0].notes[0][3],50);
assert.strictEqual(ds.tracks[0].notes[4][3],78);
assert.strictEqual(ds.tracks[0].notes.at(-1)[3],38);
assert.strictEqual(ds.tracks[1].notes[0][3],78,'dynamics must not leak between voices');
console.log('ABC decorations and per-voice dynamics: OK');

const expressive=`X:1
T:Cello and piano
M:3/4
L:1/8
Q:1/4=66
K:Dm
V:Cello clef=bass name="Violoncello"
V:RH clef=treble name="Klavier"
V:LH clef=bass name="Klavier"
[V:Cello] z6 | !p!(D2 F2 A2) | !crescendo(! .d2 e2 !accent!f2 !crescendo)! |
[V:RH] [DFA]6 | [DFA]6 | [CEG]6 |
[V:LH] D,,6 | D,,6 | C,,6 |`;
const ex=engine.parseCompositionRepresentation(expressive,'abc').score;
assert.strictEqual(ex.tracks.length,3);
assert.deepStrictEqual(Array.from(ex.tracks,t=>t.program),[42,0,0],'Cello must be GM Cello, both piano staves GM Piano');
assert.strictEqual(ex.tracks[0].name,'Violoncello');
assert.ok(ex.tracks[0].notes[0][3] < ex.tracks[0].notes.at(-1)[3],'cello crescendo must increase velocity');
assert.ok(ex.tracks[0].notes[0][1] > .9,'slur must preserve connected note duration');
assert.ok(ex.tracks[0].notes[3][1] < .7,'staccato must shorten performed duration');
assert.ok(ex.tracks[0].notes.at(-1)[3] >= ex.tracks[0].notes.at(-2)[3],'accent must not reduce velocity');
console.log('ABC expressive cello/piano performance regression: OK');

const quoted=`X:1
T:Quoted directions
M:4/4
L:1/4
K:C
V:Cello name="Violoncello"
[V:Cello] "dolce"C D E F |`;
const qs=engine.parseCompositionRepresentation(quoted,'abc').score;
assert.strictEqual(qs.tracks[0].notes.length,4,'quoted text/chord annotations must never become phantom notes');
console.log('ABC quoted annotation regression: OK');
