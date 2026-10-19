"""Embed one workflow specification in the existing single-file updaters."""
import json,re,argparse
from pathlib import Path
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--reaper',type=Path,default=ROOT/'Reaper')
parser.add_argument('--musescore',type=Path,default=ROOT/'MuseScore')
parser.add_argument('--maestro',type=Path,default=ROOT/'Maestro/engine')
args=parser.parse_args()
spec=json.loads((HERE/'spec.json').read_text())
def lua(v):
    if isinstance(v,dict): return '{'+','.join('['+lua(k)+']='+lua(x) for k,x in v.items())+'}'
    if isinstance(v,list): return '{'+','.join(lua(x) for x in v)+'}'
    return json.dumps(v,ensure_ascii=False) if not isinstance(v,bool) else str(v).lower()
def block(path,start,end,content,anchor):
    text=path.read_text()
    output=start+'\n'+content+'\n'+end+'\n'
    if start in text:
        a=text.index(start); b=text.index(end,a)+len(end)
        text=text[:a]+output.rstrip('\n')+text[b:]
    else:
        assert text.count(anchor)==1,(path,anchor)
        text=text.replace(anchor,output+'\n'+anchor)
    path.write_text(text)
js=(HERE/'runtime.js').read_text().split("if(typeof module")[0]
block(args.musescore/'AI-Notation-Studio-App.qml','    // BEGIN SHARED WORKFLOW CORE','    // END SHARED WORKFLOW CORE',
      '    function createSharedWorkflowCore() {\n'+'\n'.join('        '+line for line in js.splitlines())+'\nreturn createWorkflowCore('+json.dumps(spec,ensure_ascii=False)+');\n    }','    function currentVersionString()')
block(args.reaper/'Composition Studio.lua','-- BEGIN SHARED WORKFLOW CORE','-- END SHARED WORKFLOW CORE',
      (HERE/'runtime.lua').read_text()+'\nlocal workflow_core=create_workflow_core('+lua(spec)+')','local SCRIPT_NAME="Composition Studio"\n')
(HERE/'workflow_core.py').write_text((HERE/'runtime.py').read_text()+'\ncore=create_workflow_core('+repr(spec)+')\n')
(HERE/'workflow-core.js').write_text(js+'\nvar WorkflowCore=createWorkflowCore('+json.dumps(spec,ensure_ascii=False)+');\nif(typeof module!=="undefined")module.exports=WorkflowCore;\n')

if args.maestro.is_dir():
    (args.maestro/'workflow_core.py').write_text((HERE/'workflow_core.py').read_text())
