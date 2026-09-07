import React from "react";
import { ShieldCheck, CheckCircle, XCircle, AlertTriangle, ArrowRight, Zap } from "lucide-react";
import { Diagnostic } from "../../types/compiler";

interface SemanticTabProps {
  semanticReport: Record<string, any>;
  diagnostics: Diagnostic[];
}

export const SemanticTab: React.FC<SemanticTabProps> = ({ semanticReport, diagnostics }) => {
  const semanticDiags = diagnostics.filter((d) => d.stage === "semantic" || d.stage === "type");
  const logs = semanticReport?.logs || [];

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] p-4 space-y-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Static Type Checking & Semantic Analyzer (Unit III)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Verifies assignment compatibility, binary expression type inference, parameter matching, and return types.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1 rounded">
            Type Checks Performed: {logs.length}
          </span>
        </div>
      </div>

      {/* Semantic Diagnostics Overview */}
      {semanticDiags.length > 0 && (
        <div className="bg-[#090d16] border border-rose-500/30 p-3 rounded-lg space-y-2">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block">
            Semantic & Type Violations ({semanticDiags.length})
          </span>
          <div className="space-y-1.5">
            {semanticDiags.map((d, idx) => (
              <div
                key={idx}
                className="bg-rose-950/20 border border-rose-500/20 p-2.5 rounded text-xs font-mono flex items-start space-x-2"
              >
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded font-bold text-[10px]">
                      {d.code}
                    </span>
                    <span className="font-semibold text-white">{d.message}</span>
                    <span className="text-slate-500 text-[10px]">Line {d.line}</span>
                  </div>
                  {d.suggestion && (
                    <p className="text-slate-400 text-[11px] mt-1">💡 {d.suggestion}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Type Checking Audit Trail */}
      <div className="border border-[#1e293b] rounded-lg bg-[#090d16] p-4 flex-1 overflow-auto">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-3 flex items-center space-x-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Type Evaluation & Compatibility Audit Trail</span>
        </span>

        {logs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No type operations logged.
          </div>
        ) : (
          <div className="space-y-2 font-mono text-xs">
            {logs.map((log: any, idx: number) => {
              const isBinary = log.check === "binary_op";
              const isAssign = log.check === "assignment_compatibility" || log.check === "variable_declaration_init";

              return (
                <div
                  key={idx}
                  className="bg-[#0f172a] border border-[#1e293b] p-2.5 rounded-lg flex items-center justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-500 text-[10px]">#{idx + 1}</span>

                    {isBinary ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400 text-[11px]">Binary Op</span>
                        <span className="bg-slate-900 px-1.5 py-0.5 rounded text-sky-300 font-bold">
                          {log.left}
                        </span>
                        <span className="text-amber-400 font-bold">{log.op}</span>
                        <span className="bg-slate-900 px-1.5 py-0.5 rounded text-sky-300 font-bold">
                          {log.right}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                        <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-800">
                          {log.result}
                        </span>
                      </div>
                    ) : isAssign ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400 text-[11px]">
                          {log.check === "variable_declaration_init" ? "Var Decl Init" : "Assignment"}
                        </span>
                        <span className="text-purple-300 font-bold">{log.var}</span>
                        <span className="text-slate-500">(expected: {log.declared || log.expected})</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                        <span className="text-slate-300">received: {log.received}</span>
                      </div>
                    ) : (
                      <span className="text-slate-300">{JSON.stringify(log)}</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-500">Line {log.line}</span>
                    {log.valid !== false ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
