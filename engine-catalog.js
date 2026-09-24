(()=>{'use strict';
const BASE='https://wibem1.github.io/Composition-Engine/';
const reference=window.CompositionEngine;
window.CompositionEngineCatalog={standard:reference,'reference-1.3.0':reference};
function loadScript(url){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=url+(url.includes('?')?'&':'?')+'t='+Date.now();s.onload=resolve;s.onerror=()=>reject(new Error('Engine konnte nicht geladen werden: '+url));document.head.appendChild(s)})}
async function init(){
 const r=await fetch(BASE+'engine-manifest.json?ts='+Date.now(),{cache:'no-store'});if(!r.ok)throw new Error('Engine-Liste konnte nicht geladen werden.');
 const manifest=await r.json();window.CompositionEngineManifest=manifest;const reg=window.CompositionEngineCatalog;
 for(const item of manifest.engines||[]){
   if(item.id==='reference-1.3.0'){reg[item.id]=reference;continue}
   if(item.archived||item.id==='experimental-current')continue;
   await loadScript(BASE+item.url);reg[item.id]=window.CompositionEngine;window.CompositionEngine=reference;
 }
 const options=(manifest.engines||[]).filter(x=>!x.archived&&x.id!=='experimental-current');
 for(const id of ['engineSelect','compositionEngineSelect']){
   const sel=document.getElementById(id);if(!sel)continue;const previous=sel.value;
   sel.innerHTML='';for(const item of options){const o=document.createElement('option');o.value=item.id;o.textContent=item.label;sel.appendChild(o)}
   const fallback=(manifest.default&&reg[manifest.default])?manifest.default:(options[0]?.id||'reference-1.3.0');
   sel.value=reg[previous]?previous:(previous==='standard'?'reference-1.3.0':fallback);
   sel.dispatchEvent(new Event('change',{bubbles:true}));
 }
 window.dispatchEvent(new CustomEvent('composition-engine-catalog-ready',{detail:manifest}));return manifest
}
window.CompositionEngineCatalogReady=init().catch(e=>{console.error(e);return null});
})();