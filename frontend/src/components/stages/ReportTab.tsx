import React from "react";
import { CompilationResult } from "../../types/compiler";
import { FileCheck, CheckCircle2, XCircle, Clock, Award, Shield, FileDown } from "lucide-react";

interface ReportTabProps {
  result: CompilationResult;
}

export const ReportTab: React.FC<ReportTabProps> = ({ result }) => {
  const summary = result.summary || {
    tokens_count: result.tokens.length,
    ast_nodes_count: result.ast_node_count,
    symbols_count: result.symbol_table.length,
    errors_count: result.diagnostics.filter((d) => d.severity === "error").length,
    warnings_count: result.diagnostics.filter((d) => d.severity === "warning").length,
    tac_instructions_count: result.tac_instructions.length,
    optimizations_count: result.optimization?.passes_applied.length || 0,
    target_instructions_count: result.target_code.length,
  };

  const handleDownload = () => {
    const reportText = `=====================================================
COMPILERLAB — MASTER COMPILATION REPORT (CSA1405)
=====================================================
Status: ${result.success ? "SUCCESS" : "FAILED"}
Failed Stage: ${result.failed_stage || "None"}

--- METRICS SUMMARY ---
Tokens Scanned: ${summary.tokens_count}
AST Nodes: ${summary.ast_nodes_count}
Symbols Defined: ${summary.symbols_count}
Errors: ${summary.errors_count}
Warnings: ${summary.warnings_count}
TAC Instructions: ${summary.tac_instructions_count}
Optimizations Applied: ${summary.optimizations_count}
Target Instructions: ${summary.target_instructions_count}

--- STAGE TIMINGS ---
${result.timings.map((t) => `${t.stage.padEnd(20)}: ${t.duration_ms} ms (${t.status})`).join("\n")}

--- DIAGNOSTICS ---
${
  result.diagnostics.length === 0
    ? "No diagnostics."
    : result.diagnostics.map((d) => `[${d.severity.toUpperCase()}] ${d.code} at Line ${d.line}:${d.column} — ${d.message}`).join("\n")
}
=====================================================`;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compilerlab_report_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] p-4 space-y-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-sky-400" />
            <span>Master Compilation & Academic Verification Report</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Full end-to-end report verifying pipeline phases from Lexer through Code Generation.
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center space-x-1.5 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 px-3 py-1.5 rounded-md text-xs font-semibold transition-all active:scale-95 cursor-pointer"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Export Report (.txt)</span>
        </button>
      </div>

      {/* Hero Status Banner */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between ${
          result.success
            ? "bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-slate-900 border-emerald-500/40 text-emerald-200"
            : "bg-gradient-to-r from-rose-950/40 via-rose-900/20 to-slate-900 border-rose-500/40 text-rose-200"
        }`}
      >
        <div className="flex items-center space-x-3">
          {result.success ? (
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-rose-500/20 border border-rose-500/50 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-rose-400" />
            </div>
          )}
          <div>
            <h4 className="text-base font-bold text-white">
              {result.success ? "Compilation Succeeded (100% Pipeline Verified)" : `Compilation Halted at ${result.failed_stage}`}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {result.success
                ? "All Lexical, Syntax, Static Type Checking, TAC, Optimization, and Target Assembly stages completed."
                : `Pipeline safety stop triggered due to diagnostics in ${result.failed_stage}.`}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-semibold text-slate-500 block">Total Pipeline Duration</span>
          <span className="text-sm font-mono font-bold text-sky-400">
            {result.timings.reduce((acc, t) => acc + t.duration_ms, 0).toFixed(2)} ms
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#090d16] border border-[#1e293b] p-3 rounded-lg">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Tokens Scanned</span>
          <span className="text-lg font-mono font-extrabold text-white">{summary.tokens_count}</span>
        </div>
        <div className="bg-[#090d16] border border-[#1e293b] p-3 rounded-lg">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">AST Nodes</span>
          <span className="text-lg font-mono font-extrabold text-sky-400">{summary.ast_nodes_count}</span>
        </div>
        <div className="bg-[#090d16] border border-[#1e293b] p-3 rounded-lg">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Scoped Symbols</span>
          <span className="text-lg font-mono font-extrabold text-purple-400">{summary.symbols_count}</span>
        </div>
        <div className="bg-[#090d16] border border-[#1e293b] p-3 rounded-lg">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Target Instructions</span>
          <span className="text-lg font-mono font-extrabold text-emerald-400">{summary.target_instructions_count}</span>
        </div>
      </div>

      {/* Stage Timings Breakdown */}
      <div className="bg-[#090d16] border border-[#1e293b] p-4 rounded-lg space-y-2">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2 flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span>Stage Execution Breakdown (Local Processing Time)</span>
        </span>

        <div className="space-y-1.5 font-mono text-xs">
          {result.timings.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#0f172a] border border-[#1e293b] px-3 py-2 rounded flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    t.status === "success" ? "bg-emerald-400" : "bg-rose-400 animate-pulse"
                  }`}
                />
                <span className="text-slate-200 font-semibold">{t.stage}</span>
              </div>
              <span className="text-sky-300 font-bold">{t.duration_ms} ms</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
