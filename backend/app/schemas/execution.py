from typing import Any, Dict, List, Optional
from pydantic import BaseModel
from .events import VisualizationEvent

class ExecutionStep(BaseModel):
    step_id: int
    line_number: Optional[int]
    event_type: str
    
    variables: Dict[str, Any]
    stdout: List[str]
    call_stack: List[Dict[str, Any]]
    memory: Dict[str, Any]
    visualization_events: List[VisualizationEvent]
    timestamp: Optional[float] = None

class ExecutionRequest(BaseModel):
    language: str = "python"
    code: str

class ExecutionResponse(BaseModel):
    execution_id: str
    status: str
    steps: List[ExecutionStep]
    error: Optional[Dict[str, Any]] = None
