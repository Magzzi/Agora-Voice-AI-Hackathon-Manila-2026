 [Project Name: e.g., ScholarVoice AI]
Team Name: Setso

📖 Project Overview
[1-2 paragraphs explaining the project. Mention that it's a real-time, voice-assisted thesis consultant and document editor. Highlight that you built it to solve the pain of static document editing by turning the AI into an active, conversational defense panelist.]

🚀 How It Uses Agora & AI (The Hackathon Theme)
Agora RTC SDK: Used for the low-latency, real-time audio connection between the user and the web client. 
Agora Conversational AI Engine: Powers the core voice-to-voice agent that acts as the thesis consultant.
TRAE IDE: Used extensively for rapid boilerplate generation, React component styling, and FastAPI routing. (See `/TRAE_Usage` folder for our workflow).

🏗️ Technical Architecture
Frontend: React / Vite (Handles the Markdown editor and Agora Voice UI)
Backend:* Python / FastAPI (Handles context syncing and LLM prompts)
AI/LLM: [Insert the LLM you used, e.g., OpenAI / Gemini via OpenRouter]

⚙️ Setup & Installation Instructions
(Judges need to be able to run this easily!)

Prerequisites
Node.js and npm
Python 3.9+
Agora App ID and Certificate

Backend Setup
`cd Source Code/backend`
`pip install -r requirements.txt`
Create a `.env` file and add: `AGORA_APP_ID=your_id`
Run the server: `uvicorn main:app --reload`

Frontend Setup
`cd Source Code/frontend`
`npm install`
`npm run dev`


🎮 How to Use It (Usage Guide)
1. Open the local host link.
2. Paste a draft of your thesis (e.g., YOLOv11 framework methodology) into the left Markdown pane.
3. Click "Connect Voice" on the right pane.
4. Speak into your mic: "Can you review my methodology section for clarity?"
5. The AI will read the context and reply verbally. 

⚠️ Special Instructions / Known Limitations
Working: Voice-to-voice consultation, real-time text syncing.
Not Working/Avoid: [Be honest here! e.g., "PDF upload is currently mocked; please paste raw text directly into the editor for the demo."]

