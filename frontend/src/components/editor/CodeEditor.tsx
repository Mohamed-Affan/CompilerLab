import React, { useRef, useState } from "react";
import { Copy, Trash2, Check, AlertCircle, Play, Sparkles, Terminal } from "lucide-react";
import { Diagnostic } from "../../types/compiler";

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  diagnostics: Diagnostic[];
  onCompile: () => void;
  activeLine?: number;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  diagnostics,
  onCompile,
  activeLine,
}) => {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lines = code.split("\n");
  const errorLines = new Set(
    diagnostics.filter((d) => d.severity === "error").map((d) => d.line)
  );
  const warningLines = new Set(
    diagnostics.filter((d) => d.severity === "warning").map((d) => d.line)
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onCompile();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;

      textarea.value = val.substring(0, start) + "    " + val.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 4;
      onChange(textarea.value);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (confirm("Clear code editor?")) {
      onChange("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#080d1a] border-r border-[#1e293b]/70 select-none">
      {/* Editor Sub-Header Toolbar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#0a1122] border-b border-[#1e293b] text-xs">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded text-[11px] font-mono text-sky-300 font-semibold">
            <Terminal className="w-3 h-3" />
            <span>SimpleLang Editor</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {lines.length} lines • {code.length} chars
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={onCompile}
            title="Compile code (Ctrl+Enter)"
            className="flex items-center space-x-1 px-2.5 py-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 text-white rounded text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer mr-1"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Run</span>
          </button>
          <button
            onClick={handleCopy}
            title="Copy code"
            className="p-1.5 hover:text-white text-slate-400 rounded hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleClear}
            title="Clear code"
            className="p-1.5 hover:text-rose-400 text-slate-400 rounded hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Main Surface */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Line Gutter */}
        <div className="w-12 bg-[#060a14] py-3 text-right text-slate-600 font-mono text-xs select-none border-r border-[#1e293b]/50 flex flex-col">
          {lines.map((_, idx) => {
            const lineNum = idx + 1;
            const hasError = errorLines.has(lineNum);
            const hasWarning = warningLines.has(lineNum);
            const isActive = activeLine === lineNum;

            return (
              <div
                key={idx}
                className={`h-6 px-1.5 flex items-center justify-end space-x-1 leading-6 ${
                  hasError
                    ? "bg-rose-950/60 text-rose-400 font-bold border-l-2 border-rose-500"
                    : hasWarning
                    ? "bg-amber-950/50 text-amber-400 font-bold border-l-2 border-amber-500"
                    : isActive
                    ? "bg-sky-950/50 text-sky-300 font-bold border-l-2 border-sky-400"
                    : "text-slate-600"
                }`}
              >
                {hasError && <AlertCircle className="w-2.5 h-2.5 text-rose-400 shrink-0" />}
                <span>{lineNum}</span>
              </div>
            );
          })}
        </div>

        {/* Text Area Code Editor */}
        <div className="flex-1 relative overflow-auto bg-[#080d1a]">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            className="w-full h-full p-3 font-mono text-xs leading-6 text-slate-200 bg-transparent resize-none focus:outline-none placeholder-slate-600 selection:bg-sky-500/30 whitespace-pre"
            placeholder="// Enter SimpleLang source code here...
let age : int = 20;
let x : int = age + 5;
print(x);
"
          />
        </div>
      </div>

      {/* Bottom Status Strip */}
      <div className="px-3.5 py-1.5 bg-[#060a14] border-t border-[#1e293b] text-[11px] text-slate-400 flex items-center justify-between font-mono">
        <div className="flex items-center space-x-3">
          <span>SimpleLang (.spl)</span>
          <span>•</span>
          <span>Tab: 4 spaces</span>
          <span>•</span>
          <span>Press Ctrl+Enter to compile</span>
        </div>
        <div className="flex items-center space-x-2">
          {diagnostics.some((d) => d.severity === "error") ? (
            <span className="text-rose-400 font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping mr-1" />
              Errors Detected
            </span>
          ) : (
            <span className="text-emerald-400 font-semibold flex items-center space-x-1">
              <Check className="w-3 h-3" />
              <span>Ready</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
