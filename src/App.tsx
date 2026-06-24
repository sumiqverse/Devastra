import { createSignal, onMount, For } from "solid-js";
import * as monaco from "monaco-editor";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import "./App.css";

function App() {
  // Panel Visibility States
  const [showExplorer, setShowExplorer] = createSignal(true);
  const [showTerminal, setShowTerminal] = createSignal(true);
  const [showIDE, setShowIDE] = createSignal(true);
  const [showBrowser, setShowBrowser] = createSignal(true);
  const [showNotes, setShowNotes] = createSignal(true);
  const [showAI, setShowAI] = createSignal(true);
  
  const [isVerticalSplit, setIsVerticalSplit] = createSignal(false); 

  // --- NEW STATES FOR INTERACTIVE FEATURES ---
  const [notesText, setNotesText] = createSignal(""); // Notes Text State
  const [browserUrl, setBrowserUrl] = createSignal("https://www.google.com"); // Real Browser URL
  const [chatMessages, setChatMessages] = createSignal([
    { sender: "ai", text: "Hello! Main aapka DevAstra AI assistant hu. Main code explain, debug ya generate kar sakta hu. Puchiye!" }
  ]);
  const [inputMessage, setInputMessage] = createSignal("");

  let editorRef!: HTMLDivElement;
  let terminalRef!: HTMLDivElement;

  onMount(() => {
    setTimeout(() => {
      // 1. Initialize Monaco Editor
      if (editorRef) {
        monaco.editor.create(editorRef, {
          value: `// DevAstra IDE System Online\n// Phase 2 ab khatam hone wala hai!\nconsole.log("Hello Hacker");`,
          language: "javascript",
          theme: "vs-dark",
          automaticLayout: true, 
          minimap: { enabled: false },
        });
      }

      // 2. Initialize Xterm.js Terminal
      if (terminalRef) {
        const term = new Terminal({
          theme: { background: "#161b22" }, 
          cursorBlink: true,
        });
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef);
        fitAddon.fit();

        term.writeln("\x1b[1;32m➜\x1b[0m Welcome to DevAstra Shell...");
        term.write("\n$ ");
        
        // Key Typing Simulation (Frontend Hack)
        term.onData((data) => {
          term.write(data);
        });

        window.addEventListener('resize', () => {
          try { fitAddon.fit(); } catch(e) {}
        });
      }
    }, 50);
  });

  // AI Send Message Handler
  const handleSendMessage = () => {
    if (!inputMessage().trim()) return;
    
    // User message add karo
    const userMsg = { sender: "user", text: inputMessage() };
    setChatMessages([...chatMessages(), userMsg]);
    const currentInput = inputMessage();
    setInputMessage("");

    // Simulated AI Reply
    setTimeout(() => {
      const aiReply = { sender: "ai", text: `Mujhe aapka message mila: "${currentInput}". Phase 3 me main directly Gemini/Ollama API se connect hokar real answers dunga!` };
      setChatMessages([...chatMessages(), aiReply]);
    }, 800);
  };

  const isRightPanelOpen = () => showNotes() || showAI();
  const isCenterTopOpen = () => showTerminal() || showIDE();

  // --- Grid Resizing Logic ---
  const rightRows = () => {
    if (!showNotes() && !showAI()) return '1fr 1fr'; 
    return `${showNotes() ? '1fr' : '8px'} ${showAI() ? '1fr' : '8px'}`;
  };
  const horizCols = () => {
    if (!showTerminal() && !showIDE()) return '1fr 1fr';
    return `${showTerminal() ? '1fr' : '8px'} ${showIDE() ? '2fr' : '8px'}`;
  };
  const horizRows = () => `${isCenterTopOpen() ? '1fr' : '8px'} ${showBrowser() ? '1fr' : '8px'}`;
  const horizAreas = `
    "term editor"
    "browser browser"
  `;
  const vertCols = () => `${isCenterTopOpen() ? '1fr' : '8px'} ${showBrowser() ? '2fr' : '8px'}`;
  const vertRows = () => {
    if (!showTerminal() && !showIDE()) return '1fr 1fr';
    return `${showTerminal() ? '1fr' : '8px'} ${showIDE() ? '2fr' : '8px'}`;
  };
  const vertAreas = `
    "term browser"
    "editor browser"
  `;

  return (
    <div class="workspace-container" style={{ "grid-template-columns": `${showExplorer() ? '20%' : '8px'} 1fr ${isRightPanelOpen() ? '25%' : '8px'}` }}>
      
      {/* --- LEFT COLUMN: EXPLORER --- */}
      <div class="panel-wrapper">
        <div class={`panel ${!showExplorer() ? 'collapsed' : ''}`} onClick={() => !showExplorer() && setShowExplorer(true)}>
          <div class="panel-header" style={{ display: showExplorer() ? 'flex' : 'none' }}>
            <span>EXPLORER</span>
            <button class="minimize-btn" onClick={(e) => { e.stopPropagation(); setShowExplorer(false); }}>X</button>
          </div>
          <div class="panel-content" style={{ display: showExplorer() ? 'block' : 'none' }}>
            <ul class="file-tree">
              <li>📂 components</li>
              <li>📄 Portfolio.tsx</li>
              <li>📄 layout.tsx</li>
            </ul>
          </div>
          {!showExplorer() && <div class="collapsed-line" title="Open Explorer"></div>}
        </div>
      </div>

      {/* --- CENTER COLUMN: TERMINAL, EDITOR & BROWSER --- */}
      <div class="column-grid" style={{ "grid-template-columns": isVerticalSplit() ? vertCols() : horizCols(), "grid-template-rows": isVerticalSplit() ? vertRows() : horizRows(), "grid-template-areas": isVerticalSplit() ? vertAreas : horizAreas }}>
        
        {/* TERMINAL */}
        <div class="panel-wrapper term-wrapper">
          <div class={`panel terminal-panel ${!showTerminal() ? 'collapsed' : ''}`} onClick={() => !showTerminal() && setShowTerminal(true)}>
            <div class="panel-header" style={{ display: showTerminal() ? 'flex' : 'none' }}>
              <span>TERMINAL</span>
              <button class="minimize-btn" onClick={(e) => { e.stopPropagation(); setShowTerminal(false); }}>X</button>
            </div>
            <div class="panel-content" ref={terminalRef} style={{ display: showTerminal() ? 'block' : 'none', height: "100%", width: "100%", padding: "4px", overflow: "hidden" }}></div>
            {!showTerminal() && <div class="collapsed-line" title="Open Terminal"></div>}
          </div>
        </div>
        
        {/* EDITOR */}
        <div class="panel-wrapper editor-wrapper">
          <div class={`panel editor-panel ${!showIDE() ? 'collapsed' : ''}`} onClick={() => !showIDE() && setShowIDE(true)}>
            <div class="panel-header" style={{ display: showIDE() ? 'flex' : 'none' }}>
              <span>EDITOR</span>
              <button class="minimize-btn" onClick={(e) => { e.stopPropagation(); setShowIDE(false); }}>X</button>
            </div>
            <div class="panel-content" ref={editorRef} style={{ display: showIDE() ? 'block' : 'none', height: "100%", width: "100%", padding: 0, overflow: "hidden" }}></div>
            {!showIDE() && <div class="collapsed-line" title="Open Editor"></div>}
          </div>
        </div>

        {/* BROWSER (Now a real working Iframe!) */}
        <div class="panel-wrapper browser-wrapper">
          <div class={`panel browser-panel ${!showBrowser() ? 'collapsed' : ''}`} onClick={() => !showBrowser() && setShowBrowser(true)}>
            <div class="panel-header browser-header" style={{ display: showBrowser() ? 'flex' : 'none' }}>
              {/* URL Address Input */}
              <input 
                type="text" 
                class="address-bar" 
                value={browserUrl()} 
                onKeyDown={(e) => e.key === "Enter" && setBrowserUrl(e.currentTarget.value)}
                placeholder="Type URL and hit Enter..."
                onClick={(e) => e.stopPropagation()}
              />
              <button class="minimize-btn" onClick={(e) => { e.stopPropagation(); setShowBrowser(false); }}>X</button>
            </div>
            <div class="panel-content browser-viewport" style={{ display: showBrowser() ? 'block' : 'none', padding: 0, height: "100%" }}>
              <iframe src={browserUrl()} style={{ width: "100%", height: "100%", border: "none", background: "#fff" }}></iframe>
            </div>
            {!showBrowser() && <div class="collapsed-line" title="Open Browser"></div>}
          </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN: NOTES & AI CHAT --- */}
      <div class="column-grid" style={{ "grid-template-rows": rightRows() }}>
        
        {/* NOTES */}
        <div class="panel-wrapper">
          <div class={`panel ${!showNotes() ? 'collapsed' : ''}`} onClick={() => !showNotes() && setShowNotes(true)}>
            <div class="panel-header" style={{ display: showNotes() ? 'flex' : 'none' }}>
              <span>NOTES</span>
              <button class="minimize-btn" onClick={(e) => { e.stopPropagation(); setShowNotes(false); }}>X</button>
            </div>
            <div class="panel-content" style={{ display: showNotes() ? 'block' : 'none', padding: 0 }}>
              <textarea 
                value={notesText()} 
                onInput={(e) => setNotesText(e.currentTarget.value)}
                style={{ width: "100%", height: "100%", background: "transparent", color: "#c9d1d9", border: "none", resize: "none", outline: "none", padding: "12px" }} 
                placeholder="Type notes here... (Markdown mode ready)"
              />
            </div>
            {!showNotes() && <div class="collapsed-line" title="Open Notes"></div>}
          </div>
        </div>
        
        {/* AI CHAT (Fully Interactive UI) */}
        <div class="panel-wrapper">
          <div class={`panel ${!showAI() ? 'collapsed' : ''}`} onClick={() => !showAI() && setShowAI(true)}>
            <div class="panel-header" style={{ display: showAI() ? 'flex' : 'none' }}>
              <span>AI CHAT</span>
              <button class="minimize-btn" onClick={(e) => { e.stopPropagation(); setShowAI(false); }}>X</button>
            </div>
            <div class="panel-content" style={{ display: showAI() ? 'flex' : 'none', "flex-direction": "column", padding: "0", height: "100%" }}>
              
              {/* Message List */}
              <div style={{ flex: 1, padding: "12px", "overflow-y": "auto", display: "flex", "flex-direction": "column", gap: "8px" }}>
                <For each={chatMessages()}>{(msg) => (
                  <div style={{
                    "align-self": msg.sender === "user" ? "flex-end" : "flex-start",
                    background: msg.sender === "user" ? "#238636" : "#21262d",
                    padding: "8px 12px",
                    "border-radius": "6px",
                    "max-width": "85%",
                    color: msg.sender === "user" ? "#fff" : "#c9d1d9",
                    "font-size": "0.8rem"
                  }}>
                    {msg.text}
                  </div>
                )}</For>
              </div>

              {/* Chat Input */}
              <input 
                type="text" 
                value={inputMessage()}
                onInput={(e) => setInputMessage(e.currentTarget.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                onClick={(e) => e.stopPropagation()}
                style={{ background: "#0d1117", border: "1px solid #30363d", padding: "10px", color: "#c9d1d9", margin: "8px", "border-radius": "4px", outline: "none" }} 
                placeholder="Ask AI (Press Enter)..." 
              />
            </div>
            {!showAI() && <div class="collapsed-line" title="Open AI"></div>}
          </div>
        </div>
      </div>

      {/* Layout Switcher */}
      <div class="controls-container">
        <button class="layout-toggle-btn" onClick={() => setIsVerticalSplit(!isVerticalSplit())}>
          ◧ Layout: {isVerticalSplit() ? 'Vertical' : 'Horizontal'}
        </button>
      </div>
    </div>
  );
}

export default App;