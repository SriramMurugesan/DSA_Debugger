import sys
import io
from typing import List
from app.schemas.execution import ExecutionStep
from app.execution.normalizer import serialize_state

class CodeTracer:
    """Hooks into sys.settrace to capture execution states line by line."""
    def __init__(self):
        self.steps: List[ExecutionStep] = []
        self.step_count = 0
        self.stdout_capture = io.StringIO()
        self.original_stdout = sys.stdout
        
    def trace_calls(self, frame, event, arg):
        if event not in ["line", "call", "return", "exception"]:
            return self.trace_calls
            
        # Only trace code originating from the injected string, ignoring internal Python modules
        if frame.f_code.co_filename != "<string>":
            return self.trace_calls
            
        self.step_count += 1
        
        variables, memory = serialize_state(frame.f_locals)
        stdout_content = self.stdout_capture.getvalue().splitlines()
        
        step = ExecutionStep(
            step_id=self.step_count,
            line_number=frame.f_lineno,
            event_type=event,
            variables=variables,
            stdout=stdout_content,
            call_stack=[{"function": frame.f_code.co_name}],
            memory=memory,
            visualization_events=[],
            timestamp=None
        )
        self.steps.append(step)
        
        if self.step_count > 1000:
            raise RuntimeError("Maximum execution step limit reached (1000 steps)")
            
        return self.trace_calls
