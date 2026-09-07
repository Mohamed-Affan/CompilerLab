import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle, Info, ArrowUpRight } from "lucide-react";
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
    <div className="bg-[#090d16] border-t border-[#1e293b] select-none flex flex-col transition-all">
      {/* Drawer Header Toggle */}
      <div
        onClick={onToggle}
        className="px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-slate-900/60 transition-colors"
      >
        <div className="flex items-center space-x-3 text-xs">
          <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
            Compiler Diagnostics
          </span>
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1 ${
                errorCount > 0 ? "bg-rose-500/20 text-rose-400 border border-rose-500/40" : "bg-slate-800 text-slate-500"
              }`}
            >
              <AlertCircle className="w-3 h-3 mr-1" />
              {errorCount} {errorCount === 1 ? "Error" : "Errors"}
            </span>

            <span
              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1 ${
                warningCount > 0 ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" : "bg-slate-800 text-slate-500"
              }`}
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              {warningCount} {warningCount === 1 ? "Warning" : "Warnings"}
            </span>
          </div>
        </div>

        <span className="text-xs text-slate-500">{isOpen ? "Hide Diagnostics ▼" : "Show Diagnostics ▲"}</span>
      </div>

      {/* Drawer Body */}
      {isOpen && (
        <div className="max-h-48 overflow-y-auto px-4 py-2 space-y-2 border-t border-[#1e293b]/60">
          {diagnostics.length === 0 ? (
            <div className="flex items-center space-x-2 text-emerald-400 text-xs py-2">
              <CheckCircle className="w-4 h-4" />
              <span>No syntax or type errors detected. Ready for intermediate code generation and optimization.</span>
            </div>
          ) : (
            diagnostics.map((d, idx) => {
              const isError = d.severity === "error";
              return (
                <div
                  key={idx}
                  onClick={() => onSelectLine(d.line)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all hover:scale-[1.005] ${
                    isError
                      ? "bg-rose-950/20 border-rose-500/30 text-rose-200 hover:border-rose-400"
                      : "bg-amber-950/20 border-amber-500/30 text-amber-200 hover:border-amber-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isError ? "bg-rose-500 text-white" : "bg-amber-500 text-slate-950"
                        }`}
                      >
                        {d.code}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        {d.stage} stage
                      </span>
                      <span className="font-semibold text-white">{d.message}</span>
                    </div>

                    <div className="flex items-center space-x-1 text-[11px] font-mono text-slate-400 hover:text-white">
                      <span>
                        Line {d.line}:{d.column}
                      </span>
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>

                  {d.suggestion && (
                    <p className="text-[11px] text-slate-400 mt-1 pl-1 border-l-2 border-slate-700">
                      💡 <span className="font-medium text-slate-300">Suggestion:</span> {d.suggestion}
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
