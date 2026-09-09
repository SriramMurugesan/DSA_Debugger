from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_auth_registration_and_login():
    """Ensure standard register and login flow works."""
    import time
    unique_email = f"test_{int(time.time())}@magizhcode.io"
    
    # 1. Register
    reg_resp = client.post("/api/v1/auth/register", json={
        "email": unique_email,
        "password": "Password123!",
        "name": "Aadithyen Tester"
    })
    from app.core.config import settings
    assert reg_resp.status_code == 200, reg_resp.text
    reg_data = reg_resp.json()
    assert reg_data["email"] == unique_email
    assert settings.SESSION_COOKIE_NAME in reg_resp.cookies

    # 2. Login
    login_resp = client.post("/api/v1/auth/login", json={
        "email": unique_email,
        "password": "Password123!"
    })
    assert login_resp.status_code == 200, login_resp.text
    login_data = login_resp.json()
    assert login_data["email"] == unique_email
    assert settings.SESSION_COOKIE_NAME in login_resp.cookies

    # 3. Check /me with cookie
    me_resp = client.get("/api/v1/auth/me", cookies=login_resp.cookies)
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == unique_email

def test_problems_listing():
    """Verify problems seeded into Aiven DB are returned."""
    resp = client.get("/api/v1/problems")
    assert resp.status_code == 200
    problems = resp.json()
    assert len(problems) > 0
    assert "id" in problems[0]
    assert "title" in problems[0]
