import React from "react";
import { CompilationResult } from "../../types/compiler";
import {
  Layers,
  Database,
  ShieldCheck,
  Sparkles,
  Cpu,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Code2,
  GitCommit,
  GitMerge,
  FileCheck,
  Terminal
} from "lucide-react";

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
    { id: "lexer", title: "1. Lexical Scanner", unit: "Unit I", desc: "DFA token scanner, lexeme stream & regex categories", icon: Layers, color: "text-pink-400" },
    { id: "parser", title: "2. Syntax Parser", unit: "Unit II", desc: "Top-down recursive descent parser & CFG grammar rules", icon: GitCommit, color: "text-sky-400" },
    { id: "ast", title: "3. AST Visualizer", unit: "Unit II", desc: "2D interactive SVG hierarchical syntax tree with type tags", icon: GitMerge, color: "text-cyan-400" },
    { id: "symbols", title: "4. Symbol Table", unit: "Unit III", desc: "Scoped identifier bindings, levels & memory layout", icon: Database, color: "text-purple-400" },
    { id: "semantic", title: "5. Semantic Checker", unit: "Unit III", desc: "Static type inference, compatibility & error diagnosis", icon: ShieldCheck, color: "text-emerald-400" },
    { id: "ir", title: "6. Intermediate Code", unit: "Unit IV", desc: "Three-address code (TAC), quadruples, triples & backpatching", icon: Code2, color: "text-amber-400" },
    { id: "optimizer", title: "7. Code Optimizer", unit: "Unit V", desc: "Constant folding, propagation, algebraic simplification & diff", icon: Sparkles, color: "text-emerald-300" },
    { id: "flowgraph", title: "8. CFG Flow Graph", unit: "Unit V", desc: "Basic blocks (B1..Bn) with leaders & branching transitions", icon: GitMerge, color: "text-blue-400" },
    { id: "codegen", title: "9. Target Virtual Machine", unit: "Unit V", desc: "Assembly instructions, next-use liveness & 3D stack frames", icon: Cpu, color: "text-indigo-400" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#080d1a] p-6 space-y-6 overflow-y-auto select-none">
      {/* Top Cyber Hero Banner */}
      <div className="bg-gradient-to-r from-sky-950/60 via-indigo-950/40 to-[#090d18] border border-cyan-500/30 p-6 rounded-2xl flex items-center justify-between shadow-2xl relative overflow-hidden">
        <div className="space-y-1.5 max-w-2xl z-10">
          <div className="flex items-center space-x-2">
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-[10px] tracking-wider px-2.5 py-0.5 rounded-full uppercase shadow-md shadow-cyan-500/30">
              CSA1405 Workbench
            </span>
            <span className="text-emerald-400 text-xs font-mono font-bold flex items-center space-x-1 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full Pipeline Engine Live</span>
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">CompilerLab System Architecture</h2>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            A state-of-the-art visual compiler laboratory and IDE executing real compilation algorithms: Lexer, Parser, AST, Symbol Table, Static Type Checking, TAC IR, Optimization Passes, and Target VM Code Generation.
          </p>
        </div>

        <button
          onClick={() => onOpenStudio()}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold px-6 py-3 rounded-xl text-xs flex items-center space-x-2 shadow-xl shadow-cyan-500/30 transition-all active:scale-95 cursor-pointer z-10"
        >
          <span>Launch Compiler Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Real-time Compiler Metrics */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Live Compilation Metrics & Statistics
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-[#0b101d] border border-[#1e293b] p-3.5 rounded-xl shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Tokens Scanned</span>
            <span className="text-xl font-mono font-black text-sky-400">{summary.tokens_count}</span>
          </div>
          <div className="bg-[#0b101d] border border-[#1e293b] p-3.5 rounded-xl shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">AST Nodes</span>
            <span className="text-xl font-mono font-black text-indigo-400">{summary.ast_nodes_count}</span>
          </div>
          <div className="bg-[#0b101d] border border-[#1e293b] p-3.5 rounded-xl shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Scoped Symbols</span>
            <span className="text-xl font-mono font-black text-purple-400">{summary.symbols_count}</span>
          </div>
          <div className="bg-[#0b101d] border border-[#1e293b] p-3.5 rounded-xl shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">TAC Instructions</span>
            <span className="text-xl font-mono font-black text-amber-400">{summary.tac_instructions_count}</span>
          </div>
          <div className="bg-[#0b101d] border border-[#1e293b] p-3.5 rounded-xl shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Optimizations</span>
            <span className="text-xl font-mono font-black text-emerald-400">{summary.optimizations_count}</span>
          </div>
          <div className="bg-[#0b101d] border border-[#1e293b] p-3.5 rounded-xl shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Diagnostics</span>
            <span
              className={`text-xl font-mono font-black ${
                summary.errors_count > 0 ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              {summary.errors_count} Errors
            </span>
          </div>
        </div>
      </div>

      {/* Compiler Phase Cards Grid */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Compiler Pipeline Stage Workbenches
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {stageCards.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.id}
                onClick={() => onOpenStudio(stage.id)}
                className="bg-[#0b101d] border border-[#1e293b] p-4 rounded-xl flex flex-col justify-between hover:border-cyan-500/60 transition-all hover:scale-[1.01] cursor-pointer group shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${stage.color}`} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono">
                      {stage.unit}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs group-hover:text-cyan-300 transition-colors">
                    {stage.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{stage.desc}</p>
                </div>
                <div className="flex items-center space-x-1 text-[11px] text-cyan-400 font-bold mt-4">
                  <span>Inspect Phase</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
