// Portable interpreter; the musical and workflow rules live only in spec.json.
function createWorkflowCore(spec) {
    function evaluate(x, data) {
        if (!Array.isArray(x)) return x;
        var op=x[0], a=x[1], b=x[2];
        if(op==='get') return data[a];
        if(op==='literal') return a;
        if(op==='eq') return evaluate(a,data)===evaluate(b,data);
        if(op==='nonempty') return typeof evaluate(a,data)==='string' && evaluate(a,data).trim().length>0;
        if(op==='in') return evaluate(b,data).indexOf(evaluate(a,data))>=0;
        if(op==='or') return evaluate(a,data)||evaluate(b,data);
        throw Error('Unbekannte Kernoperation: '+op);
    }
    function check(name,data) {
        if(!spec.rules[name]) throw Error('Unbekannte Kernprüfung: '+name);
        spec.rules[name].forEach(function(r){if(!evaluate(r.test,data))throw Error(r.error);});
        return true;
    }
    function advance(state,event) {
        var next=spec.transitions[state] && spec.transitions[state][event];
        if(!next)throw Error('Unzulässiger Zustandswechsel: '+state+' / '+event);
        return next;
    }
    function readable(value) {
        return String(value||'').replace(/\\(?:text|textrm|mathrm|mathbf|mathit|operatorname)\s*\{([^{}]*)\}/g,'$1')
          .replace(/\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g,'$1/$2')
          .replace(/\\([A-Za-z]+)\b/g,function(all,s){return spec.symbols[s]||all;})
          .replace(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]|\$\$([\s\S]*?)\$\$|\$([^\n$]+?)\$/g,function(all,a,b,c,d){return a||b||c||d||'';});
    }
    return {version:spec.version,format:spec.format,check:check,advance:advance,readable:readable,
        prompt:function(mode){return spec.prompts.common+'\n'+(spec.prompts[mode]||'');},capabilities:spec.capabilities};
}
if(typeof module!=='undefined')module.exports=createWorkflowCore;
