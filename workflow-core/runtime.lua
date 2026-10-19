-- Portable interpreter; rules and musical policy are embedded from spec.json.
local function create_workflow_core(spec)
 local evaluate
 evaluate=function(x,d)
  if type(x)~="table" then return x end
  local op,a,b=x[1],x[2],x[3]
  if op=="get" then return d[a] elseif op=="literal" then return a
  elseif op=="eq" then return evaluate(a,d)==evaluate(b,d)
  elseif op=="nonempty" then local v=evaluate(a,d); return type(v)=="string" and v:match("%S")~=nil
  elseif op=="in" then for _,v in ipairs(evaluate(b,d)) do if v==evaluate(a,d) then return true end end; return false
  elseif op=="or" then return evaluate(a,d) or evaluate(b,d) end
  error("Unbekannte Kernoperation: "..tostring(op))
 end
 local core={version=spec.version,format=spec.format,capabilities=spec.capabilities}
 function core.check(name,d)
  assert(spec.rules[name],"Unbekannte Kernpruefung")
  for _,r in ipairs(spec.rules[name]) do assert(evaluate(r.test,d),r.error) end
  return true
 end
 function core.advance(state,event)
  local next=spec.transitions[state] and spec.transitions[state][event]
  assert(next,"Unzulaessiger Zustandswechsel: "..tostring(state).." / "..tostring(event)); return next
 end
 function core.prompt(mode) return spec.prompts.common.."\n"..(spec.prompts[mode] or "") end
 function core.readable(v)
  local s=tostring(v or "")
  s=tostring(v or ""):gsub("\\([%a]+)%s*(%b{})",function(cmd,g) if cmd=="text" or cmd=="mathrm" or cmd=="mathbf" or cmd=="textrm" or cmd=="mathit" or cmd=="operatorname" then return g:sub(2,-2) end; return "\\"..cmd..g end)
  s=s:gsub("\\frac%s*(%b{})%s*(%b{})",function(a,b)return a:sub(2,-2).."/"..b:sub(2,-2)end)
  s=s:gsub("\\([%a]+)",function(cmd) return spec.symbols[cmd] or "\\"..cmd end)
  s=s:gsub("\\%((.-)\\%)","%1"):gsub("\\%[(.-)\\%]","%1"):gsub("%$%$(.-)%$%$","%1"):gsub("%$([^\n$]-)%$","%1")
  return s
 end
 return core
end
