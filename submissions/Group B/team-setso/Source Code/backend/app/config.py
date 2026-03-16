from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # ─── Agora ───────────────────────────────────────────────────────────────
    AGORA_APP_ID: str
    AGORA_APP_CERTIFICATE: str
    AGORA_CUSTOMER_KEY: str
    AGORA_CUSTOMER_ID: str | None = None
    AGORA_CUSTOMER_SECRET: str

    # ─── ElevenLabs TTS ──────────────────────────────────────────────────────
    ELEVENLABS_API_KEY: str
    ELEVENLABS_VOICE_ID: str = "21m00Tcm4TlvDq8ikWAM"  # Rachel — clear, academic

    # ─── LLM (Groq / OpenAI-compatible) ──────────────────────────────────────
    LLM_BASE_URL: str = "https://api.groq.com/openai/v1/chat/completions"
    LLM_API_KEY: str = ""
    LLM_MODEL: str = "openai/gpt-oss-120b"

    # ─── AWS Bedrock (optional — used if LLM_PROVIDER=bedrock) ───────────────
    LLM_PROVIDER: str = "groq"     # "groq" | "bedrock" | "zenmux"
    BEDROCK_REGION: str = "us-east-1"
    BEDROCK_MODEL_ID: str = "anthropic.claude-3-haiku-20240307-v1:0"
    BEDROCK_BASE_URL: str = ""     # OpenAI-compat proxy for Bedrock

    # ─── App ─────────────────────────────────────────────────────────────────
    CORS_ORIGINS: str = "http://localhost:3000"
    TOKEN_EXPIRY_SECONDS: int = 3600
    AGENT_IDLE_TIMEOUT: int = 120


settings = Settings()  # type: ignore[call-arg]
