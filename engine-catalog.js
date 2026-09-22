(()=>{'use strict';
const BASE='https://wibem1.github.io/Composition-Engine/';
const standard=window.CompositionEngine;
window.CompositionEngineCatalog={standard,'standard-1.1.2':standard};
function loadScript(url){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=url+(url.includes('?')?'&':'?')+'t='+Date.now();s.onload=resolve;s.onerror=()=>reject(new Error('Engine konnte nicht geladen werden: '+url));document.head.appendChild(s)})}
async function init(){
 const r=await fetch(BASE+'engine-manifest.json?ts='+Date.now(),{cache:'no-store'});if(!r.ok)throw new Error('Engine-Liste konnte nicht geladen werden.');
 const manifest=await r.json();window.CompositionEngineManifest=manifest;const reg=window.CompositionEngineCatalog;
 for(const item of manifest.engines||[]){
   if(item.id==='standard-1.1.2'){reg[item.id]=standard;continue}
   if(item.archived||item.id==='experimental-current')continue;
   await loadScript(BASE+item.url);reg[item.id]=window.CompositionEngine;window.CompositionEngine=standard;
 }
 const options=(manifest.engines||[]).filter(x=>!x.archived&&x.id!=='experimental-current');
 for(const id of ['engineSelect','compositionEngineSelect']){
   const sel=document.getElementById(id);if(!sel)continue;const previous=sel.value;
   sel.innerHTML='';for(const item of options){const o=document.createElement('option');o.value=item.id;o.textContent=item.label;sel.appendChild(o)}
   const fallback=(manifest.default&&reg[manifest.default])?manifest.default:(options[0]?.id||'standard-1.1.2');sel.value=reg[previous]?previous:(previous==='standard'?'standard-1.1.2':fallback);
   sel.dispatchEvent(new Event('change',{bubbles:true}));
 }
 window.dispatchEvent(new CustomEvent('composition-engine-catalog-ready',{detail:manifest}));return manifest
}
window.CompositionEngineCatalogReady=init().catch(e=>{console.error(e);return null});
})();