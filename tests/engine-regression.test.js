const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('composition-engine.js','utf8');
const sandbox={window:{},crypto:require('crypto').webcrypto,TextEncoder,structuredClone,Date,globalThis:null};
sandbox.globalThis=sandbox.window;
vm.createContext(sandbox);vm.runInContext(source,sandbox);
const engine=sandbox.window.CompositionEngine;
assert.strictEqual(engine.version,'2.12.0');
assert.ok(engine.representations.compact&&engine.representations.abc&&engine.representations.midi&&engine.representations.free);

const compact='H|["Test",96,4,4]\nV|["Piano",0,0]\nB|1|[[0,1,60,72],[1,1,64,76]]';
const c=engine.parseCompositionRepresentation(compact,'compact');
assert.strictEqual(c.format,'compact');assert.strictEqual(c.score.tracks[0].notes.length,2);

const midi='H|["Perf",120,4,4]\nV|["Piano",0,0]\nN|0|947|60|71\nN|956|931|64|77\nC|73|64|127\nC|3718|64|0';
const m=engine.parseCompositionRepresentation(midi,'midi');
assert.strictEqual(m.format,'midi');assert.strictEqual(m.score.tracks[0].notes[0][1],947/960);assert.strictEqual(m.score.tracks[0].cc.length,2);

const free=engine.parseCompositionRepresentation('FORMAT|MIDI\n'+midi,'free');
assert.strictEqual(free.format,'midi');


const creative=engine.createPrompts({visibleTask:'Test',representation:'abc'}).composition;
for(const forbidden of ['ABC-NOTATION','960 PPQ','FORMAT|COMPACT','MIDI-PERFORMANCE','KOMPAKTES PARTITURFORMAT','MusicXML']) assert.ok(!creative.includes(forbidden),'creative prompt must not expose technical representation: '+forbidden);
assert.ok(creative.includes('vollständig als Musik')&&creative.includes('musikalischen Entscheidungen frei'),'creative prompt must remain purely musical');
const realization=engine.createPrompts({visibleTask:'Test',representation:'abc'},'FERTIGE MUSIK').realization;
assert.ok(realization.includes('ABC-NOTATION'),'technical realization must receive the selected output contract');
assert.ok(realization.includes('Komponiere NICHT neu')&&realization.includes('Vereinfache, regularisiere oder verschönere die Musik NICHT'),'realizer must preserve the completed composition');
assert.ok(source.includes("contextMode:'creative-technical-separation'"));
assert.ok(source.includes("'musical_composition'")&&source.includes("'technical_realization'"));
assert.ok(source.includes("const analysisSource=(parsedFormat==='abc'||parsedFormat==='midi'||parsedFormat==='compact')?rawComposition:JSON.stringify(scoreToCompact(score));"));
assert.strictEqual(typeof engine.analyzeScore,'function');assert.strictEqual(typeof engine.improveScore,'function');
console.log('Composition Engine 2.12.0 creative/technical separation regression: OK');

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

const perf=engine.parseCompositionRepresentation('H|["Expressive",120,4,4]\nV|["Cello",42,0]\nN|0|960|60|70\nC|0|11|55\nC|960|64|127\nC|1920|64|0\nP|480|2048\nP|960|0\nT|1920|90','midi').score;
const perfBytes=Array.from(engine.buildMidi(perf));
const hasSeq=(a)=>perfBytes.some((_,i)=>a.every((v,j)=>perfBytes[i+j]===v));
assert.ok(hasSeq([176,11,55]),'MIDI export must preserve expression CC11');
assert.ok(hasSeq([176,64,127])&&hasSeq([176,64,0]),'MIDI export must preserve sustain pedal CC64');
assert.ok(hasSeq([224,0,80])&&hasSeq([224,0,64]),'MIDI export must preserve pitch bend and reset');
assert.ok(perfBytes.filter((v,i)=>v===255&&perfBytes[i+1]===81&&perfBytes[i+2]===3).length>=2,'MIDI export must preserve tempo changes');
console.log('MIDI expressive performance export: OK');

const ornaments=`X:1
T:Ornaments
M:4/4
L:1/8
K:C
V:Cello name="Violoncello"
[V:Cello] !p!{B}c2 !trill!d2 .e2 (f2 g2) | !fermata!a4 z4 |`;
const os=engine.parseCompositionRepresentation(ornaments,'abc').score, ox=os.tracks[0].expressions;
assert.ok(ox.some(e=>e.type==='grace'&&e.pitches.length===1),'grace notes must survive as symbolic performance data');
assert.ok(ox.some(e=>e.type==='ornament'&&e.kind==='trill'),'trill must survive as symbolic performance data');
assert.ok(ox.some(e=>e.type==='articulation'&&e.kind==='staccato'),'staccato must survive as symbolic performance data');
assert.ok(ox.some(e=>e.type==='slur'&&e.phase==='start')&&ox.some(e=>e.type==='slur'&&e.phase==='stop'),'slur boundaries must survive');
assert.ok(ox.some(e=>e.type==='fermata'),'fermata must survive as symbolic performance data');
console.log('ABC symbolic expression preservation: OK');

const oxScore=engine.parseCompositionRepresentation(ornaments,'abc').score;
assert.ok(engine.exportABC(oxScore).includes('!trill!')&&engine.exportABC(oxScore).includes('{B}'),'ABC export must preserve original trill and grace notation');
const xml=engine.exportMusicXML(oxScore);
assert.ok(xml.includes('<trill-mark/>'),'MusicXML must preserve trill');
assert.ok(xml.includes('<staccato/>'),'MusicXML must preserve staccato');
assert.ok(xml.includes('<slur type="start"/>')&&xml.includes('<slur type="stop"/>'),'MusicXML must preserve slurs');
assert.ok(xml.includes('<fermata/>'),'MusicXML must preserve fermata');
assert.ok(xml.includes('<dynamics><p/></dynamics>'),'MusicXML must preserve written dynamics');
const ensemble={title:'Ensemble',bpm:80,timeSignature:[4,4],tracks:[{name:'Cello',program:42,channel:0,notes:[[0,1,48,70]],expressions:[]},{name:'Piano',program:0,channel:1,notes:[[0,1,60,80]],expressions:[]}]};
const exml=engine.exportMusicXML(ensemble);assert.ok(exml.includes('id="P1"')&&exml.includes('id="P2"')&&exml.includes('<midi-program>43</midi-program>'),'MusicXML must export every instrument and correct 1-based MIDI program');
console.log('Expressive ABC/MusicXML export: OK');

const playSrc={title:'Playback',bpm:120,timeSignature:[4,4],tracks:[{name:'Cello',program:42,channel:0,notes:[[1,1,60,100],[4,1,55,90]],cc:[[0,11,64],[3.5,64,127],[6,64,0]],pitchBend:[],expressions:[{type:'grace',at:1,pitches:[59]},{type:'ornament',at:1,kind:'trill'},{type:'fermata',at:4}]}]};
const ps=engine.playbackScore(playSrc),pt=ps.tracks[0];
assert.ok(pt.notes.length>3,'playback must realize grace note and trill as sounding events');
assert.ok(pt.notes.some(n=>n[0]<1&&n[2]===59),'grace note must sound before its principal note');
assert.ok(pt.notes.some(n=>n[2]===62),'trill must alternate with upper neighbor');
assert.ok(pt.notes.find(n=>n[0]===1&&n[2]===60)[3]<100,'CC11 must affect playback expression');
assert.ok(pt.notes.find(n=>n[0]===4&&n[2]===55)[1]>1,'pedal and fermata must extend a sustained principal note');
console.log('Expressive playback realization: OK');
