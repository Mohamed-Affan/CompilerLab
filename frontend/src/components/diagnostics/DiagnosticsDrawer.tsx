import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle, ArrowUpRight, Terminal } from "lucide-react";
import { Diagnostic } from "../../types/compiler";

interface DiagnosticsDrawerProps {
  diagnostics: Diagnostic[];
  onSelectLine: (line: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const DiagnosticsDrawer: React.FC<DiagnosticsDrawerProps> = ({
  diagnostics,
  onSelectLine,
  isOpen,
  onToggle,
}) => {
  const errorCount = diagnostics.filter((d) => d.severity === "error").length;
  const warningCount = diagnostics.filter((d) => d.severity === "warning").length;

  return (
    <div className="bg-[#070b14] border-t border-[#1e293b] select-none flex flex-col transition-all z-20">
      {/* Drawer Header Toggle Bar */}
      <div
        onClick={onToggle}
        className="px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-slate-900/60 transition-colors border-b border-transparent"
      >
        <div className="flex items-center space-x-3 text-xs">
          <span className="font-extrabold text-slate-300 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span>Compiler Diagnostics</span>
          </span>

          <div className="flex items-center space-x-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center space-x-1 ${
                errorCount > 0
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  : "bg-slate-800 text-slate-500 border border-slate-700"
              }`}
            >
              <AlertCircle className="w-3 h-3 mr-1" />
              {errorCount} {errorCount === 1 ? "Error" : "Errors"}
            </span>

            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center space-x-1 ${
                warningCount > 0
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-slate-800 text-slate-500 border border-slate-700"
              }`}
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              {warningCount} {warningCount === 1 ? "Warning" : "Warnings"}
            </span>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-400 hover:text-white">
          {isOpen ? "Hide Diagnostics ▼" : "Show Diagnostics ▲"}
        </span>
      </div>

      {/* Drawer Body */}
      {isOpen && (
        <div className="max-h-44 overflow-y-auto px-4 py-2.5 space-y-2 bg-[#050811] border-t border-[#1e293b]/70">
          {diagnostics.length === 0 ? (
            <div className="flex items-center space-x-2 text-emerald-400 text-xs py-2 font-medium">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Zero syntax or static type errors. All compiler invariant checks successfully passed.</span>
            </div>
          ) : (
            diagnostics.map((d, idx) => {
              const isError = d.severity === "error";
              return (
                <div
                  key={idx}
                  onClick={() => onSelectLine(d.line)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all hover:scale-[1.003] ${
                    isError
                      ? "bg-rose-950/30 border-rose-500/40 text-rose-200 hover:border-rose-400"
                      : "bg-amber-950/30 border-amber-500/40 text-amber-200 hover:border-amber-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span
                        className={`font-mono text-[10px] font-black px-2 py-0.5 rounded ${
                          isError ? "bg-rose-500 text-white" : "bg-amber-500 text-slate-950"
                        }`}
                      >
                        {d.code}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                        {d.stage} stage
                      </span>
                      <span className="font-bold text-white text-xs">{d.message}</span>
                    </div>

                    <div className="flex items-center space-x-1 text-xs font-mono text-slate-400 hover:text-white font-bold">
                      <span>
                        Line {d.line}:{d.column}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {d.suggestion && (
                    <p className="text-xs text-slate-400 mt-1.5 pl-2 border-l-2 border-slate-700">
                      💡 <span className="font-semibold text-slate-300">Suggestion:</span> {d.suggestion}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
