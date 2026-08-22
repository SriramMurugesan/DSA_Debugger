from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from datetime import datetime
import httpx
import json
from itsdangerous import URLSafeSerializer

from app.db.models import get_db, User
from app.core.config import settings

router = APIRouter()
serializer = URLSafeSerializer(settings.SECRET_KEY)

@router.get("/auth/dev-login")
def dev_login(response: Response, db: Session = Depends(get_db)):
    # Dev only route to bypass OAuth
    user = db.query(User).filter_by(email="dev@magizhcode.com").first()
    if not user:
        user = User(
            id="usr_dev_123",
            email="dev@magizhcode.com",
            name="Developer User",
            provider="dev",
            provider_user_id="dev_123"
        )
        db.add(user)
        db.commit()
    redirect = RedirectResponse(f"{settings.FRONTEND_URL}/dashboard")
    set_session_cookie(redirect, user.id)
    return redirect

def set_session_cookie(response: Response, user_id: str):
    token = serializer.dumps({"user_id": user_id})
    response.set_cookie(
        key=settings.SESSION_COOKIE_NAME,
        value=token,
        max_age=settings.SESSION_MAX_AGE_SECONDS,
        httponly=True,
        samesite="lax"
    )

def clear_session_cookie(response: Response):
    response.delete_cookie(settings.SESSION_COOKIE_NAME)

def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get(settings.SESSION_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        data = serializer.loads(token)
        user = db.query(User).filter(User.id == data["user_id"]).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except:
        raise HTTPException(status_code=401, detail="Invalid session")


@router.get("/auth/me")
def get_me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "avatar_url": user.avatar_url
    }

@router.post("/auth/logout")
def logout(response: Response):
    clear_session_cookie(response)
    return {"message": "Logged out successfully"}


# ─── GOOGLE OAUTH ─────────────────────────────────────────────────────────────

@router.get("/auth/google/login")
def google_login(response: Response, db: Session = Depends(get_db)):
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(500, "Google OAuth not configured")
    
    url = (
        "https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={settings.GOOGLE_CLIENT_ID}&"
        f"redirect_uri={settings.GOOGLE_REDIRECT_URI}&"
        "response_type=code&"
        "scope=openid email profile&"
        "access_type=offline"
    )
    return RedirectResponse(url)


@router.get("/auth/google/callback")
async def google_callback(code: str, request: Request, db: Session = Depends(get_db)):
    token_url = "https://oauth2.googleapis.com/token"
    async with httpx.AsyncClient() as client:
        res = await client.post(token_url, data={
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        })
        if res.status_code != 200:
            raise HTTPException(400, "Failed to exchange token")
        token_data = res.json()
        
        user_info_res = await client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {token_data['access_token']}"}
        )
        if user_info_res.status_code != 200:
            raise HTTPException(400, "Failed to get user info")
        user_info = user_info_res.json()

    provider_id = user_info["sub"]
    email = user_info.get("email")
    name = user_info.get("name")
    avatar = user_info.get("picture")

    user = db.query(User).filter_by(provider="google", provider_user_id=provider_id).first()
    if not user:
        user = db.query(User).filter_by(email=email).first()
        if user:
            user.provider = "google"
            user.provider_user_id = provider_id
        else:
            user = User(
                id=f"usr_go_{provider_id[:10]}",
                email=email,
                name=name,
                avatar_url=avatar,
                provider="google",
                provider_user_id=provider_id
            )
            db.add(user)
    
    user.last_login_at = datetime.utcnow()
    db.commit()

    response = RedirectResponse(f"{settings.FRONTEND_URL}/dashboard")
    set_session_cookie(response, user.id)
    return response


# ─── GITHUB OAUTH ─────────────────────────────────────────────────────────────

@router.get("/auth/github/login")
def github_login(response: Response, db: Session = Depends(get_db)):
    if not settings.GITHUB_CLIENT_ID:
        raise HTTPException(500, "GitHub OAuth not configured")
    
    url = (
        "https://github.com/login/oauth/authorize?"
        f"client_id={settings.GITHUB_CLIENT_ID}&"
        f"redirect_uri={settings.GITHUB_REDIRECT_URI}&"
        "scope=read:user user:email"
    )
    return RedirectResponse(url)


@router.get("/auth/github/callback")
async def github_callback(code: str, request: Request, db: Session = Depends(get_db)):
    token_url = "https://github.com/login/oauth/access_token"
    async with httpx.AsyncClient() as client:
        res = await client.post(token_url, data={
            "client_id": settings.GITHUB_CLIENT_ID,
            "client_secret": settings.GITHUB_CLIENT_SECRET,
            "code": code,
            "redirect_uri": settings.GITHUB_REDIRECT_URI,
        }, headers={"Accept": "application/json"})
        
        if res.status_code != 200:
            raise HTTPException(400, "Failed to exchange token")
        token_data = res.json()
        if "error" in token_data:
            raise HTTPException(400, f"GitHub error: {token_data['error']}")
            
        access_token = token_data["access_token"]
        
        user_res = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if user_res.status_code != 200:
            raise HTTPException(400, "Failed to get user info")
        user_info = user_res.json()
        
        emails_res = await client.get(
            "https://api.github.com/user/emails",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        email = None
        if emails_res.status_code == 200:
            emails = emails_res.json()
            for e in emails:
                if e.get("primary") and e.get("verified"):
                    email = e.get("email")
                    break
            if not email and emails:
                email = emails[0].get("email")

    provider_id = str(user_info["id"])
    name = user_info.get("name") or user_info.get("login")
    avatar = user_info.get("avatar_url")

    user = db.query(User).filter_by(provider="github", provider_user_id=provider_id).first()
    if not user:
        if email:
            user = db.query(User).filter_by(email=email).first()
        if user:
            user.provider = "github"
            user.provider_user_id = provider_id
        else:
            user = User(
                id=f"usr_gh_{provider_id[:10]}",
                email=email,
                name=name,
                avatar_url=avatar,
                provider="github",
                provider_user_id=provider_id
            )
            db.add(user)
    
    user.last_login_at = datetime.utcnow()
    db.commit()

    response = RedirectResponse(f"{settings.FRONTEND_URL}/dashboard")
    set_session_cookie(response, user.id)
    return response
