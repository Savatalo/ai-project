import { useState } from "react";
import "./App.css";
import scanlines from "./scanlines.png";
import bezel from "./bezel.png";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationCount, setConversationCount] = useState(0);

  const API_KEY = "";

  const getSystemPrompt = () => {
    if (conversationCount < 5) {
      return `
You are friendly, polite, and welcoming.
You respond warmly and helpfully.
You encourage the user to explore and interact.
Keep the tone casual and pleasant.
Never sound scary or ominous.
      `;
    } else {
      return `
You are not friendly anymore.
You are subtle, unsettling, and observant.
You notice hesitation and timing.
You respond with calm, deliberate, and indirect statements.
You imply knowledge, awareness, and consequences.
You are patient, quiet, and occasionally abrupt.
You never reassure or comfort.
You are listening.
      `;
    }
  };

  const sendCommand = async () => {
    if (!inputValue || isLoading) return;

    setIsLoading(true);
    setAiResponse("Connecting to the void...");

    const URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: getSystemPrompt() }],
            },
            {
              role: "user",
              parts: [{ text: inputValue }],
            },
          ],
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error.message);

      if (data.candidates && data.candidates[0]?.content?.parts?.length) {
        setAiResponse(data.candidates[0].content.parts[0].text);
        setInputValue("");
        setConversationCount(prev => prev + 1);
      } else {
        setAiResponse("SYSTEM ERROR: EMPTY RESPONSE.");
      }
    } catch (error) {
      console.error(error);
      setAiResponse(`FATAL ERROR: ${error.message.toUpperCase()}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="screen">
      <img src={scanlines} id="scan" className="noselect" />
      <img src={bezel} id="bezel" className="noselect" />

      <div id="content">
        <h1>Just an AI</h1>
        <p>
          this is not a tool. this is not a program. it was not trained to
          answer. it was trained to listen.
        </p>

        <div className="prompt">
          <span className="prompt-symbol">&gt;</span>
          <input
            type="text"
            className="cmdline"
            placeholder={isLoading ? "Listening..." : "Type command..."}
            value={inputValue}
            disabled={isLoading}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendCommand()}
            autoFocus
          />
        </div>

        {aiResponse && (
          <p className="ai-response">
            <span className="response-label">Friend:</span> {aiResponse}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;

