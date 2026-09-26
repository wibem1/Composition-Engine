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

assert.strictEqual(engine.version, '2.7.0');

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
assert.throws(() => engine.extractJson('{"t":"Bad","b":90,"v":[["P",0,0,[[1,0,.5,60,80]'), e => e && e.name === 'SyntaxError');

// A score with an empty voice must not pass the special closing repair.
assert.throws(() => engine.extractJson('{"t":"Bad","b":90,"v":[["P",0,0,[]]}'), e => e && e.name === 'SyntaxError');

console.log('Composition Engine 2.2.3 regression tests: OK');


// Architecture invariant: the first creative stage is the composition itself, not a pre-composition draft.
const prompts = engine.createPrompts({visibleTask:'Erstelle ein Klavierstück.'});
assert.ok(typeof prompts.composition === 'string' && prompts.composition.length > 0);
assert.strictEqual(prompts.musicalDraft, undefined);
assert.ok(prompts.composition.includes('fertige Komposition direkt'));
assert.ok(prompts.composition.includes('KEINE zweite KI'));
assert.ok(prompts.composition.includes('praktisch spielbar'));
assert.strictEqual(prompts.midiTranslation, undefined);
assert.ok(engine.COMPOSITION_CONTRACT.includes('musikalische Quelle der Wahrheit'));

console.log('Architecture invariant direct-composition: OK');
assert.ok(source.includes("contextMode:'single-creative-source'"));
assert.ok(!source.includes("'midi_translation'"));

// Engine 2.4.0: analysis/improvement are general engine capabilities.
assert.strictEqual(typeof engine.analyzeScore, 'function');
assert.strictEqual(typeof engine.improveScore, 'function');
assert.strictEqual(typeof engine.criticalAnalysisPrompt, 'function');
assert.strictEqual(typeof engine.approvedImprovementPrompt, 'function');
const analysisPrompt = engine.criticalAnalysisPrompt({title:'Test',bpm:80,timeSignature:[4,4],tracks:[]});
assert.ok(analysisPrompt.includes('URTEIL: ÄNDERN'));
assert.ok(analysisPrompt.includes('URTEIL: BEHALTEN'));
const improvementPrompt = engine.approvedImprovementPrompt({title:'Test',bpm:80,timeSignature:[4,4],tracks:[]},'URTEIL: ÄNDERN\\nBegleitung variieren.');
assert.ok(improvementPrompt.includes('hörbare Schwäche'));
assert.ok(improvementPrompt.includes('Bewahre überzeugende Eigenschaften'));
const openaiTechnical = engine.makeRequest('openai','gpt-5.6','x','approved_score_improvement');
assert.strictEqual(openaiTechnical.body.reasoning,undefined);
const geminiTechnical = engine.makeRequest('google','gemini-3.8-flash','x','approved_score_improvement');
assert.strictEqual(geminiTechnical.body.generationConfig,undefined);
console.log('Engine 2.4.0 analysis/improvement capability: OK');

// Engine 2.4.1: every improved version can be assessed as the current version.
assert.strictEqual(typeof engine.analyzeImprovement, 'function');
assert.strictEqual(typeof engine.postImprovementAnalysisPrompt, 'function');
const postPrompt=engine.postImprovementAnalysisPrompt({title:'Aktuell',bpm:80,timeSignature:[4,4],tracks:[]});
assert.ok(postPrompt.includes('unabhängig als musikalisches Werk'));
assert.ok(postPrompt.includes('URTEIL: BEHALTEN'));
assert.ok(engine.criticalAnalysisPrompt({title:'Test',bpm:80,timeSignature:[4,4],tracks:[]}).includes('musikalisches Werk'));
const openaiImprovement=engine.makeRequest('openai','gpt-5.6','x','approved_score_improvement');
assert.strictEqual(openaiImprovement.body.reasoning,undefined);
const geminiImprovement=engine.makeRequest('google','gemini-3.8-flash','x','approved_score_improvement');
assert.strictEqual(geminiImprovement.body.generationConfig,undefined);
console.log('Engine 2.5.0 audible-flow and independent reassessment: OK');
