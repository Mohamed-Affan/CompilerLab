import React from "react";
import {
  Play,
  Flame,
  RefreshCw,
  Layers,
  BookOpen,
  HelpCircle,
  Activity,
  Sparkles,
  Cpu,
  Binary,
  Code2,
  CheckCircle2,
  Terminal,
  Compass
} from "lucide-react";
import { ExampleProgram } from "../../types/compiler";

interface HeaderProps {
  status: "ready" | "compiling" | "success" | "error";
  onCompile: () => void;
  onReset: () => void;
  onBreakIt: () => void;
  examples: ExampleProgram[];
  selectedExampleId: string;
  onSelectExample: (ex: ExampleProgram) => void;
  activeView: "studio" | "parser_lab" | "type_explorer" | "learning_lab" | "quiz" | "dashboard";
  onSelectView: (view: "studio" | "parser_lab" | "type_explorer" | "learning_lab" | "quiz" | "dashboard") => void;
  optimizationsEnabled: boolean;
  onToggleOptimizations: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  onCompile,
  onReset,
  onBreakIt,
  examples,
  selectedExampleId,
  onSelectExample,
  activeView,
  onSelectView,
  optimizationsEnabled,
  onToggleOptimizations,
}) => {
  return (
    <header className="bg-[#090d18]/95 backdrop-blur-md border-b border-[#1e293b] px-4 py-2.5 flex items-center justify-between select-none z-30 shadow-lg">
      {/* Left: Branding & Status Tag */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-400/40">
            <Layers className="w-5 h-5 text-white" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#090d18]"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-base tracking-tight text-white flex items-center">
                Compiler<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Lab</span>
              </span>
              <span className="text-[10px] uppercase font-extrabold tracking-wider bg-sky-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full shadow-inner">
                CSA1405
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5 font-medium">
              Interactive Compiler Analysis & Optimization Workbench
            </p>
          </div>
        </div>

        {/* View Switcher Pills */}
        <nav className="hidden xl:flex items-center space-x-1 ml-4 bg-[#050811] p-1 rounded-xl border border-[#1e293b]/80">
          <button
            onClick={() => onSelectView("studio")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all tab-btn ${
              activeView === "studio"
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Studio</span>
          </button>
          <button
            onClick={() => onSelectView("dashboard")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all tab-btn ${
              activeView === "dashboard"
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => onSelectView("parser_lab")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all tab-btn ${
              activeView === "parser_lab"
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Parser Lab</span>
          </button>
          <button
            onClick={() => onSelectView("type_explorer")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all tab-btn ${
              activeView === "type_explorer"
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            <span>Type System</span>
          </button>
          <button
            onClick={() => onSelectView("learning_lab")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all tab-btn ${
              activeView === "learning_lab"
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Learning Lab</span>
          </button>
          <button
            onClick={() => onSelectView("quiz")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all tab-btn ${
              activeView === "quiz"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/30"
                : "text-amber-400 hover:text-amber-200 hover:bg-amber-950/40"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Quiz Arena</span>
          </button>
        </nav>
      </div>

      {/* Right: Controls, Examples Dropdown & Compile Button */}
      <div className="flex items-center space-x-2.5">
        {/* Optimizer Switch */}
        <button
          onClick={onToggleOptimizations}
          title="Toggle Compiler Optimization Passes (Unit V)"
          className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
            optimizationsEnabled
              ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300 shadow-sm shadow-emerald-500/20"
              : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Optimizer: {optimizationsEnabled ? "ON" : "OFF"}</span>
        </button>

        {/* Examples Selector */}
        <select
          value={selectedExampleId}
          onChange={(e) => {
            const ex = examples.find((x) => x.id === e.target.value);
            if (ex) onSelectExample(ex);
          }}
          className="bg-[#050811] text-xs font-medium text-slate-200 border border-[#1e293b] rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer shadow-inner"
        >
          <optgroup label="✅ Valid Syllabus Programs">
            {examples
              .filter((x) => x.category === "valid")
              .map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
          </optgroup>
          <optgroup label="❌ Syllabus Error Scenarios">
            {examples
              .filter((x) => x.category === "error")
              .map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
          </optgroup>
        </select>

        {/* Break It Error Injector */}
        <button
          onClick={onBreakIt}
          title="Introduce an Error (Educational Demonstration Mode)"
          className="flex items-center space-x-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden md:inline">Break It</span>
        </button>

        {/* Reset Button */}
        <button
          onClick={onReset}
          title="Reset to Default Code"
          className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 p-2 rounded-lg text-xs border border-slate-700 transition-all active:scale-95 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {/* Hero Compile Button */}
        <button
          onClick={onCompile}
          disabled={status === "compiling"}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-extrabold px-4 py-2 rounded-lg text-xs shadow-lg shadow-cyan-500/30 transition-all active:scale-95 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{status === "compiling" ? "Compiling..." : "Compile"}</span>
          <span className="hidden sm:inline bg-black/20 text-cyan-100 text-[10px] px-1.5 py-0.5 rounded font-mono">
            Ctrl+↵
          </span>
        </button>
      </div>
    </header>
  );
};
