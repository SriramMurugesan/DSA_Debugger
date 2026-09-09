import sys
import os

# Ensure backend directory is in sys.path so 'app.*' modules resolve on Vercel Serverless
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app as fastapi_app

# Vercel ASGI path wrapper to resolve x-matched-path when rewrites occur
class VercelPathMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            headers = dict(scope.get("headers", []))
            # Vercel sends x-matched-path containing the original request URI
            matched_path = headers.get(b"x-matched-path")
            if matched_path:
                path_str = matched_path.decode("utf-8")
                if not path_str.endswith(".py") and path_str.startswith("/"):
                    scope["path"] = path_str
        await self.app(scope, receive, send)

app = VercelPathMiddleware(fastapi_app)
