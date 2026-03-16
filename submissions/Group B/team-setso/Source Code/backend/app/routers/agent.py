from fastapi import APIRouter, HTTPException
from app.models.session import (
    StartAgentRequest,
    StartAgentResponse,
    StopAgentRequest,
    StopAgentResponse,
)
from app.services.agora_token import build_rtc_token
from app.services.agora_agent import start_agent, stop_agent

router = APIRouter(prefix="/agent", tags=["Agent"])


@router.post("/start", response_model=StartAgentResponse)
async def agent_start(body: StartAgentRequest):
    """
    Start the YAMI Conversational AI agent in the given Agora channel.
    Generates an agent-auth RTC token, then calls the Agora Conversational AI
    /join endpoint. Returns the agent_id for later teardown.
    """
    # Generate a token for the agent itself (UID 0)
    agent_token = build_rtc_token(body.channel, 0)

    try:
        result = await start_agent(
            channel=body.channel,
            uid=body.uid,
            rtc_token=agent_token,
            style=body.style,
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Agora agent start failed: {exc}") from exc

    return StartAgentResponse(
        agent_id=result.get("agent_id", ""),
        status=result.get("status", "RUNNING"),
    )


@router.post("/stop", response_model=StopAgentResponse)
async def agent_stop(body: StopAgentRequest):
    """
    Stop the YAMI Conversational AI agent and remove it from the channel.
    """
    try:
        await stop_agent(body.agent_id)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Agora agent stop failed: {exc}") from exc

    return StopAgentResponse(success=True)
