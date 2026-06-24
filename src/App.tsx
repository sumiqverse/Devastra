import { createSignal } from "solid-js";
import "./App.css";

function App() {
  const [showExplorer, setShowExplorer] = createSignal(true);
  const [showTerminal, setShowTerminal] = createSignal(true);
  const [showIDE, setShowIDE] = createSignal(true);
  const [showBrowser, setShowBrowser] = createSignal(true);
  const [showNotes, setShowNotes] = createSignal(true);
  const [showAI, setShowAI] = createSignal(true);
  
  const [isVerticalSplit, setIsVerticalSplit] = createSignal(false); 

  const isRightPanelOpen = () => showNotes() || showAI();
  const isCenterTopOpen = () => showTerminal() || showIDE();

  // --- Right Column Auto-Split Logic ---
  const rightRows = () => {
    if (!showNotes() && !showAI()) return '1fr 1fr';
    return `${showNotes() ? '1fr' : '8px'} ${showAI() ? '1fr' : '8px'}`;
  };

  // --- Center Column Grid Area Logic ---
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
    <div 
      class="workspace-container" 
      style={{ 
        "grid-template-columns": `${showExplorer() ? '20%' : '8px'} 1fr ${isRightPanelOpen() ? '25%' : '8px'}`,
      }}
    >
      {/* --- LEFT COLUMN: EXPLORER --- */}
      <div class="panel-wrapper">
        <div class={`panel ${!showExplorer() ? 'collapsed' : ''}`} onClick={() => !showExplorer() && setShowExplorer(true)}>
          <div class="panel-inner">
            <div class="panel-header">
              <span>KOSH</span>
              <button class="minimize-btn" onClick={(e) => { e.stopPropagation(); setShowExplorer(false); }}>X</button>
            </div>
            <div class="panel-content">
              <ul class="file-tree">
                <li>📂 components</li>
                <li>📄 Apple.tsx</li>
                <li>📄 Layout.tsx</li>
              </ul>
            </div>
          </div>
          <div class="collapsed-line" title="Open Explorer"></div>
        </div>
      </div>

      {/* --- CENTER COLUMN: TERMINAL, EDITOR & BROWSER --- */}
      <div class="column-grid" style={{ 
        "grid-template-columns": isVerticalSplit() ? vertCols() : horizCols(),
        "grid-template-rows": isVerticalSplit() ? vertRows() : horizRows(),
        "grid-template-areas": isVerticalSplit() ? vertAreas : horizAreas,
      }}>
        <div class="panel-wrapper term-wrapper">
          <div class={`panel terminal-panel ${!showTerminal() ? 'collapsed' : ''}`} onClick={() => !showTerminal() && setShowTerminal(true)}>
            <div class="panel-inner">
              <div class="panel-header">
                <span>ASTRA</span>
                <button class="minimize-btn" onClick={(e) => { e.stopPropagation(); setShowTerminal(false); }}>X</button>
              </div>
              <div class="panel-content code-font">
                <span class="text-green">➜</span> <span class="text-blue">[Sumiqverse@kali]</span> <span class="text-gray">~/mac</span> <br/>
                $ bun run dev
              </div>
            </div>
            <div class="collapsed-line" title="Open Terminal"></div>
          </div>
        </div>
        
        <div class="panel-wrapper editor-wrapper">
          <div class={`panel editor-panel ${!showIDE() ? 'collapsed' : ''}`} onClick={() => !showIDE() && setShowIDE(true)}>
            <div class="panel-inner">
              <div class="panel-header">
                <span>KALPANA</span>
                <button class="minimize-btn" onClick={(e) => { e.stopPropagation(); setShowIDE(false); }}>X</button>
              </div>
              <div class="panel-content code-font">
                <span class="text-gray">// Autonomous Agent Architecture</span><br/>
                <span class="text-blue">export const</span> healScript = <span class="text-orange">async</span> () =&gt; {'{'} ... {'}'}
              </div>
            </div>
            <div class="collapsed-line" title="Open Editor"></div>
          </div>
        </div>

        <div class="panel-wrapper browser-wrapper">
          <div class={`panel browser-panel ${!showBrowser() ? 'collapsed' : ''}`} onClick={() => !showBrowser() && setShowBrowser(true)}>
            <div class="panel-inner">
              <div class="panel-header browser-header">
                <div class="address-bar">localhost:3000/dashboard</div>
                <button class="minimize-btn" onClick={(e) => { e.stopPropagation(); setShowBrowser(false); }}>X</button>
              </div>
              <div class="panel-content browser-viewport">
                <div class="preview-placeholder">Live Render</div>
              </div>
            </div>
            <div class="collapsed-line" title="Open Browser"></div>
          </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN: NOTES & AI --- */}
      <div class="column-grid" style={{ 
        "grid-template-rows": rightRows(), 
      }}>
        <div class="panel-wrapper">
          <div class={`panel ${!showNotes() ? 'collapsed' : ''}`} onClick={() => !showNotes() && setShowNotes(true)}>
            <div class="panel-inner">
              <div class="panel-header">
                <span>SHRUTI</span>
                <button class="minimize-btn" onClick={(e) => { e.stopPropagation(); setShowNotes(false); }}>X</button>
              </div>
              <div class="panel-content">...</div>
            </div>
            <div class="collapsed-line" title="Open Notes"></div>
          </div>
        </div>
        
        <div class="panel-wrapper">
          <div class={`panel ${!showAI() ? 'collapsed' : ''}`} onClick={() => !showAI() && setShowAI(true)}>
            <div class="panel-inner">
              <div class="panel-header">
                <span>PRAGYA</span>
                <button class="minimize-btn" onClick={(e) => { e.stopPropagation(); setShowAI(false); }}>X</button>
              </div>
              <div class="panel-content">...</div>
            </div>
            <div class="collapsed-line" title="Open AI"></div>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <div class="controls-container">
        <button 
          class="layout-toggle-btn" 
          onClick={() => setIsVerticalSplit(!isVerticalSplit())}
        >
          ◧ Layout: {isVerticalSplit() ? 'Vertical' : 'Horizontal'}
        </button>
      </div>
    </div>
  );
}

export default App;