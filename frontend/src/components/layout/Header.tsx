import React from "react";
import { Play, Flame, RefreshCw, Layers, BookOpen, HelpCircle, Activity, Sparkles } from "lucide-react";
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
    <header className="bg-[#0f172a] border-b border-[#1e293b] px-4 py-2.5 flex items-center justify-between select-none z-30">
      {/* Left: Branding & Course Tag */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight text-white">CompilerLab</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30 px-1.5 py-0.5 rounded">
                CSA1405
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5">
              Interactive Compiler Analysis & Optimization Workbench
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="hidden lg:flex items-center space-x-1 ml-6 bg-[#090d16] p-1 rounded-lg border border-[#1e293b]">
          <button
            onClick={() => onSelectView("studio")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeView === "studio"
                ? "bg-sky-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            Compiler Studio
          </button>
          <button
            onClick={() => onSelectView("dashboard")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeView === "dashboard"
                ? "bg-sky-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectView("parser_lab")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeView === "parser_lab"
                ? "bg-sky-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            Parser Lab
          </button>
          <button
            onClick={() => onSelectView("type_explorer")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeView === "type_explorer"
                ? "bg-sky-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            Type System
          </button>
          <button
            onClick={() => onSelectView("learning_lab")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeView === "learning_lab"
                ? "bg-sky-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            Learning Lab
          </button>
          <button
            onClick={() => onSelectView("quiz")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeView === "quiz"
                ? "bg-amber-500 text-slate-950 font-semibold shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            Quiz Mode
          </button>
        </nav>
      </div>

      {/* Right: Controls, Examples & Compile Button */}
      <div className="flex items-center space-x-2.5">
        {/* Optimization Toggle */}
        <button
          onClick={onToggleOptimizations}
          title="Toggle Compiler Optimization Passes (Unit V)"
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 text-xs rounded-md border transition-all ${
            optimizationsEnabled
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-slate-800/40 border-slate-700 text-slate-400"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Optimizer: {optimizationsEnabled ? "ON" : "OFF"}</span>
        </button>

        {/* Examples Dropdown */}
        <select
          value={selectedExampleId}
          onChange={(e) => {
            const ex = examples.find((x) => x.id === e.target.value);
            if (ex) onSelectExample(ex);
          }}
          className="bg-[#090d16] text-xs text-slate-200 border border-[#1e293b] rounded-md px-2.5 py-1.5 focus:outline-none focus:border-sky-500 cursor-pointer"
        >
          <optgroup label="Valid Syllabus Programs">
            {examples
              .filter((x) => x.category === "valid")
              .map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
          </optgroup>
          <optgroup label="Syllabus Error Programs">
            {examples
              .filter((x) => x.category === "error")
              .map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
          </optgroup>
        </select>

        {/* Break It Error Injector Button */}
        <button
          onClick={onBreakIt}
          title="Introduce an Error (Educational Mode)"
          className="flex items-center space-x-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all shadow-sm active:scale-95"
        >
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">Break It</span>
        </button>

        {/* Reset Button */}
        <button
          onClick={onReset}
          title="Reset Source Code"
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded-md text-xs border border-slate-700 transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Compile Hero Button */}
        <button
          onClick={onCompile}
          disabled={status === "compiling"}
          className="flex items-center space-x-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-50 text-white font-semibold px-4 py-1.5 rounded-md text-xs shadow-lg shadow-sky-500/25 transition-all active:scale-95 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{status === "compiling" ? "Compiling..." : "Compile (Ctrl+Enter)"}</span>
        </button>
      </div>
    </header>
  );
};
