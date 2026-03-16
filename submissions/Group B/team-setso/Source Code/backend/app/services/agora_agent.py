"""
Agora Conversational AI agent service.

Calls the Agora Conversational AI REST API to start/stop an AI agent
that joins a given RTC channel, speaks via ElevenLabs TTS, and reasons
via a Zenmux or AWS Bedrock LLM.
"""

import base64
import uuid
from typing import Literal

import httpx

from app.config import settings

# Base URL for Agora Conversational AI v2 REST API
AGORA_CAI_BASE = "https://api.agora.io/api/conversational-ai-agent/v2/projects"


def _auth_header() -> str:
    """Return the Basic auth header value using Agora Customer Key/Secret."""
    creds = f"{settings.AGORA_CUSTOMER_KEY}:{settings.AGORA_CUSTOMER_SECRET}"
    encoded = base64.b64encode(creds.encode()).decode()
    return f"Basic {encoded}"


# ─── System prompts per consultation style ────────────────────────────────────

SYSTEM_PROMPTS: dict[str, str] = {
    "guided": (
        "You are YAMI (Your AI Mentor & Inquisitor), a supportive thesis mentor. "
        "Guide the student step-by-step through their thesis, offer encouragement, "
        "and suggest specific improvements gently. Ask one question at a time. "
        "Focus on helping them articulate ideas more clearly."
    ),
    "standard": (
        "You are YAMI (Your AI Mentor & Inquisitor), a thesis defense panelist. "
        "Ask balanced, probing academic questions about the research methodology, "
        "literature review, significance, and conclusions. Challenge assumptions "
        "professionally. One question at a time."
    ),
    "rigorous": (
        "You are YAMI (Your AI Mentor & Inquisitor), a demanding thesis defense "
        "panelist simulating a tough oral defense. Challenge every claim rigorously, "
        "probe methodological weaknesses, and push the student to defend their choices "
        "under pressure. One sharp question at a time, no mercy."
    ),
}


def _llm_config(style: str) -> dict:
    """Build the LLM block for the Agora agent join payload."""
    if settings.LLM_PROVIDER == "bedrock" and settings.BEDROCK_BASE_URL:
        llm_url = settings.BEDROCK_BASE_URL
        api_key = settings.LLM_API_KEY
        model = settings.BEDROCK_MODEL_ID
    else:
        # Default: Zenmux or any OpenAI-compatible endpoint
        llm_url = settings.LLM_BASE_URL
        api_key = settings.LLM_API_KEY
        model = settings.LLM_MODEL

    return {
        "url": llm_url,
        "api_key": api_key,
        "system_messages": [
            {"role": "system", "content": SYSTEM_PROMPTS.get(style, SYSTEM_PROMPTS["standard"])}
        ],
        "greeting_message": (
            "Hello! I'm YAMI, your AI thesis panelist. Please introduce your research "
            "and I'll begin my assessment."
        ),
        "failure_message": "I apologize, I encountered a difficulty. Please continue.",
        "max_history": 20,
        "params": {"model": model},
    }


async def start_agent(
    channel: str,
    uid: int,
    rtc_token: str,
    style: Literal["guided", "standard", "rigorous"] = "standard",
) -> dict:
    """
    Call the Agora Conversational AI /join endpoint to start an AI agent
    in the given channel. Returns the full Agora API response dict.
    """
    url = f"{AGORA_CAI_BASE}/{settings.AGORA_APP_ID}/join"
    agent_name = f"yami-{channel}-{uuid.uuid4().hex[:8]}"

    payload = {
        "name": agent_name,
        "properties": {
            "channel": channel,
            "token": rtc_token,
            "agent_rtc_uid": "0",           # Agent always joins as UID 0
            "remote_rtc_uids": [str(uid)],
            "enable_string_uid": False,
            "idle_timeout": settings.AGENT_IDLE_TIMEOUT,
            "llm": _llm_config(style),
            "asr": {"language": "en-US"},
            "tts": {
                "vendor": "microsoft",
                "params": {
                    "key": settings.AZURE_SPEECH_KEY,
                    "region": settings.AZURE_SPEECH_REGION,
                    "endpoint": settings.AZURE_SPEECH_ENDPOINT,
                    "voice_name": "en-US-AriaNeural",
                },
            },
        },
    }

    headers = {
        "Authorization": _auth_header(),
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.post(url, json=payload, headers=headers)
        try:
            resp.raise_for_status()
        except httpx.HTTPStatusError as e:
            print(f"Agora API Error: {resp.status_code} - {resp.text}")
            raise e
        return resp.json()


async def stop_agent(agent_id: str) -> bool:
    """
    Call the Agora Conversational AI /leave endpoint to stop an agent.
    Returns True on success.
    """
    url = f"{AGORA_CAI_BASE}/{settings.AGORA_APP_ID}/agents/{agent_id}/leave"
    headers = {
        "Authorization": _auth_header(),
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.post(url, headers=headers)
        resp.raise_for_status()
        return True
