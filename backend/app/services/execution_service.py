from app.schemas.execution import ExecutionRequest, ExecutionResponse
from app.execution.runner import run_code
import uuid

class ExecutionService:
    """
    Orchestrates the lifecycle of an execution request.
    Validates the AST, executes securely, and formats the output.
    """
    @staticmethod
    def execute_code(request: ExecutionRequest) -> ExecutionResponse:
        success, steps, error_msg = run_code(request.code)
        
        response = ExecutionResponse(
            execution_id=str(uuid.uuid4()),
            status="success" if success else "error",
            steps=steps
        )
        
        if not success:
            response.error = {"type": "ExecutionError", "message": error_msg}
            
        return response
