from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class VisualizationEvent(BaseModel):
    """Base class for all visualization events."""
    type: str
    structure_id: Optional[str] = None

class ArrayEvent(VisualizationEvent):
    index: int
    value: Any

class StackEvent(VisualizationEvent):
    value: Any

# Add more specific events here as we expand in Phase 4-8.
