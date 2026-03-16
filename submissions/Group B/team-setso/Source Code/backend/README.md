# YAMI AI — Backend

FastAPI backend powering the YAMI voice session.

## Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Liveness probe |
| `GET` | `/token?channel=&uid=` | Generate Agora RTC token |
| `POST` | `/agent/start` | Start Agora Conversational AI agent |
| `POST` | `/agent/stop` | Stop the agent and remove from channel |

## Setup

```bash
cd "Source Code/backend"

# 1. Create virtual environment
python -m venv venv
venv\Scripts\activate       # Windows
# source venv/bin/activate   # macOS/Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure secrets
cp .env.example .env
# Fill in all values in .env

# 4. Run
uvicorn app.main:app --reload --port 8000
```

Interactive docs: http://localhost:8000/docs

## Environment Variables

See `.env.example` for full reference.

| Variable | Description |
|---|---|
| `AGORA_APP_ID` | From Agora Console |
| `AGORA_APP_CERTIFICATE` | From Agora Console |
| `AGORA_CUSTOMER_KEY` | Conversational AI REST auth |
| `AGORA_CUSTOMER_SECRET` | Conversational AI REST auth |
| `ELEVENLABS_API_KEY` | ElevenLabs API key |
| `LLM_PROVIDER` | `zenmux` (default) or `bedrock` |
| `LLM_BASE_URL` | Zenmux / OpenAI-compatible endpoint |
| `LLM_API_KEY` | API key for chosen LLM |
| `BEDROCK_BASE_URL` | OpenAI-compat proxy for AWS Bedrock |
