from typing import Any, Dict, Set
from collections import deque

def normalize_value(val: Any, visited: Set[int] = None) -> Any:
    """Safely converts Python objects into JSON serializable formats without infinite recursion."""
    if visited is None:
        visited = set()
        
    val_id = id(val)
    if val_id in visited:
        return {"__circular_ref__": val_id}
        
    if isinstance(val, (int, float, str, bool, type(None))):
        return val
        
    visited.add(val_id)
    
    if isinstance(val, list):
        return [normalize_value(x, visited) for x in val[:100]] # Enforce array limits
    elif isinstance(val, deque):
        return {"__type__": "deque", "values": [normalize_value(x, visited) for x in list(val)[:100]]}
    elif isinstance(val, dict):
        return {str(k): normalize_value(v, visited) for k, v in list(val.items())[:100]}
    elif isinstance(val, tuple):
        return tuple(normalize_value(x, visited) for x in val[:100])
    elif isinstance(val, set):
        return list(normalize_value(x, visited) for x in list(val)[:100])
    elif hasattr(val, "__dict__"):
        # Custom object (Tree Node, Linked List Node)
        obj_dict = {"__type__": type(val).__name__, "__id__": val_id}
        for k, v in vars(val).items():
            if not k.startswith("__"):
                obj_dict[k] = normalize_value(v, visited)
        return obj_dict
    else:
        return f"<Object: {type(val).__name__}>"

def snapshot_variables(local_vars: Dict[str, Any]) -> Dict[str, Any]:
    """Captures the state of local variables at a specific execution step."""
    return {k: normalize_value(v, set()) for k, v in local_vars.items() if not k.startswith("__")}
