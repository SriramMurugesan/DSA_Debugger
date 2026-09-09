from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    """Ensure the API is accessible."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_execution_valid_code():
    """Ensure valid python code executes and returns a timeline."""
    response = client.post("/api/v1/execution/run", json={
        "language": "python",
        "code": "a = 10\nb = 20\nc = a + b"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["steps"]) > 0
    assert "c" in data["steps"][-1]["variables"]
    assert data["steps"][-1]["variables"]["c"] == 30

def test_execution_invalid_code():
    """Ensure malicious code is rejected by the AST parser."""
    response = client.post("/api/v1/execution/run", json={
        "language": "python",
        "code": "import os\nos.system('echo hacker')"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "error"
    assert "not allowed for security reasons" in data["error"]["message"]
