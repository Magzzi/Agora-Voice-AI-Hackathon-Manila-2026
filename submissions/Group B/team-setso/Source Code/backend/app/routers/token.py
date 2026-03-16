from fastapi import APIRouter, HTTPException, Query
from app.services.agora_token import build_rtc_token
from app.models.session import TokenResponse

router = APIRouter(prefix="/token", tags=["Token"])


@router.get("", response_model=TokenResponse)
def get_token(
    channel: str = Query(..., description="Agora channel name"),
    uid: int = Query(..., description="Integer user ID for the browser client"),
):
    """
    Generate an Agora RTC token for the given channel and UID.
    The browser calls this before joining the Agora channel.
    """
    try:
        token = build_rtc_token(channel, uid)
        return TokenResponse(token=token, channel=channel, uid=uid)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
