import React, { useState, useEffect } from "react";
import { compilerApi } from "../../api/compilerApi";
import { GitCommit, Play, RotateCcw, ArrowRight, CheckCircle2, Layers } from "lucide-react";

export const ParserLab: React.FC = () => {
  const [parserType, setParserType] = useState<"shift_reduce" | "ll1" | "slr1">("shift_reduce");
  const [expression, setExpression] = useState("id + id * id");
  const [simulationData, setSimulationData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const runSimulation = async (type = parserType, expr = expression) => {
    setLoading(true);
    try {
      const data = await compilerApi.simulateParserLab(type, expr);
      setSimulationData(data);
      setCurrentStepIdx(data.steps.length - 1); // default to end, but can step through
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation(parserType, expression);
  }, [parserType]);

  const steps = simulationData?.steps || [];
  const visibleSteps = steps.slice(0, currentStepIdx + 1);

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] p-4 space-y-4 overflow-y-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-bold tracking-wider text-sky-400 bg-sky-950/60 border border-sky-800 px-2 py-0.5 rounded">
              Educational Simulator • Unit II
            </span>
            <h2 className="text-base font-bold text-white">Parser Demonstration Lab</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Step-by-step stack & input buffer simulation for syllabus parsing strategies.
          </p>
        </div>

        {/* Strategy Selector */}
        <div className="flex items-center space-x-1 bg-[#090d16] p-1 rounded-lg border border-[#1e293b]">
          <button
            onClick={() => {
              setParserType("shift_reduce");
              setExpression("id + id * id");
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              parserType === "shift_reduce"
                ? "bg-sky-500 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Shift-Reduce (Bottom-Up)
          </button>
          <button
            onClick={() => {
              setParserType("ll1");
              setExpression("id + id");
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              parserType === "ll1"
                ? "bg-sky-500 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Predictive LL(1) (Top-Down)
          </button>
          <button
            onClick={() => {
              setParserType("slr1");
              setExpression("id + id");
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              parserType === "slr1"
                ? "bg-sky-500 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            SLR(1) LR Parser
          </button>
        </div>
      </div>

      {/* Input & Step-By-Step Controls Bar */}
      <div className="bg-[#090d16] border border-[#1e293b] p-3 rounded-lg flex items-center justify-between space-x-3">
        <div className="flex items-center space-x-2 flex-1">
          <span className="text-xs text-slate-400 font-semibold font-mono">Input Stream:</span>
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            className="bg-[#0f172a] border border-[#1e293b] rounded px-3 py-1 text-xs font-mono text-sky-300 flex-1 max-w-md focus:outline-none focus:border-sky-500"
          />
          <button
            onClick={() => runSimulation(parserType, expression)}
            className="bg-sky-500 hover:bg-sky-400 text-white px-3 py-1 rounded text-xs font-semibold flex items-center space-x-1 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simulate</span>
          </button>
        </div>

        {/* Step-by-Step Stepper */}
        {steps.length > 0 && (
          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="text-slate-500">
              Step {currentStepIdx + 1} of {steps.length}
            </span>
            <button
              onClick={() => setCurrentStepIdx(Math.max(0, currentStepIdx - 1))}
              disabled={currentStepIdx === 0}
              className="bg-slate-800 disabled:opacity-40 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentStepIdx(Math.min(steps.length - 1, currentStepIdx + 1))}
              disabled={currentStepIdx === steps.length - 1}
              className="bg-sky-600 disabled:opacity-40 hover:bg-sky-500 text-white px-2 py-1 rounded font-bold"
            >
              Next Step ▶
            </button>
            <button
              onClick={() => setCurrentStepIdx(steps.length - 1)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded"
            >
              Show All
            </button>
          </div>
        )}
      </div>

      {/* Simulator Table View */}
      <div className="border border-[#1e293b] rounded-lg overflow-hidden flex-1 bg-[#090d16]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#0f172a] text-slate-400 text-[11px] uppercase border-b border-[#1e293b]">
            <tr>
              <th className="py-2 px-3 w-16">Step</th>
              <th className="py-2 px-3">Parser Stack</th>
              <th className="py-2 px-3">Input Buffer</th>
              <th className="py-2 px-3">Action / Production Applied</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {visibleSteps.map((s: any) => {
              const isAccept = s.action.includes("ACCEPT");
              const isShift = s.action.includes("SHIFT");
              const isReduce = s.action.includes("REDUCE");

              return (
                <tr
                  key={s.step}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    isAccept ? "bg-emerald-950/20 text-emerald-300 font-bold" : ""
                  }`}
                >
                  <td className="py-2 px-3 text-slate-500">{s.step}</td>
                  <td className="py-2 px-3 font-semibold text-sky-300">
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {s.stack}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-300">
                    <span className="bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800/60">
                      {s.input}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        isAccept
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : isShift
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                          : isReduce
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-slate-800 text-slate-300 border-slate-700"
                      }`}
                    >
                      {s.action}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
