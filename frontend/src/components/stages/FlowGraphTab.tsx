import React from "react";
import { BasicBlockModel, FlowGraphModel } from "../../types/compiler";
import { GitMerge, ArrowDown, ArrowRight, CornerDownRight, Flag } from "lucide-react";

interface FlowGraphTabProps {
  basicBlocks: BasicBlockModel[];
  flowGraph?: FlowGraphModel;
}

export const FlowGraphTab: React.FC<FlowGraphTabProps> = ({ basicBlocks, flowGraph }) => {
  return (
    <div className="flex flex-col h-full bg-[#0b0f19] p-4 space-y-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <GitMerge className="w-4 h-4 text-sky-400" />
            <span>Basic Blocks & Control Flow Graph (CFG) (Unit V)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Leader identification partitions TAC into linear basic blocks with explicit branch and jump edges.
          </p>
        </div>
        <span className="text-xs font-mono text-sky-400 bg-sky-950/40 border border-sky-800/60 px-2.5 py-1 rounded">
          Total Blocks: {basicBlocks.length}
        </span>
      </div>

      {/* Basic Blocks Flow Diagram */}
      <div className="flex-1 bg-[#090d16] border border-[#1e293b] rounded-lg p-4 overflow-auto space-y-4">
        {basicBlocks.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs">
            No basic blocks generated. Click "Compile" to partition TAC into blocks.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {basicBlocks.map((block) => (
              <div
                key={block.id}
                className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-3 flex flex-col font-mono text-xs hover:border-sky-500/50 transition-all shadow-md"
              >
                {/* Block Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="bg-sky-500 text-white font-bold px-2 py-0.5 rounded text-[11px]">
                      {block.id}
                    </span>
                    <span className="text-slate-300 font-semibold text-[11px]">
                      Lines {block.start_index}–{block.end_index}
                    </span>
                  </div>
                </div>

                {/* Block Instructions */}
                <div className="space-y-1 flex-1 py-1">
                  {block.instructions.map((instr) => (
                    <div
                      key={instr.index}
                      className={`py-1 px-2 rounded text-[11px] flex items-center justify-between ${
                        instr.is_leader
                          ? "bg-amber-950/30 text-amber-200 font-bold border-l-2 border-amber-400"
                          : "text-slate-300 hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-600 text-[10px]">{instr.index}</span>
                        <span>{instr.raw}</span>
                      </div>
                      {instr.is_leader && (
                        <span className="text-[9px] uppercase px-1 py-0.2 bg-amber-500/20 text-amber-300 rounded">
                          Leader
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Predecessors & Successors Footer */}
                <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Predecessors:</span>
                    <span className="text-sky-300 font-bold">
                      {block.predecessors.length > 0 ? block.predecessors.join(", ") : "None (Entry)"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Successors:</span>
                    <span className="text-emerald-300 font-bold">
                      {block.successors.length > 0 ? block.successors.join(", ") : "None (Exit)"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
