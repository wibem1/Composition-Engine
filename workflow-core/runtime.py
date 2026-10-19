"""Portable interpreter for the shared declarative workflow core."""
import re

def create_workflow_core(spec):
    def evaluate(x,data):
        if not isinstance(x,list): return x
        op,*args=x
        if op=='get': return data.get(args[0])
        if op=='literal': return args[0]
        a=evaluate(args[0],data)
        if op=='nonempty': return isinstance(a,str) and bool(a.strip())
        b=evaluate(args[1],data)
        if op=='eq': return type(a) is type(b) and a==b
        if op=='in': return a in b
        if op=='or': return a or b
        raise ValueError('Unbekannte Kernoperation: '+op)
    class Core:
        version=spec['version']
        format=spec['format']
        capabilities=spec['capabilities']
        def check(self,name,data):
            for rule in spec['rules'][name]:
                if not evaluate(rule['test'],data): raise ValueError(rule['error'])
            return True
        def advance(self,state,event):
            try: return spec['transitions'][state][event]
            except KeyError: raise ValueError('Unzulässiger Zustandswechsel: '+state+' / '+event) from None
        def prompt(self,mode): return spec['prompts']['common']+'\n'+spec['prompts'].get(mode,'')
        def readable(self,value):
            s=re.sub(r'\\(?:text|textrm|mathrm|mathbf|mathit|operatorname)\s*\{([^{}]*)\}',r'\1',str(value or ''))
            s=re.sub(r'\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}',r'\1/\2',s)
            s=re.sub(r'\\([A-Za-z]+)\b',lambda m:spec['symbols'].get(m[1],m[0]),s)
            return re.sub(r'\\\((.*?)\\\)|\\\[(.*?)\\\]|\$\$(.*?)\$\$|\$([^\n$]+?)\$',lambda m:next((g for g in m.groups() if g is not None),''),s,flags=re.S)
    return Core()
