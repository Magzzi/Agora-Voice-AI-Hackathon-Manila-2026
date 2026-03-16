# UI/UX Prompt for YAMI AI (Thesis Consultant & Document Editor)

Create a modern, clean, and highly functional web interface for **YAMI AI**, a real-time, voice-assisted thesis consultant and document editor. The design should focus on productivity, clarity, and a seamless integration of voice-to-voice interaction.

### 🎨 Design Language & Aesthetic
- **Minimalist & Modern**: Use a "SaaS-style" aesthetic—clean typography, ample white space, and subtle shadows.
- **Typography**: Utilize the **Geist** font family (already integrated). High readability is crucial for long-form thesis editing.
- **Color Palette**: 
  - **Light Mode**: Zinc-50 background, white editor surface, dark charcoal text.
  - **Dark Mode**: Deep black background, zinc-900 surfaces, soft white text.
  - **Accents**: A soft indigo or deep blue for primary actions (e.g., "Connect Voice").
- **Layout**: A 2-column split-pane layout that feels balanced and focused.

### 🏗️ Key UI Components

#### 1. Sidebar / Navigation (Left - Optional/Thin)
- Minimalist icons for: Project Home, Document Settings, Session History, and Theme Toggle.

#### 2. Main Content Area: Markdown Editor (Left Pane)
- **Editor**: A distraction-free Markdown editor with real-time syntax highlighting.
- **Toolbar**: A sticky top toolbar with basic formatting options (B, I, H1, H2, List, Link).
- **Status Indicator**: A subtle "Synced" indicator to show real-time context updates to the backend.

#### 3. AI Interaction & Voice Panel (Right Pane)
- **Voice Controller**: 
  - A prominent, elegant "Connect Voice" button that transforms into an active state.
  - **Voice Visualizer**: A waveform or pulsing circle that reacts to the user's and the AI's speech.
  - **Microphone Status**: Clear mute/unmute toggle and sensitivity indicator.
- **Conversational Feedback**:
  - A scrollable "Chat Log" that displays the AI's verbal responses as text snippets (for accessibility and review).
  - AI "Panelist" Profile: A professional avatar or icon representing the "Defense Panelist" persona.
- **Context Awareness**: A small badge or text area showing "AI is currently reading: [Section Name]" to provide transparency.

#### 4. Header / Global Actions
- Project Title: "YAMI AI" (or "Setso Consultant").
- User Profile / Account menu.
- Share/Export button (e.g., Export to PDF/DOCX).

### ✨ UX & Interaction Details
- **Seamless Transition**: When "Connect Voice" is clicked, the right panel should smoothly expand or highlight its active status.
- **Real-time Sync**: As the user types in the left pane, provide a subtle visual cue (like a fading "Saving..." or a dot) to indicate the AI is processing the new context.
- **Haptic/Visual Feedback**: Use micro-interactions for button clicks and state changes to make the interface feel responsive and high-quality.
- **Responsive Design**: Ensure the split-pane layout adapts gracefully to smaller screens (stacking panes vertically).

### 🛠️ Technical Implementation Notes (for LLM)
- Use **Next.js (App Router)** and **Tailwind CSS 4**.
- Implement the editor using a library like `react-markdown` or a basic `textarea` with live preview.
- For the voice visualizer, use the **Web Audio API** or a library like `react-use-gesture` for smooth animations.
- Ensure the state management (e.g., React Context or Zustand) handles the syncing between the editor's text and the Agora voice agent's context.

---

**Objective**: The user should feel like they are working in a premium, AI-powered writing suite where the technology fades into the background, allowing them to focus on their thesis defense preparation.
