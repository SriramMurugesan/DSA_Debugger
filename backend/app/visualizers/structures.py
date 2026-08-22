from typing import Any, Dict, List
from .base import BaseVisualizer
from app.schemas.events import VisualizationEvent, ArrayEvent, StackEvent

class ArrayVisualizer(BaseVisualizer):
    """
    Detects array-specific behaviors from generic Python lists.
    (e.g., indexed access, updates, swaps).
    """
    @staticmethod
    def analyze_operations(operations: List[Dict[str, Any]]) -> List[VisualizationEvent]:
        events = []
        for op in operations:
            if op.get("type") == "ARRAY_UPDATE":
                events.append(ArrayEvent(
                    type="ARRAY_UPDATE", 
                    structure_id=op.get("id"),
                    index=op.get("index"),
                    value=op.get("value")
                ))
        return events

class StackVisualizer(BaseVisualizer):
    """
    Detects stack-specific behaviors from generic Python lists.
    (e.g., sequential append and pop operations).
    """
    @staticmethod
    def analyze_operations(operations: List[Dict[str, Any]]) -> List[VisualizationEvent]:
        events = []
        for op in operations:
            if op.get("type") == "STACK_PUSH":
                events.append(StackEvent(
                    type="STACK_PUSH",
                    structure_id=op.get("id"),
                    value=op.get("value")
                ))
        return events
