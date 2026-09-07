import React, { useState } from "react";
import { OptimizationReportModel, TACInstructionModel } from "../../types/compiler";
import { Sparkles, ArrowRight, TrendingDown, CheckCircle, Tag, Split } from "lucide-react";

interface OptimizerTabProps {
  optimization?: OptimizationReportModel;
  rawTac: TACInstructionModel[];
}

export const OptimizerTab: React.FC<OptimizerTabProps> = ({ optimization, rawTac }) => {
  const [selectedPassType, setSelectedPassType] = useState<string>("ALL");

  if (!optimization) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 text-xs">
        Optimization passes not computed. Enable optimizer in the top header and re-compile.
      </div>
    );
  }

  const passTypes = ["ALL", ...Object.keys(optimization.counts_by_type)];

  const filteredPasses = optimization.passes_applied.filter(
    (p) => selectedPassType === "ALL" || p.pass_type === selectedPassType
  );

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] p-4 space-y-4 overflow-y-auto">
      {/* Header & Live Reduction Metrics Card */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Code Optimization & Transformations (Unit V)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Safe compiler transformations: Constant Folding, Algebraic Identities, Constant Propagation, and Peephole Elimination.
          </p>
        </div>

        {/* Reduction Metric Pill */}
        <div className="flex items-center space-x-3">
          <div className="bg-[#090d16] border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center space-x-2">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">IR Reduction</span>
              <span className="text-xs font-mono font-extrabold text-emerald-300">
                {optimization.reduction_percentage}% ({optimization.instructions_before} → {optimization.instructions_after} instrs)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Applied Pass Type Pills */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(optimization.counts_by_type).map(([type, count]) => (
          <button
            key={type}
            onClick={() => setSelectedPassType(selectedPassType === type ? "ALL" : type)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs border transition-all cursor-pointer ${
              selectedPassType === type
                ? "border-emerald-400 bg-emerald-950/40 text-emerald-200 font-bold"
                : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"
            }`}
          >
            <Tag className="w-3 h-3 text-slate-500" />
            <span>{type}</span>
            <span className="bg-slate-800 px-1 rounded text-[10px] text-slate-300 font-mono">{count}</span>
          </button>
        ))}
      </div>

      {/* Side-by-Side Before vs After IR Diff */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Before Optimization */}
        <div className="border border-[#1e293b] rounded-lg bg-[#090d16] p-3 flex flex-col font-mono text-xs">
          <span className="text-xs font-semibold text-slate-400 pb-2 mb-2 border-b border-slate-800 flex items-center justify-between">
            <span>Original TAC (Before Optimization)</span>
            <span className="text-slate-500 text-[11px]">{rawTac.length} instructions</span>
          </span>
          <div className="space-y-1 text-slate-300 max-h-60 overflow-y-auto">
            {rawTac.map((instr) => (
              <div key={instr.index} className="flex items-center space-x-2 py-0.5 px-2 rounded hover:bg-slate-800/30">
                <span className="text-slate-600 text-[10px] w-5">{instr.index}</span>
                <span>{instr.raw}</span>
              </div>
            ))}
          </div>
        </div>

        {/* After Optimization */}
        <div className="border border-emerald-500/30 rounded-lg bg-[#090d16] p-3 flex flex-col font-mono text-xs">
          <span className="text-xs font-semibold text-emerald-400 pb-2 mb-2 border-b border-emerald-900/50 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Optimized TAC (After Passes)</span>
            </span>
            <span className="text-emerald-300 text-[11px]">{optimization.optimized_tac.length} instructions</span>
          </span>
          <div className="space-y-1 text-slate-200 max-h-60 overflow-y-auto">
            {optimization.optimized_tac.map((instr) => (
              <div key={instr.index} className="flex items-center space-x-2 py-0.5 px-2 rounded hover:bg-emerald-950/20">
                <span className="text-slate-600 text-[10px] w-5">{instr.index}</span>
                <span className="text-emerald-300 font-medium">{instr.raw}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Applied Transformation Details Log */}
      <div className="border border-[#1e293b] rounded-lg bg-[#090d16] p-4 space-y-2 flex-1 overflow-auto">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
          Applied Optimization Transformations Log ({filteredPasses.length})
        </span>

        {filteredPasses.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs font-mono">
            No transformations applied for this filter.
          </div>
        ) : (
          <div className="space-y-2 font-mono text-xs">
            {filteredPasses.map((p, idx) => (
              <div
                key={idx}
                className="bg-[#0f172a] border border-[#1e293b] p-2.5 rounded-lg flex items-center justify-between hover:border-slate-700"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded text-[10px] font-bold">
                      {p.pass_type}
                    </span>
                    <span className="text-slate-200 font-semibold">{p.description}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px]">
                    <span className="text-rose-400 bg-rose-950/40 px-1.5 py-0.2 rounded border border-rose-900/50">
                      - {p.before}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <span className="text-emerald-400 bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-900/50">
                      + {p.after}
                    </span>
                  </div>
                </div>

                {p.line_affected && (
                  <span className="text-[10px] text-slate-500">Instr #{p.line_affected}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
