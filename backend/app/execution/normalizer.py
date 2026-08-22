import inspect
from typing import Any, Dict, Tuple

SKIP = object()

def serialize_state(local_vars: Dict[str, Any]) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    memory = {}
    
    def normalize(val: Any) -> Any:
        if isinstance(val, (int, float, str, bool, type(None))):
            return val
            
        if callable(val) or inspect.ismodule(val) or inspect.isclass(val) or inspect.isroutine(val):
            return SKIP
            
        val_id = str(id(val))
        
        if val_id in memory:
            return {"__ref__": val_id}
            
        if isinstance(val, list):
            memory[val_id] = {"__type__": "list", "values": []}
            memory[val_id]["values"] = [x for x in (normalize(v) for v in val[:100]) if x is not SKIP]
            return {"__ref__": val_id}
            
        elif isinstance(val, tuple):
            memory[val_id] = {"__type__": "tuple", "values": []}
            memory[val_id]["values"] = [x for x in (normalize(v) for v in val[:100]) if x is not SKIP]
            return {"__ref__": val_id}
            
        elif isinstance(val, dict):
            memory[val_id] = {"__type__": "dict", "values": {}}
            memory[val_id]["values"] = {str(k): x for k, v in list(val.items())[:100] if (x := normalize(v)) is not SKIP}
            return {"__ref__": val_id}
            
        elif isinstance(val, set):
            memory[val_id] = {"__type__": "set", "values": []}
            memory[val_id]["values"] = [x for x in (normalize(v) for v in list(val)[:100]) if x is not SKIP]
            return {"__ref__": val_id}
            
        elif hasattr(val, "__dict__"):
            obj_dict = {"__type__": type(val).__name__}
            memory[val_id] = obj_dict
            
            for k, v in vars(val).items():
                if not k.startswith("__"):
                    norm_v = normalize(v)
                    if norm_v is not SKIP:
                        obj_dict[k] = norm_v
            return {"__ref__": val_id}
        else:
            return f"<Object: {type(val).__name__}>"

    variables = {}
    for k, v in local_vars.items():
        if not k.startswith("__"):
            norm_v = normalize(v)
            if norm_v is not SKIP:
                variables[k] = norm_v
            
    return variables, memory

