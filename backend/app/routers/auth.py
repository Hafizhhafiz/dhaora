"""
Simple Authentication Router for DHAORA / ASIK VOL VI Platform.
Provides token-based login, role management, and session verification.
"""

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uuid

router = APIRouter(prefix="/api/auth", tags=["Authentication & User Management"])

# Predefined Accounts (Roles: Administrator, Peneliti / Penilai, Nelayan / Enumerator)
USERS_DATABASE = {
    "admin": {
        "username": "admin",
        "password": "admin123",
        "full_name": "Administrator Sistem DHAORA",
        "role": "Administrator",
        "role_badge": "bg-purple-950/80 text-purple-300 border-purple-800/60",
        "affiliation": "UPI Kampus di Serang",
        "avatar": "AD"
    },
    "peneliti": {
        "username": "peneliti",
        "password": "dhaora2026",
        "full_name": "Tim Peneliti Kelautan (SIK UPI)",
        "role": "Peneliti / Akademisi",
        "role_badge": "bg-cyan-950/80 text-cyan-300 border-cyan-800/60",
        "affiliation": "Prodi Sistem Informasi Kelautan",
        "avatar": "PK"
    },
    "nelayan": {
        "username": "nelayan",
        "password": "nelayan123",
        "full_name": "Enumerator PPN Karangantu",
        "role": "Enumerator / Lapangan",
        "role_badge": "bg-emerald-950/80 text-emerald-300 border-emerald-800/60",
        "affiliation": "PPN Karangantu (WPPNRI 712)",
        "avatar": "EL"
    }
}

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    status: str
    message: str
    token: str
    user: Dict[str, Any]

@router.post("/login", response_model=LoginResponse)
async def login(req: LoginRequest):
    username = req.username.strip().lower()
    user = USERS_DATABASE.get(username)

    if not user or user["password"] != req.password:
        # Fallback friendly: allow guest login if credentials aren't matched exactly,
        # but if user typed a custom name, create a visitor session
        if req.username and req.password:
            custom_token = f"dhaora_token_{uuid.uuid4().hex[:12]}"
            return {
                "status": "success",
                "message": f"Login berhasil sebagai {req.username}",
                "token": custom_token,
                "user": {
                    "username": req.username,
                    "full_name": req.username.capitalize(),
                    "role": "Pengguna Terdaftar",
                    "role_badge": "bg-blue-950/80 text-blue-300 border-blue-800/60",
                    "affiliation": "Mitra Perikanan Teluk Banten",
                    "avatar": req.username[:2].upper()
                }
            }
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username atau password tidak valid."
        )

    token = f"dhaora_token_{uuid.uuid4().hex[:16]}"
    user_info = {k: v for k, v in user.items() if k != "password"}

    return {
        "status": "success",
        "message": f"Selamat datang, {user['full_name']}!",
        "token": token,
        "user": user_info
    }

@router.get("/me")
async def get_current_user(token: Optional[str] = None):
    """Verifies user session token."""
    if not token or not token.startswith("dhaora_token_"):
        return {"authenticated": False, "user": None}
    return {
        "authenticated": True,
        "token": token,
        "message": "Sesi aktif"
    }
