from fastapi import APIRouter
from app.schemas.execution import ExecutionRequest, ExecutionResponse
from app.services.execution_service import ExecutionService

router = APIRouter()

@router.post("/run", response_model=ExecutionResponse)
def run_code(request: ExecutionRequest):
    """Executes the provided Python code and returns the full execution trace timeline."""
    return ExecutionService.execute_code(request)
