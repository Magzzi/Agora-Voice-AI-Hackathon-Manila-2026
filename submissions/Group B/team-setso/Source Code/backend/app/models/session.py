from pydantic import BaseModel
from typing import Literal


class TokenResponse(BaseModel):
    token: str
    channel: str
    uid: int


class StartAgentRequest(BaseModel):
    channel: str
    uid: int
    style: Literal["guided", "standard", "rigorous"] = "standard"


class StartAgentResponse(BaseModel):
    agent_id: str
    status: str


class StopAgentRequest(BaseModel):
    agent_id: str


class StopAgentResponse(BaseModel):
    success: bool
