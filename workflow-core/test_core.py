"""Identical behavioral fixtures in Python, Lua 5.4 and Qt JavaScript."""
import importlib.util,json,sys
from pathlib import Path
from lupa.lua54 import LuaRuntime
from PySide6.QtCore import QCoreApplication
from PySide6.QtQml import QJSEngine
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[1]
sys.path.insert(0,str(HERE));from workflow_core import core
app=QCoreApplication([]);js=QJSEngine()
q=(ROOT/'MuseScore/AI-Notation-Studio-App.qml').read_text();a=q.index('    function createSharedWorkflowCore()');b=q.index('    // END SHARED WORKFLOW CORE',a)
v=js.evaluate(q[a:b]+';var core=createSharedWorkflowCore();')
assert not v.isError(),v.toString()
lua=LuaRuntime(unpack_returned_tuples=True);s=(ROOT/'Reaper/Composition Studio.lua').read_text();a=s.index('-- BEGIN SHARED WORKFLOW CORE');b=s.index('-- END SHARED WORKFLOW CORE',a)
lc=lua.execute(s[a:b]+'\nreturn workflow_core')
def lt(d):return lua.table_from({k:lt(v) if isinstance(v,dict) else v for k,v in d.items()})
cases=[]
for mode in ['compose','analysis','continue','instruments','revise','garbage']:
 for tail in [0,2,3,4,1,-1]:
  cases.append(('request',dict(mode=mode,task='Variation',transition_bars=tail)))
cases+=[('request',dict(mode='compose',task=' ',transition_bars=0))]
for state in ['ready','applied','draft','invalid']:
 for original,current in [('a','a'),('a','b'),('','')]:cases.append(('apply',dict(state=state,source_guard=original,current_guard=current)))
for name,data in cases:
 try:core.check(name,data);expected=True
 except ValueError:expected=False
 try:lc.check(name,lt(data));actual=True
 except Exception:actual=False
 assert actual==expected,(name,data,'Lua')
 v=js.evaluate('(function(){try{core.check('+json.dumps(name)+','+json.dumps(data)+');return true;}catch(e){return false;}})()')
 assert not v.isError() and v.toBool()==expected,(name,data,'JS')
for state in ['draft','ready','invalid','applied']:
 for event in ['propose','apply','fail']:
  try:expected=core.advance(state,event)
  except ValueError:expected='ERROR'
  try:actual=lc.advance(state,event)
  except Exception:actual='ERROR'
  assert actual==expected
  v=js.evaluate('(function(){try{return core.advance('+json.dumps(state)+','+json.dumps(event)+');}catch(e){return "ERROR";}})()')
  assert v.toString()==expected
samples=[r'E5/F3 $\rightarrow$ D5/F3',r'\text{dolce} $\sharp$',r'$\frac{3}{4}$',r'\(C4 \rightarrow D4\)',r'\[A\flat\]']
for text in samples:
 expected=core.readable(text)
 assert lc.readable(text)==expected,(text,lc.readable(text),expected)
 assert js.evaluate('core.readable('+json.dumps(text)+')').toString()==expected
print(f'PASS shared core: {len(cases)} validation fixtures, 12 transitions, 5 text fixtures × 3 runtimes')
