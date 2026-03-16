import time
from agora_token_builder import RtcTokenBuilder
from app.config import settings


def build_rtc_token(channel: str, uid: int) -> str:
    """
    Build a short-lived Agora RTC token for a publisher joining `channel`.
    `uid` is the integer user ID assigned to the browser client.
    """
    expire_ts = int(time.time()) + settings.TOKEN_EXPIRY_SECONDS

    token = RtcTokenBuilder.buildTokenWithUid(
        settings.AGORA_APP_ID,
        settings.AGORA_APP_CERTIFICATE,
        channel,
        uid,
        1,  # Role_Publisher = 1
        expire_ts,
    )
    return token
