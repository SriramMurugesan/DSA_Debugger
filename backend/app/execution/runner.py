import sys
from typing import Tuple, List
from app.execution.ast_parser import validate_code
from app.execution.tracer import CodeTracer
from app.schemas.execution import ExecutionStep

def run_code(code: str) -> Tuple[bool, List[ExecutionStep], str]:
    """Validates and executes the code, returning the full execution timeline."""
    errors = validate_code(code)
    if errors:
        return False, [], "\n".join(errors)
        
    tracer = CodeTracer()
    
    # Divert stdout to capture print() statements
    sys.stdout = tracer.stdout_capture
    sys.settrace(tracer.trace_calls)
    
    namespace = {}
    
    success = False
    error_msg = ""
    
    try:
        compiled_code = compile(code, "<string>", "exec")
        exec(compiled_code, namespace)
        success = True
    except Exception as e:
        success = False
        error_msg = f"{type(e).__name__}: {str(e)}"
    finally:
        sys.settrace(None)
        sys.stdout = tracer.original_stdout
        
    return success, tracer.steps, error_msg
