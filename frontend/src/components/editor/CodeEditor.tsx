import React, { useRef, useEffect } from "react";
import { Copy, Trash2, Check, AlertCircle } from "lucide-react";
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
  const [copied, setCopied] = React.useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lines = code.split("\n");
  const errorLines = new Set(
    diagnostics.filter((d) => d.severity === "error").map((d) => d.line)
  );
  const warningLines = new Set(
    diagnostics.filter((d) => d.severity === "warning").map((d) => d.line)
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl + Enter to Compile
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onCompile();
      return;
    }

    // Handle Tab key
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
    if (confirm("Clear the editor?")) {
      onChange("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] border-r border-[#1e293b] select-none">
      {/* Editor Top Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#090d16] border-b border-[#1e293b] text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-sky-400 font-semibold">SimpleLang (.spl)</span>
          <span className="text-[10px] text-slate-500">
            {lines.length} lines • {code.length} chars
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleCopy}
            title="Copy source code"
            className="p-1 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleClear}
            title="Clear editor"
            className="p-1 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Core */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Line Numbers & Error Gutter */}
        <div className="w-12 bg-[#090d16] py-3 text-right text-slate-600 font-mono text-xs select-none border-r border-[#1e293b]/60 flex flex-col">
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
                    ? "bg-rose-950/40 text-rose-400 font-bold"
                    : hasWarning
                    ? "bg-amber-950/40 text-amber-400"
                    : isActive
                    ? "bg-sky-950/40 text-sky-300 font-bold"
                    : "text-slate-600"
                }`}
              >
                {hasError && <AlertCircle className="w-2.5 h-2.5 text-rose-400 shrink-0" />}
                <span>{lineNum}</span>
              </div>
            );
          })}
        </div>

        {/* Textarea Code Input */}
        <div className="flex-1 relative overflow-auto">
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

      {/* Editor Status Bar */}
      <div className="px-3 py-1 bg-[#090d16] border-t border-[#1e293b] text-[11px] text-slate-500 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span>UTF-8</span>
          <span>SimpleLang CFG</span>
          <span>Tab: 4 spaces</span>
        </div>
        <div className="flex items-center space-x-2">
          {diagnostics.some((d) => d.severity === "error") ? (
            <span className="text-rose-400 font-semibold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping mr-1" />
              Syntax/Type Diagnostics Present
            </span>
          ) : (
            <span className="text-emerald-400">Ready</span>
          )}
        </div>
      </div>
    </div>
  );
};
