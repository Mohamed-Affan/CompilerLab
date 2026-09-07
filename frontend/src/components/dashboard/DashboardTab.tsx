import React from "react";
import { CompilationResult } from "../../types/compiler";
import { Activity, Layers, Database, ShieldCheck, Sparkles, Cpu, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

interface DashboardTabProps {
  lastResult?: CompilationResult;
  onOpenStudio: (stage?: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ lastResult, onOpenStudio }) => {
  const summary = lastResult?.summary || {
    tokens_count: lastResult?.tokens.length || 0,
    ast_nodes_count: lastResult?.ast_node_count || 0,
    symbols_count: lastResult?.symbol_table.length || 0,
    errors_count: lastResult?.diagnostics.filter((d) => d.severity === "error").length || 0,
    warnings_count: lastResult?.diagnostics.filter((d) => d.severity === "warning").length || 0,
    tac_instructions_count: lastResult?.tac_instructions.length || 0,
    optimizations_count: lastResult?.optimization?.passes_applied.length || 0,
    target_instructions_count: lastResult?.target_code.length || 0,
  };

  const stageCards = [
    { id: "lexer", title: "Lexical Analyzer", desc: "DFA token scanning & token stream breakdown", icon: Layers, color: "text-pink-400" },
    { id: "parser", title: "Syntax Parser", desc: "Recursive descent parsing & grammar verification", icon: Activity, color: "text-sky-400" },
    { id: "ast", title: "Abstract Syntax Tree", desc: "Interactive tree hierarchy with type decorations", icon: Activity, color: "text-cyan-400" },
    { id: "symbols", title: "Symbol Table", desc: "Scoped identifier bindings & scope hierarchy", icon: Database, color: "text-purple-400" },
    { id: "semantic", title: "Type Checker", desc: "Static type compatibility & error prevention", icon: ShieldCheck, color: "text-emerald-400" },
    { id: "ir", title: "Intermediate Code", desc: "Three-address code, quadruples & backpatching", icon: Sparkles, color: "text-amber-400" },
    { id: "optimizer", title: "Code Optimizer", desc: "Constant folding, propagation & peephole passes", icon: Sparkles, color: "text-emerald-300" },
    { id: "codegen", title: "Target Virtual Machine", desc: "Assembly instructions, next-use & stack frames", icon: Cpu, color: "text-blue-400" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] p-6 space-y-6 overflow-y-auto select-none">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-950/40 via-indigo-950/20 to-slate-900 border border-sky-500/30 p-6 rounded-2xl flex items-center justify-between shadow-xl">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="bg-sky-500 text-white font-extrabold text-[10px] tracking-wider px-2 py-0.5 rounded uppercase">
              CSA1405 Workbench
            </span>
            <span className="text-emerald-400 text-xs font-mono font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Compiler Engine Active</span>
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">CompilerLab Architecture Overview</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            An interactive educational compiler workbench for lexical analysis, recursive descent syntax analysis, scoped symbol tables, static type checking, TAC intermediate code, and target optimizations.
          </p>
        </div>

        <button
          onClick={() => onOpenStudio()}
          className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-sky-500/25 transition-all active:scale-95 cursor-pointer"
        >
          <span>Open Compiler Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Latest Compilation Metrics */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Latest Compilation Pipeline Status
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-[#090d16] border border-[#1e293b] p-3 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Tokens</span>
            <span className="text-lg font-mono font-bold text-sky-400">{summary.tokens_count}</span>
          </div>
          <div className="bg-[#090d16] border border-[#1e293b] p-3 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">AST Nodes</span>
            <span className="text-lg font-mono font-bold text-indigo-400">{summary.ast_nodes_count}</span>
          </div>
          <div className="bg-[#090d16] border border-[#1e293b] p-3 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Symbols</span>
            <span className="text-lg font-mono font-bold text-purple-400">{summary.symbols_count}</span>
          </div>
          <div className="bg-[#090d16] border border-[#1e293b] p-3 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">TAC Instrs</span>
            <span className="text-lg font-mono font-bold text-amber-400">{summary.tac_instructions_count}</span>
          </div>
          <div className="bg-[#090d16] border border-[#1e293b] p-3 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Optimizations</span>
            <span className="text-lg font-mono font-bold text-emerald-400">{summary.optimizations_count}</span>
          </div>
          <div className="bg-[#090d16] border border-[#1e293b] p-3 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Diagnostics</span>
            <span
              className={`text-lg font-mono font-bold ${
                summary.errors_count > 0 ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              {summary.errors_count} Errors
            </span>
          </div>
        </div>
      </div>

      {/* Compiler Phase Quick Launch Grid */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Compiler Pipeline Stages
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stageCards.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.id}
                onClick={() => onOpenStudio(stage.id)}
                className="bg-[#090d16] border border-[#1e293b] p-4 rounded-xl flex flex-col justify-between hover:border-sky-500/50 transition-all hover:scale-[1.01] cursor-pointer group shadow-sm"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center mb-3">
                    <Icon className={`w-4 h-4 ${stage.color}`} />
                  </div>
                  <h4 className="font-bold text-white text-xs group-hover:text-sky-300 transition-colors">
                    {stage.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{stage.desc}</p>
                </div>
                <div className="flex items-center space-x-1 text-[11px] text-sky-400 font-semibold mt-4">
                  <span>Inspect Stage</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
