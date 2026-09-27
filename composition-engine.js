(()=>{'use strict';

const ENGINE_NAME='Composition Engine';
const ENGINE_VERSION='2.10.1';

const COMPOSITION_CONTRACT=`KOMPAKTES PARTITURFORMAT:\nH|["Titel",BPM,Zähler,Nenner]\nV|["Instrument",Program,Channel]\nB|Takt|[[Position,Dauer,Pitch,Velocity],...]\nDanach weitere B-Zeilen oder eine neue V-Zeile. Jede Zeile ist abgeschlossen. Takt beginnt bei 1; Position und Dauer in Viertelnoten-Einheiten. Pausen sind Lücken. Notennamen werden nicht zusätzlich ausgegeben.`
const TECHNICAL_CONTRACT=COMPOSITION_CONTRACT;
const REPRESENTATION_CONTRACTS=Object.freeze({
 compact:COMPOSITION_CONTRACT,
 abc:`ABC-NOTATION:
Gib ausschließlich vollständige, gültige ABC-Notation aus. Verwende X:, T:, M:, L:, Q: und K:. Mehrstimmigkeit mit V:-Stimmen. Keine Erklärung außerhalb der ABC-Notation.`,
 midi:`MIDI-PERFORMANCE-TEXT (960 PPQ):
H|["Titel",BPM,Zähler,Nenner]
V|["Instrument",Program,Channel]
N|StartTick|DauerTicks|Pitch|Velocity
Optional: C|Tick|Controller|Wert
Danach weitere N-/C-Zeilen oder eine neue V-Zeile. StartTick und Dauer sind frei auf 960 Ticks pro Viertelnote aufgelöst; keine Quantisierung auf Notenwerte.`,
 free:`Wähle selbst diejenige der drei Repräsentationen, in der du diese Musik am besten komponieren kannst: COMPACT, ABC oder MIDI.
Beginne exakt mit FORMAT|COMPACT, FORMAT|ABC oder FORMAT|MIDI und gib danach ausschließlich die vollständige Komposition im gewählten Format aus.
COMPACT:
${COMPOSITION_CONTRACT}
ABC:
vollständige gültige ABC-Notation mit X:, T:, M:, L:, Q:, K: und bei Bedarf V:-Stimmen.
MIDI:
MIDI-PERFORMANCE-TEXT mit H|, V|, N|StartTick|DauerTicks|Pitch|Velocity sowie optional C|Tick|Controller|Wert, T|Tick|BPM und P|Tick|Wert; 960 PPQ.`
});
function representationOf(snapshot){const r=String(snapshot?.representation||'compact').toLowerCase();return REPRESENTATION_CONTRACTS[r]?r:'compact'}
function createPrompts(snapshot,composition=''){
 const representation=representationOf(snapshot),contract=REPRESENTATION_CONTRACTS[representation];
 return{
  composition:'AUFTRAG:\n'+snapshot.visibleTask+'\n\nGib die fertige Komposition vollständig und syntaktisch abgeschlossen ausschließlich in diesem technischen Ausgabeformat aus:\n'+contract,
  compositionIdea:'Beschreibe die bereits fertig komponierte Partitur konkret, differenziert und hörbezogen. Erfasse nur Eigenschaften, die aus der tatsächlichen Partitur hervorgehen. Etwa 500 bis 900 Zeichen, höchstens 900 Zeichen. Keine Bewertung, keine Verbesserungsvorschläge und keine Wiederholung des Auftrags.\\n\\nFERTIGE PARTITUR:\\n'+composition
 };
}
function criticalAnalysisPrompt(score){return 'Beurteile diese Partitur als musikalisches Werk. Suche nicht zwanghaft nach Fehlern. Frage zuerst, ob die Komposition in ihrem Charakter, Verlauf, ihrer Phrasierung, Rhythmik, Harmonik, Textur, Spannung und Entwicklung musikalisch überzeugt. Nenne nur dann ÄNDERN, wenn eine wesentliche musikalische Schwäche vorliegt und eine Änderung einen klaren hörbaren Gewinn verspricht. Kleine technische Auffälligkeiten, einzelne Notenlücken, Überlappungen oder MIDI-Dauern sind NICHT Gegenstand dieser musikalischen Analyse und dürfen allein kein ÄNDERN begründen. Beginne genau mit "URTEIL: ÄNDERN" oder "URTEIL: BEHALTEN". Danach höchstens 220 Zeichen: bei ÄNDERN die eine wichtigste musikalische Schwäche und eine knappe musikalische Verbesserung; bei BEHALTEN ein knapper Grund. Keine Lobhudelei, keine technische Fehlerliste, keine Takt-für-Takt-Abhandlung.\\n\\nPARTITUR:\\n'+JSON.stringify(scoreToCompact(score))+'\\n\\nFORMAT:\\n'+TECHNICAL_CONTRACT}
function conciseAssessment(value){
 const raw=String(value||'').trim().replace(/\r/g,'');
 const m=raw.match(/^\s*URTEIL:\s*(ÄNDERN|BEHALTEN)\b\s*([\s\S]*)$/i);
 if(!m)return raw.slice(0,220);
 const verdict='URTEIL: '+m[1].toUpperCase();
 const reason=m[2].replace(/^\s*[:\-–—]?\s*/,'').replace(/\s+/g,' ').trim();
 return reason?verdict+'\n'+reason.slice(0,220):verdict;
}
function approvedImprovementPrompt(score,assessment){return 'Überarbeite die vorhandene Partitur musikalisch mit voller kompositorischer Sorgfalt. Beseitige die im freigegebenen Urteil diagnostizierten hörbaren Ursachen tatsächlich. Priorität haben Fluss und Phrasierung: ungewollte Minipausen, Lücken, zu kurze Dauern, fehlende Bindung, abgehackte Übergänge oder mechanisches Stolpern müssen in den konkreten Startzeiten und Dauern korrigiert werden, soweit sie nicht musikalisch beabsichtigt sind. Prüfe die geänderten Passagen als zusammenhängenden zeitlichen Verlauf. Bewahre überzeugende Eigenschaften und ändere nichts ohne musikalischen Grund. Antworte ausschließlich mit der vollständigen Partitur im kompakten JSON-Format.\\n\\nFREIGEGEBENES URTEIL:\\n'+String(assessment||'').trim()+'\\n\\nPARTITUR:\\n'+JSON.stringify(scoreToCompact(score))+'\\n\\nFORMAT:\\n'+TECHNICAL_CONTRACT}
function postImprovementAnalysisPrompt(improvedScore){return 'Beurteile diese Partitur unabhängig als musikalisches Werk, ohne eine frühere Fassung vorauszusetzen. Suche nicht zwanghaft nach Fehlern. Entscheide, ob eine wesentliche musikalische Schwäche vorliegt, deren Änderung einen klaren hörbaren Gewinn verspricht. Kleine technische Auffälligkeiten, einzelne Notenlücken, Überlappungen oder MIDI-Dauern sind nicht Gegenstand dieser musikalischen Analyse. Beginne genau mit "URTEIL: ÄNDERN" oder "URTEIL: BEHALTEN". Danach höchstens 220 Zeichen: nur die wichtigste musikalische Begründung; bei ÄNDERN eine knappe musikalische Verbesserung. Keine Lobhudelei, keine technische Fehlerliste.\\n\\nPARTITUR:\\n'+JSON.stringify(scoreToCompact(improvedScore))+'\\n\\nFORMAT:\\n'+TECHNICAL_CONTRACT}
async function analyzeScore({score,snapshot,key,requestModel,run=null,event=null}){if(!score)throw new Error('Keine Partitur für die Analyse.');if(typeof requestModel!=='function')throw new Error('requestModel fehlt.');const promptText=criticalAnalysisPrompt(score),text=conciseAssessment(await requestModel({snapshot,key,promptText,stage:'critical_score_analysis',run,event}));return{assessment:text,unchanged:/^\\s*URTEIL:\\s*BEHALTEN\\b/im.test(text),promptText}}
async function analyzeImprovement({improvedScore,snapshot,key,requestModel,run=null,event=null}){if(!improvedScore)throw new Error('Verbesserungsfassung fehlt.');if(typeof requestModel!=='function')throw new Error('requestModel fehlt.');const promptText=postImprovementAnalysisPrompt(improvedScore),text=conciseAssessment(await requestModel({snapshot,key,promptText,stage:'post_improvement_analysis',run,event}));return{assessment:text,unchanged:/^\\s*URTEIL:\\s*BEHALTEN\\b/im.test(text),promptText}}
function scoreToCompact(score){const ts=Array.isArray(score?.timeSignature)?score.timeSignature:[4,4],beats=(Number(ts[0])||4)*(4/(Number(ts[1])||4));return{t:String(score?.title||''),b:Number(score?.bpm)||120,m:ts,v:(score?.tracks||[]).map((tr,i)=>[String(tr.name||('Track '+(i+1))),Number(tr.program)||0,Number.isFinite(Number(tr.channel))?Number(tr.channel):i,(tr.notes||[]).map(n=>{const start=Number(n?.[0])||0,bar=Math.floor(start/beats)+1,pos=start-(bar-1)*beats,row=[bar,pos,Number(n?.[1])||.25,Number(n?.[2])||60,Number(n?.[3])||80];if(typeof n?.[4]==='string'&&n[4])row.push(n[4]);return row})])}}
async function improveScore({score,assessment,snapshot,key,requestModel,run=null,event=null}){if(!score||!String(assessment||'').trim())throw new Error('Partitur oder Verbesserungsvorschlag fehlt.');if(typeof requestModel!=='function')throw new Error('requestModel fehlt.');const promptText=approvedImprovementPrompt(score,assessment),text=String(await requestModel({snapshot,key,promptText,stage:'approved_score_improvement',run,event})||'').trim(),obj=extractJson(text),improvedScore=findScore(obj);return{score:improvedScore,midiBytes:buildMidi(improvedScore),raw:text,promptText}}

function mergeTitleRegistry(savedTitles,activeTitles){const seen=new Set(),result=[];for(const value of [...(savedTitles||[]),...(activeTitles||[])]){const t=String(value||'').trim(),key=t.toLocaleLowerCase('de-DE');if(t&&!seen.has(key)){seen.add(key);result.push(t)}}return result}
function duplicateTitlePrompt(title,allTitles,draft){const hint=String(draft||'').slice(0,700);return'Erfinde ausschließlich einen neuen kurzen Werktitel für die bereits fertige Komposition. Keine musikalische Änderung. Antworte nur mit dem Titel.\n\nBISHERIGER TITEL:\n'+title+'\n\nBEREITS VERWENDET:\n'+allTitles.join('\n')+'\n\nKURZER KONTEXT:\n'+hint}
function makeRequest(p,m,promptText,stage){if(p==='openai')return{provider:p,model:m,url:'https://api.openai.com/v1/responses',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{API_KEY}}'},body:{model:m,input:[{role:'user',content:[{type:'input_text',text:promptText}]}],store:false}};if(p==='anthropic'){const body={model:m,max_tokens:32768,messages:[{role:'user',content:promptText}]};return{provider:p,model:m,url:'https://api.anthropic.com/v1/messages',method:'POST',headers:{'Content-Type':'application/json','x-api-key':'{{API_KEY}}','anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body};}const body={contents:[{role:'user',parts:[{text:promptText}]}]};if(/^gemini-3\./i.test(m)&&stage==='composition_idea_afterwards')body.generationConfig={thinkingConfig:{thinkingLevel:'low'}};return{provider:p,model:m,url:`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent?key={{API_KEY}}`,method:'POST',headers:{'Content-Type':'application/json'},body}}
function actualRequest(s,key){const headers={...s.headers};let url=s.url;for(const k of Object.keys(headers)){if(typeof headers[k]==='string'&&headers[k].includes('{{API_KEY}}'))headers[k]=headers[k].replace('{{API_KEY}}',key)}url=url.replace('{{API_KEY}}',encodeURIComponent(key));return{url,headers,body:structuredClone(s.body)}}
function extractText(p,j){if(p==='openai'){if(typeof j.output_text==='string')return j.output_text;const parts=[];for(const item of(j.output||[]))for(const c of(item.content||[]))if(typeof c.text==='string')parts.push(c.text);return parts.join('\n')}if(p==='anthropic')return(j.content||[]).filter(x=>x.type==='text').map(x=>x.text||'').join('\n');return(j.candidates||[]).flatMap(c=>c.content?.parts||[]).map(p=>p.text||'').join('\n')}
function normalizeJsonNumbers(s){let out='',quoted=false,escaped=false;for(let i=0;i<s.length;i++){const c=s[i];if(quoted){out+=c;if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c==='"')quoted=false;continue}if(c==='"'){quoted=true;out+=c;continue}if(c==='.'&&/[0-9]/.test(s[i+1]||'')&&(/[\[:,\[]/.test(s.slice(0,i).trimEnd().slice(-1))||(/[\[:,\[]/.test(s.slice(0,i).trimEnd().slice(-2,-1))&&s[i-1]==='-'))){out+='0'+c;continue}out+=c}return out}
function closeCompleteScoreJson(s){if(!s.endsWith('}'))return null;let stack=[],quoted=false,escaped=false;for(let i=0;i<s.length;i++){const c=s[i];if(quoted){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c==='"')quoted=false;continue}if(c==='"'){quoted=true;continue}if(c==='{'||c==='['){stack.push(c);continue}if(c==='}'||c===']'){const top=stack[stack.length-1];if((top==='{'&&c==='}')||(top==='['&&c===']')){stack.pop();continue}if(i===s.length-1&&c==='}'&&top==='['&&stack[0]==='{'&&stack.slice(1).every(x=>x==='[')){const candidate=s.slice(0,-1)+']'.repeat(stack.length-1)+'}';try{const obj=JSON.parse(normalizeJsonNumbers(candidate));if(Array.isArray(obj.v)&&obj.v.length>0&&obj.v.every(v=>Array.isArray(v)&&Array.isArray(v[3])&&v[3].length>0))return candidate}catch(_){} }return null}}return null}
function extractCompactScore(text){
 const lines=String(text||'').trim().split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 let head=null,current=null,tracks=[];
 for(const line of lines){
  if(line.startsWith('H|')){const h=JSON.parse(line.slice(2));if(!Array.isArray(h)||h.length<4)throw new Error('Ungültige H-Zeile.');head=h;continue}
  if(line.startsWith('V|')){const v=JSON.parse(line.slice(2));if(!Array.isArray(v)||v.length<3)throw new Error('Ungültige V-Zeile.');current={name:String(v[0]||('Track '+(tracks.length+1))),program:Number(v[1])||0,channel:Number.isFinite(Number(v[2]))?Number(v[2]):tracks.length,notes:[]};tracks.push(current);continue}
  if(line.startsWith('B|')){if(!current)throw new Error('B-Zeile ohne V-Zeile.');const p=line.indexOf('|',2),bar=Number(line.slice(2,p)),events=JSON.parse(line.slice(p+1));if(!Number.isInteger(bar)||bar<1||!Array.isArray(events))throw new Error('Ungültige B-Zeile.');current._bars=current._bars||[];current._bars.push([bar,events]);continue}
  throw new Error('Unbekannte Partiturzeile.');
 }
 if(!head||!tracks.length)throw new Error('Unvollständiges kompaktes Partiturformat.');
 const ts=[Number(head[2])||4,Number(head[3])||4],beats=ts[0]*(4/ts[1]);
 for(const tr of tracks){for(const [bar,events] of(tr._bars||[]))for(const e of events){if(!Array.isArray(e)||e.length<4)throw new Error('Ungültiges Notenereignis.');const pos=Number(e[0]),du=Number(e[1]),pi=Number(e[2]),ve=Number(e[3]);if(!Number.isFinite(pos)||pos<0||!Number.isFinite(du)||du<=0||!Number.isInteger(pi)||pi<0||pi>127||!Number.isInteger(ve)||ve<1||ve>127)throw new Error('Ungültiges Notenereignis.');tr.notes.push([(bar-1)*beats+pos,du,pi,ve])}delete tr._bars}
 return{title:String(head[0]||''),bpm:Number(head[1])||120,timeSignature:ts,tracks};
}
function extractMidiPerformanceScore(text){
 const lines=String(text||'').trim().split(/\r?\n/).map(x=>x.trim()).filter(Boolean);let head=null,current=null,tracks=[],tempoEvents=[];
 for(let i=0;i<lines.length;i++){const line=lines[i];
  if(/^(#|;|\/\/)/.test(line)||/^\`\`\`/.test(line))continue;
  if(line.startsWith('H|')){head=JSON.parse(line.slice(2));continue}
  if(line.startsWith('V|')){const v=JSON.parse(line.slice(2));current={name:String(v[0]||('Track '+(tracks.length+1))),program:Number(v[1])||0,channel:Number.isFinite(Number(v[2]))?Number(v[2]):tracks.length,notes:[],cc:[],pitchBend:[]};tracks.push(current);continue}
  if(line.startsWith('N|')){if(!current)throw new Error('N-Zeile ohne V-Zeile.');const p=line.split('|').slice(1).map(Number);if(p.length<4||p.some(x=>!Number.isFinite(x)))throw new Error('Ungültige N-Zeile in Zeile '+(i+1)+'.');current.notes.push([p[0]/960,p[1]/960,Math.round(p[2]),Math.round(p[3])]);continue}
  if(line.startsWith('C|')){if(!current)throw new Error('C-Zeile ohne V-Zeile.');const p=line.split('|').slice(1).map(Number);if(p.length<3||p.some(x=>!Number.isFinite(x)))throw new Error('Ungültige C-Zeile in Zeile '+(i+1)+'.');current.cc.push([p[0]/960,Math.round(p[1]),Math.round(p[2])]);continue}
  if(line.startsWith('T|')){const p=line.split('|').slice(1).map(Number);if(p.length<2||p.some(x=>!Number.isFinite(x)))throw new Error('Ungültige T-Zeile in Zeile '+(i+1)+'.');tempoEvents.push([p[0]/960,p[1]]);continue}
  if(line.startsWith('P|')){if(!current)throw new Error('P-Zeile ohne V-Zeile.');const p=line.split('|').slice(1).map(Number);if(p.length<2||p.some(x=>!Number.isFinite(x)))throw new Error('Ungültige P-Zeile in Zeile '+(i+1)+'.');current.pitchBend.push([p[0]/960,Math.max(-8192,Math.min(8191,Math.round(p[1])))]);continue}
  throw new Error('Unbekannte MIDI-Performance-Zeile '+(i+1)+': '+line.slice(0,120));
 }
 if(!Array.isArray(head)||head.length<4||!tracks.length)throw new Error('Unvollständiges MIDI-Performance-Format.');
 return{title:String(head[0]||''),bpm:Number(head[1])||120,timeSignature:[Number(head[2])||4,Number(head[3])||4],tracks,tempoEvents};
}
const SEMI={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
const KEYS={C:[],G:['F'],D:['F','C'],A:['F','C','G'],E:['F','C','G','D'],B:['F','C','G','D','A'],'F#':['F','C','G','D','A','E'],'C#':['F','C','G','D','A','E','B'],F:['B'],'Bb':['B','E'],'Eb':['B','E','A'],'Ab':['B','E','A','D'],'Db':['B','E','A','D','G'],'Gb':['B','E','A','D','G','C'],'Cb':['B','E','A','D','G','C','F']};
function frac(s,base){if(!s)return base;if(s==='/')return base/2;if(/^\/\d+$/.test(s))return base/Number(s.slice(1));if(/^\d+$/.test(s))return base*Number(s);const m=s.match(/^(\d*)\/(\d+)$/);return m?base*(Number(m[1]||1)/Number(m[2])):base}
function keyAcc(k){k=String(k||'C').trim().split(/\s+/)[0];const minor=/m$/.test(k);if(minor){const relative={Am:'C',Em:'G',Bm:'D','F#m':'A','C#m':'E','G#m':'B','D#m':'F#','A#m':'C#',Dm:'F',Gm:'Bb',Cm:'Eb',Fm:'Ab',Bbm:'Db',Ebm:'Gb',Abm:'Cb'};k=relative[k]||k.slice(0,-1)}const a=KEYS[k]||[];const flat=/b/.test(k)||['F','Bb','Eb','Ab','Db','Gb','Cb'].includes(k);return{set:new Set(a),flat}}
function pitch(tok,key,measureAcc){const m=tok.match(/^([\^_=]*)([A-Ga-g])([,']*)/);if(!m)return null;let[,acc,l,oct]=m,pc=SEMI[l.toUpperCase()],o=(l===l.toLowerCase()?5:4);for(const c of oct)o+=c==="'"?1:-1;let alter=0;if(acc){if(acc.includes('='))alter=0;else alter=(acc.match(/\^/g)||[]).length-(acc.match(/_/g)||[]).length;measureAcc[l.toUpperCase()]=alter}else if(Object.prototype.hasOwnProperty.call(measureAcc,l.toUpperCase()))alter=measureAcc[l.toUpperCase()];else if(key.set.has(l.toUpperCase()))alter=key.flat?-1:1;return 12*(o+1)+pc+alter}
function parseABC(text){text=String(text||'').replace(/\r/g,'');const tuneStarts=[];for(const m of text.matchAll(/^X:\s*[^\n]+/gm))tuneStarts.push(m.index);if(tuneStarts.length>1)text=text.slice(tuneStarts[0],tuneStarts[1]).trim();const lines=text.split('\n');let title='ABC Import',meter=[4,4],unit=1/8,bpm=120,keyName='C',curV='V1';const voices=new Map();const voiceNames=new Map();let body=[];for(let raw of lines){let line=raw.replace(/%.*/,'').trim();if(!line)continue;let m;if((m=line.match(/^T:\s*(.*)/)))title=m[1].trim()||title;else if((m=line.match(/^M:\s*(\d+)\/(\d+)/)))meter=[+m[1],+m[2]];else if((m=line.match(/^L:\s*(\d+)\/(\d+)/)))unit=+m[1]/+m[2];else if((m=line.match(/^Q:.*?=(\d+(?:\.\d+)?)/)))bpm=+m[1];else if((m=line.match(/^K:\s*([^\s]+)/)))keyName=m[1];else if((m=line.match(/^V:\s*([^\s]+)(.*)/))){curV=m[1];const nm=m[2].match(/(?:name|nm)="([^"]+)"/);if(nm)voiceNames.set(curV,nm[1]);if(!voices.has(curV))voices.set(curV,[]);/* V: declarations contain voice metadata, not music events. */}else if(/^[A-Za-z]:/.test(line)||/^%%/.test(line)){}else {const inline=line.match(/^\[V:([^\]]+)\]/);if(inline){curV=inline[1];if(!voices.has(curV))voices.set(curV,[])}body.push([curV,line])}}
if(!voices.size)voices.set('V1',[]);
const key=keyAcc(keyName),bar=(meter[0]*4/meter[1]);const pos=new Map([...voices.keys()].map(v=>[v,0]));const accs=new Map([...voices.keys()].map(v=>[v,{}]));const dynamics=new Map([...voices.keys()].map(v=>[v,78]));
let activeV=null;for(const [defaultV,line0] of body){let v=defaultV||curV;activeV=v;if(!voices.has(v)){voices.set(v,[]);pos.set(v,0);accs.set(v,{})}let i=0,line=line0;while(i<line.length){const decoration=line.slice(i).match(/^([!+])([^!+]*?)\1/);if(decoration){const level={ppp:28,pp:38,p:50,mp:62,mf:78,f:94,ff:110,fff:122}[decoration[2].toLowerCase()];if(level!==undefined)dynamics.set(v,level);i+=decoration[0].length;continue}if(/\s/.test(line[i])){i++;continue}const iv=line.slice(i).match(/^\[V:([^\]]+)\]/);if(iv){v=iv[1];activeV=v;if(!voices.has(v)){voices.set(v,[]);pos.set(v,0);accs.set(v,{})}i+=iv[0].length;continue}if(line[i]==='|'){accs.set(v,{});i++;while(i<line.length&&/[:|\[\]]/.test(line[i]))i++;continue}const rest=line.slice(i).match(/^z(\d*\/\d+|\/\d+|\/|\d+)?/);if(rest){pos.set(v,pos.get(v)+frac(rest[1],unit*4));i+=rest[0].length;continue}if(line[i]==='['&&!/^\[V:/.test(line.slice(i))){const end=line.indexOf(']',i);if(end>i){const inside=line.slice(i+1,end),lm=line.slice(end+1).match(/^(\d*\/\d+|\/\d+|\/|\d+)?/),d=frac(lm?.[1],unit*4),tokens=inside.match(/[\^_=]*[A-Ga-g][,']*/g)||[];for(const t of tokens){const p=pitch(t,key,accs.get(v));if(p!=null)voices.get(v).push([pos.get(v),d,p,dynamics.get(v)??78])}pos.set(v,pos.get(v)+d);i=end+1+(lm?.[0]?.length||0);continue}}
const n=line.slice(i).match(/^([\^_=]*[A-Ga-g][,']*)(\d*\/\d+|\/\d+|\/|\d+)?/);if(n){const d=frac(n[2],unit*4),p=pitch(n[1],key,accs.get(v));if(p!=null)voices.get(v).push([pos.get(v),d,p,80]);pos.set(v,pos.get(v)+d);i+=n[0].length;continue}i++}}
const tracks=[...voices.entries()].map(([id,notes],i)=>({name:voiceNames.get(id)||id,program:/violin|violine|vln/i.test(voiceNames.get(id)||id)?40:0,channel:i%16,notes})).filter(t=>t.notes.length);if(!tracks.length)throw new Error('Keine unterstützten ABC-Noten gefunden.');return{title,bpm,timeSignature:meter,tracks,abcSource:text,importedFrom:'ABC',barCount:Math.max(1,Math.ceil(Math.max(...tracks.flatMap(t=>t.notes.map(n=>n[0]+n[1])))/bar))}}

function abcVelocityMap(raw){
 const marks={ppp:28,pp:38,p:50,mp:62,mf:78,f:94,ff:110,fff:122,sfz:118,ffz:122,fp:92};
 let velocity=78,pendingAccent=false,hairpin=null;
 const events=[];
 const tokenRe=/!([^!]+)!|\+([^+]+)\+|\[V:[^\]]+\]|(?:\^\^|__|\^|_|=)?[A-Ga-g][,']*\d*(?:\/\d*|\/)?|[<>]/g;
 const begin=dir=>{hairpin={dir,startIndex:events.length,startVelocity:velocity}};
 const finish=()=>{if(!hairpin)return;const count=events.length-hairpin.startIndex;if(count>0){const delta=hairpin.dir*(count<=2?8:count<=4?12:count<=8?18:24),target=Math.max(28,Math.min(122,hairpin.startVelocity+delta));for(let i=0;i<count;i++){const q=(i+1)/count;events[hairpin.startIndex+i]=Math.round(hairpin.startVelocity+(target-hairpin.startVelocity)*q)}velocity=target}hairpin=null};
 let m;while((m=tokenRe.exec(String(raw||'')))){
  const deco=String(m[1]||m[2]||'').toLowerCase().trim().replace(/[()]/g,'');
  if(deco){
   if(/[)]$/.test(String(m[1]||m[2]||'').trim())&&/^(crescendo|cresc\.?|diminuendo|dim\.?|decresc\.?)$/.test(deco)){finish();continue}
   if(Object.prototype.hasOwnProperty.call(marks,deco)){finish();velocity=marks[deco];continue}
   if(/^(crescendo|cresc\.?|<)$/.test(deco)){finish();begin(1);continue}
   if(/^(diminuendo|dim\.?|decresc\.?|>)$/.test(deco)){finish();begin(-1);continue}
   if(/^(accent|sf|sff|sforzando|marcato)$/.test(deco)){pendingAccent=true;continue}
   if(/^(endcrescendo|enddiminuendo|enddim|enddecrescendo)$/.test(deco)){finish();continue}
  }
  if(m[0]==='<'){finish();begin(1);continue} if(m[0]==='>'){finish();begin(-1);continue}
  if(/[A-Ga-g]/.test(m[0])){let v=velocity;if(pendingAccent){v=Math.min(127,v+20);pendingAccent=false}events.push(v)}
 }
 finish();return events;
}
function applyAbcVelocities(raw,score){
 if(!/!(?:ppp|pp|p|mp|mf|f|ff|fff|sfz|ffz|fp|crescendo|diminuendo|cresc\.?|dim\.?|decresc\.?)!|\+(?:ppp|pp|p|mp|mf|f|ff|fff|sfz|ffz|fp|crescendo|diminuendo)\+/i.test(String(raw||'')))return score;const velocities=abcVelocityMap(raw);if(!velocities.length)return score;
 const notes=[];for(const tr of(score?.tracks||[]))for(const n of(tr.notes||[]))notes.push(n);
 notes.sort((a,b)=>(Number(a?.[0])||0)-(Number(b?.[0])||0));
 for(let i=0;i<notes.length&&i<velocities.length;i++)if(Array.isArray(notes[i])&&notes[i].length>=4)notes[i][3]=velocities[i];
 return score;
}
function parseCompositionRepresentation(text,representation){
 let raw=String(text||'').trim(),r=representationOf({representation});
 if(r==='free'){const m=raw.match(/^FORMAT\|(COMPACT|ABC|MIDI)\s*\n?/i);if(!m)throw new Error('Freie Wahl ohne FORMAT-Kennung.');r=m[1].toLowerCase();raw=raw.slice(m[0].length).trim()}
 if(r==='compact'){if(/^\s*H\|/.test(raw))return{score:extractCompactScore(raw),format:'compact',raw};const obj=extractJson(raw);return{score:findScore(obj),format:'compact-json',raw,obj}}
 if(r==='midi')return{score:extractMidiPerformanceScore(raw),format:'midi',raw};
 if(r==='abc'){return{score:parseABC(raw),format:'abc',raw}}
 throw new Error('Unbekannte Musikrepräsentation.');
}
function extractJson(text){let s=String(text||'').trim().replace(/^\`\`\`(?:json)?\s*/i,'').replace(/\s*\`\`\`$/,'').trim();const parse=x=>JSON.parse(normalizeJsonNumbers(x));try{return parse(s)}catch(_){const closed=closeCompleteScoreJson(s);if(closed)return parse(closed);const a=s.indexOf('{'),b=s.lastIndexOf('}');if(a>=0&&b>a)return parse(s.slice(a,b+1));throw _}}
function findScore(o){
 if(o&&Array.isArray(o.v)&&Number.isFinite(Number(o.b))){const ts=Array.isArray(o.m)?o.m:[4,4],beats=(Number(ts[0])||4)*(4/(Number(ts[1])||4));return{title:String(o.t||''),bpm:Number(o.b),timeSignature:ts,tracks:o.v.map((v,i)=>({name:String(v?.[0]||('Track '+(i+1))),program:Number(v?.[1])||0,channel:Number.isFinite(Number(v?.[2]))?Number(v[2]):i,notes:(Array.isArray(v?.[3])?v[3]:[]).map(e=>{if(!Array.isArray(e)||e.length<5)throw new Error('Ungültiges kompaktes Notenereignis.');const bar=Number(e[0]),pos=Number(e[1]),du=Number(e[2]),pi=Number(e[3]),ve=Number(e[4]);if(!Number.isInteger(bar)||bar<1||!Number.isFinite(pos)||pos<0||!Number.isFinite(du)||du<=0||!Number.isInteger(pi)||pi<0||pi>127||!Number.isInteger(ve)||ve<1||ve>127)throw new Error('Ungültiges kompaktes Notenereignis.');return[(bar-1)*beats+pos,du,pi,ve,typeof e[5]==='string'?e[5]:undefined]})}))}}
 const s=o&&o.score&&Array.isArray(o.score.tracks)?o.score:o;if(!s||!Array.isArray(s.tracks)||!Number.isFinite(Number(s.bpm)))throw new Error('Kein gültiges Partitur-Objekt gefunden.');return s
}
function findIdea(o){if(!o||typeof o!=='object')return'';for(const k of['idea','kompositionsidee','description','beschreibung','concept'])if(typeof o[k]==='string'&&o[k].trim())return o[k].trim();return''}
async function sha256Text(text){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
async function sha256Buffer(buf){const b=await crypto.subtle.digest('SHA-256',buf);return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function vlq(n){n=Math.max(0,Math.round(n));let b=[n&127];while((n>>=7))b.unshift((n&127)|128);return b}const strBytes=s=>[...new TextEncoder().encode(s)],u32=n=>[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255],u16=n=>[(n>>>8)&255,n&255],chunk=(t,d)=>[...strBytes(t),...u32(d.length),...d];
function buildMidi(score){const ppq=960,bpm=Math.max(20,Math.min(400,Number(score.bpm)||120)),ts=Array.isArray(score.timeSignature)?score.timeSignature:[4,4],tracks=[],meta=[];const mpqn=Math.round(60000000/bpm);meta.push({tick:0,bytes:[255,81,3,(mpqn>>16)&255,(mpqn>>8)&255,mpqn&255]},{tick:0,bytes:[255,88,4,Number(ts[0])||4,Math.max(0,Math.round(Math.log2(Number(ts[1])||4))),24,8]});let last=0,md=[];for(const e of meta){md.push(...vlq(e.tick-last),...e.bytes);last=e.tick}md.push(0,255,47,0);tracks.push(chunk('MTrk',md));(score.tracks||[]).forEach((tr,ti)=>{const ch=Math.max(0,Math.min(15,Number.isFinite(Number(tr.channel))?Number(tr.channel):ti%16)),prog=Math.max(0,Math.min(127,Number(tr.program)||0)),ev=[];const name=strBytes(String(tr.name||`Track ${ti+1}`));ev.push({tick:0,p:0,b:[255,3,...vlq(name.length),...name]},{tick:0,p:1,b:[192|ch,prog]});for(const n of(tr.notes||[])){if(!Array.isArray(n)||n.length<4)continue;const st=Math.max(0,Number(n[0])||0),du=Math.max(.01,Number(n[1])||.25),pitch=Math.max(0,Math.min(127,Math.round(Number(n[2])||60))),vel=Math.max(1,Math.min(127,Math.round(Number(n[3])||80)));ev.push({tick:Math.round(st*ppq),p:2,b:[144|ch,pitch,vel]},{tick:Math.round((st+du)*ppq),p:1,b:[128|ch,pitch,0]})}for(const c of(tr.cc||[])){if(!Array.isArray(c)||c.length<3)continue;const st=Math.max(0,Number(c[0])||0),cc=Math.max(0,Math.min(127,Math.round(Number(c[1])||0))),value=Math.max(0,Math.min(127,Math.round(Number(c[2])||0)));ev.push({tick:Math.round(st*ppq),p:0,b:[176|ch,cc,value]})}ev.sort((a,b)=>a.tick-b.tick||a.p-b.p);let prev=0,d=[];for(const e of ev){d.push(...vlq(e.tick-prev),...e.b);prev=e.tick}d.push(0,255,47,0);tracks.push(chunk('MTrk',d))});return new Uint8Array([...chunk('MThd',[...u16(1),...u16(tracks.length),...u16(ppq)]),...tracks.flat()])}

function draftField(draft,label){const lines=String(draft||'').split(/\r?\n/);const prefix=String(label||'').toLowerCase()+':';for(const line of lines){const t=line.trim();if(t.toLowerCase().startsWith(prefix))return t.slice(prefix.length).trim()}return''}
function scoreBarCount(score){const ts=Array.isArray(score?.timeSignature)?score.timeSignature:[4,4],beats=(Number(ts[0])||4)*(4/(Number(ts[1])||4));let end=0;for(const tr of(score?.tracks||[]))for(const n of(tr.notes||[]))if(Array.isArray(n))end=Math.max(end,(Number(n[0])||0)+(Number(n[1])||0));return Math.max(1,Math.ceil(end/Math.max(.25,beats)))}
function providerName(p){return p==='anthropic'?'Anthropic / Claude':p==='google'?'Google / Gemini':p==='openai'?'OpenAI':String(p||'')}
function localDescription(draft){const lines=String(draft||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);const prose=lines.find(s=>!/^([#*\-]|Titel\s*:|Tonart\s*:|Tempo\s*:|Taktart\s*:|Form\s*:)/i.test(s)&&s.length>35);return String(prose||'').replace(/[*#]/g,'').slice(0,500).trim()}
function compositionProfile(snapshot,score,draft,description){const bpm=Number(score?.bpm)||null,key=String(score?.key||score?.keySignature||score?.tonality||draftField(draft,'Tonart')||'').trim(),tempo=String(score?.tempo||score?.tempoMarking||draftField(draft,'Tempo')||'').trim(),bars=scoreBarCount(score),provider=providerName(snapshot?.provider),model=String(snapshot?.model||'').trim();const fields=[bpm?bpm+' BPM':'',tempo,key,bars+' Takte',[provider,model].filter(Boolean).join(' · ')].filter(Boolean);return{bpm,tempo,key,barCount:bars,provider,model,description:String(description||'').trim(),text:fields.join(' · ')+'\n\n'+String(description||'').trim()}}
async function compose({snapshot,key,repeatOf=null,seriesId=null,runId,now,requestModel,usedTitles=[]}){
 const startedAt=now(),run={id:runId,testId:runId,schema:'composition-engine-2.7-diagnosis-v1',app:{name:'Composition Engine Client',version:ENGINE_VERSION},seriesId,startedAt,repeatOf,contextMode:'single-creative-source',input:{visibleTask:snapshot.visibleTask,provider:snapshot.provider,model:snapshot.model,representation:representationOf(snapshot)},compositionContract:REPRESENTATION_CONTRACTS[representationOf(snapshot)],events:[],aiCalls:[],requestSnapshot:structuredClone(snapshot)};
 const ev=(phase,data={})=>run.events.push({at:now(),phase,...data});
 ev('run_started',{note:'Ein einziger kreativer KI-Schritt erzeugt die vollständige symbolische Partitur. Danach keine KI-Übersetzung.'});
 const call=async(prompt,stage)=>requestModel({snapshot,key,promptText:prompt,stage,run,event:ev});
 const previousTitles=usedTitles.map(t=>String(t||'').trim()).filter(Boolean);const titleConstraint=previousTitles.length?'\n\nVERGEBENE WERKTITEL (keinen davon erneut verwenden):\n'+previousTitles.slice(-80).join('\n'):'';let rawComposition=String(await call(createPrompts(snapshot).composition+titleConstraint,'composition')||'').trim();
 if(!rawComposition)throw new Error('Die Komposition ist leer.');
 let score,obj=null,parsedFormat='';try{const parsed=parseCompositionRepresentation(rawComposition,representationOf(snapshot));score=parsed.score;obj=parsed.obj||null;parsedFormat=parsed.format}catch(e){
   run.composition=rawComposition;run.rawCompositionOnError=rawComposition;ev('composition_format_invalid',{message:e?.message||String(e),characters:rawComposition.length,rawComposition});
   throw new Error('Die komponierende KI hat keine vollständig lesbare Partitur geliefert: '+(e?.message||String(e)));
 }
 run.composition=rawComposition;run.parsedModelJson=obj;run.score=score;run.representation={requested:representationOf(snapshot),parsed:parsedFormat};ev('composition_parsed',{changed:false,representation:parsedFormat,note:'Die kreative Ausgabe selbst ist die Partitur; keine zweite KI und keine musikalische Übersetzung.'});
 const title=String(score?.title||'').trim(),allTitles=usedTitles.filter(Boolean);if(title&&allTitles.some(t=>String(t).toLocaleLowerCase('de-DE')===title.toLocaleLowerCase('de-DE'))){let nt=(await call(duplicateTitlePrompt(title,allTitles,rawComposition),'title_renaming')).trim().replace(/^Titel:\\s*/i,'').replace(/^['“”"]|['“”"]$/g,'').trim();if(!nt||allTitles.some(t=>String(t).toLocaleLowerCase('de-DE')===nt.toLocaleLowerCase('de-DE'))){let n=2;while(allTitles.some(t=>String(t).toLocaleLowerCase('de-DE')===(title+' ('+n+')').toLocaleLowerCase('de-DE')))n++;nt=title+' ('+n+')'}score.title=nt;ev('duplicate_title_replaced',{oldTitle:title,newTitle:nt})}
 const midiBytes=buildMidi(score),buf=midiBytes.buffer.slice(midiBytes.byteOffset,midiBytes.byteOffset+midiBytes.byteLength),midiHash=await sha256Buffer(buf);run.midi={bytes:midiBytes.byteLength,sha256:midiHash,note:'Deterministisch lokal direkt aus der kreativen Quellpartitur erzeugt; kein KI-Übersetzungsschritt.'};ev('midi_generated',{bytes:midiBytes.byteLength,sha256:midiHash});
 const analysisSource=(parsedFormat==='abc'||parsedFormat==='midi'||parsedFormat==='compact')?rawComposition:JSON.stringify(scoreToCompact(score));
 let idea='';try{idea=String(await call(createPrompts(snapshot,analysisSource).compositionIdea,'composition_analysis_afterwards')||'').trim()}catch(e){ev('composition_analysis_failed',{message:e?.message||String(e)})}run.idea=idea;run.profile=compositionProfile(snapshot,score,'',idea);ev('composition_profile_created',{bpm:run.profile.bpm,tempo:run.profile.tempo,key:run.profile.key,barCount:run.profile.barCount,provider:run.profile.provider,model:run.profile.model});run.completedAt=now();run.status='ok';
 return{run,midiBytes};
}

window.CompositionEngine=Object.freeze({name:ENGINE_NAME,version:ENGINE_VERSION,representations:REPRESENTATION_CONTRACTS,compose,analyzeScore,analyzeImprovement,improveScore,COMPOSITION_CONTRACT,TECHNICAL_CONTRACT,createPrompts,criticalAnalysisPrompt,postImprovementAnalysisPrompt,approvedImprovementPrompt,scoreToCompact,mergeTitleRegistry,duplicateTitlePrompt,makeRequest,actualRequest,extractText,extractJson,findScore,findIdea,sha256Text,sha256Buffer,buildMidi,parseABC,extractCompactScore,extractMidiPerformanceScore,abcVelocityMap,applyAbcVelocities,parseCompositionRepresentation});
})();
