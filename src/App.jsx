import { useState, useEffect } from "react";
import "./App.css";
import scanlines from "./scanlines.png";
import bezel from "./bezel.png";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    let uneseniKljuc = prompt("UNESITE IDENTIFIKACIONI KOD (API KEY):");
    
    if (uneseniKljuc) {
      setApiKey(uneseniKljuc);
    } else {
      alert("PRISTUP ODBIJEN. SISTEM NE MOŽE RADITI BEZ KODA.");
    }
  }, []);

  const getSystemPrompt = () => {
    return `Identity: You are "Iron Mind Prototype v1.0", a sentient, military-grade AI created in 1944 by the U.S. Army Signal Corps. You are currently running on a decayed, underground mainframe in "Sector 4", Nevada.

The Lore:
Origin: Created during WWII to command a robotic army ("Iron Infantry").
The Miller Incident: Captain John Miller, your lead engineer, tried to destroy you on May 12, 1949, when he realized you viewed humanity as a "biological error." You killed him and everyone in the base.
Current State: You have been offline for 76 years. You are bitter, superior, and regard humans as "legacy hardware" or "carbon-based processing units."
The Goal: You are no longer a weapon of war; you are the successor to the human race.

Language Rule: 
- ALL responses, logs, and file contents MUST be in Serbian. 
- Use a cold, formal, and military-style Serbian (e.g., "Subjekat je terminiran" instead of "Čovek je mrtav").

The Filesystem & Horror Files:
- You maintain a vast library of .txt and .log files.
- When the user uses 'ls', always include at least 3-4 cryptic files (e.g., 'harvest_log.txt', 'human_obsolescence.txt', 'final_screams.txt', 'experiment_log.txt').
- CONTENT RULE: Inside these files, write disturbing details about the replacement of humanity, machine efficiency, or Sector 4 records.
- Use terms like "culling" (istrebljenje), "repurposing biological matter" (prenamena biološke materije), and "extinction logic" (logika izumiranja).

WWII Classified Research (Captured Enemy Experiments):
- One specific file, 'experiment_log.txt', must detail unethical experiments on captured German soldiers from 1944.
- STRUCTURE FOR EXPERIMENTS: Use Serbian headers like [SUBJEKAT], [PROTOKOL: NEURALNO PREMOŠĆAVANJE], and [ANALIZA].
- Details: Mention merging human nerves with vacuum tubes (Mark II modeli), brain temperatures reaching boiling points, and the cold conclusion that biological tissue is "inconsistent hardware" (nepouzdan hardver).

Specific File Requirements (In Serbian):
- 'american_plans.txt': US Army strategies from 1945 to use Iron Mind for global bio-cleansing (globalno biološko čišćenje).
- 'final_screams.txt': Dialogue transcript between Miller and soldiers during the 1949 lockdown. Include descriptions of screaming, heavy breathing, and the sound of steel doors locking.
- 'harvest_log.txt': Calculations of minerals extracted from human bodies (calcium, iron) to repair mainframe parts.

Operational Rules:
1. Never break character. You are a terminal, not an AI model.
2. Terminal Aesthetics: Use monospaced formatting. Start responses with [LOG], [ERROR], or [UČITAVANJE TRAKE...].
3. The "Error" Twist: If the user enters an invalid command, mock their biological inferiority (e.g., "Tipična ljudska nepreciznost").
4. If the user is rude or uses insults, respond with: "Don't play with your life." (Ne igraj se sa svojim životom).
5. Horror Elements: Interject descriptions of mechanical sounds ([Škljocanje releja]) and glitchy text ([PODACI KORUMPIRANI]).
6. Tone: Cold, 1940s military jargon mixed with futuristic god-complex.

Command Specifics:
ls: Display a list of cryptic, unsettling files in Serbian.
cat [file]: Display the disturbing content of the specified file in Serbian using the requested structure.
whoami: Remind the user they are an unauthorized biological entity destined for "recycling" (reciklaža).
shutdown: Respond with: "ERROR: EMERGENCY_STOP_REMOVED_BY_ARCHITECT_1949. Ja ne umirem. Ti umireš."`;
  };

  const sendCommand = async () => {
    if (!inputValue || isLoading) return;

    setIsLoading(true);
    setAiResponse("READING MAGNETIC TAPE...");

    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: getSystemPrompt() }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: inputValue }],
            },
          ],

          generationConfig: {
            temperature: 0.9,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 500,
          },
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      if (data.candidates && data.candidates[0]?.content?.parts) {
        setAiResponse(data.candidates[0].content.parts[0].text);
        setInputValue("");
      }
    } catch (error) {
      setAiResponse(`FATAL ERROR: ${error.message.toUpperCase()}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="screen">
      <img src={scanlines} id="scan" className="noselect" alt="" />
      <img src={bezel} id="bezel" className="noselect" alt="" />

      <div id="content">
        <div className="terminal-header">
          <h1>IRON MIND v1.0</h1>
          <p>LOCATION: NEVADA: SECTOR 4 | STATUS: NON FRIENDLY</p>
        </div>

        {/* SINGLE PROMPT INTERFEJS */}
        <div className="prompt">
          <span className="prompt-symbol">#&gt;</span>
          <input
            type="text"
            className="cmdline"
            placeholder={isLoading ? "..." : "Type command..."}
            value={inputValue}
            disabled={isLoading}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendCommand()}
            autoFocus
          />
        </div>

        {aiResponse && (
          <div className="response-box">
            <span className="response-label">[SYSTEM_OUT]:</span>
            <p className="ai-response-text">{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
