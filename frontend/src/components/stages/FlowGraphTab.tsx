import React from "react";
import { BasicBlockModel, FlowGraphModel } from "../../types/compiler";
import { GitMerge, ArrowRight, CornerDownRight, Flag, ArrowDown, Zap } from "lucide-react";

interface FlowGraphTabProps {
  basicBlocks: BasicBlockModel[];
  flowGraph?: FlowGraphModel;
}

export const FlowGraphTab: React.FC<FlowGraphTabProps> = ({ basicBlocks, flowGraph }) => {
  return (
    <div className="flex flex-col h-full bg-[#080d1a] p-4 space-y-4 overflow-y-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <GitMerge className="w-4 h-4 text-sky-400" />
            <span>Basic Blocks & Control Flow Graph (CFG) (Unit V)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Leader identification algorithm partitions TAC into basic blocks with directed conditional and jump transitions.
          </p>
        </div>
        <span className="text-xs font-mono text-sky-400 bg-sky-950/40 border border-sky-800 px-2.5 py-1 rounded font-bold">
          {basicBlocks.length} Basic Blocks Identified
        </span>
      </div>

      {/* Basic Blocks Flow Diagram */}
      <div className="flex-1 bg-[#0b101d] border border-[#1e293b] rounded-xl p-4 overflow-auto space-y-6">
        {basicBlocks.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs">
            No basic blocks generated. Click "Compile" to partition TAC into blocks.
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4 max-w-2xl mx-auto">
            {basicBlocks.map((block, idx) => (
              <React.Fragment key={block.id}>
                {/* Block Card */}
                <div className="w-full bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 font-mono text-xs shadow-lg hover:border-sky-500 transition-all">
                  {/* Block Header Banner */}
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="bg-sky-500 text-white font-extrabold px-2.5 py-0.5 rounded text-xs">
                        {block.id}
                      </span>
                      <span className="text-slate-300 font-bold text-xs">
                        Lines {block.start_index}–{block.end_index}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                      <span>{block.instructions.length} instructions</span>
                    </div>
                  </div>

                  {/* Instructions Listing inside Block */}
                  <div className="space-y-1.5 py-1">
                    {block.instructions.map((instr) => (
                      <div
                        key={instr.index}
                        className={`py-1 px-2.5 rounded text-xs flex items-center justify-between ${
                          instr.is_leader
                            ? "bg-amber-950/40 text-amber-200 font-bold border-l-2 border-amber-400"
                            : "text-slate-300 bg-slate-900/50 hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-slate-600 text-[10px] w-4">{instr.index}</span>
                          <span>{instr.raw}</span>
                        </div>
                        {instr.is_leader && (
                          <span className="text-[9px] uppercase px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded font-bold border border-amber-500/40">
                            Leader
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Flow Edges & Successors */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-1.5 text-slate-400">
                      <span>Predecessors:</span>
                      <span className="text-sky-300 font-bold">
                        {block.predecessors.length > 0 ? block.predecessors.join(", ") : "ENTRY"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 text-slate-400">
                      <span>Successors:</span>
                      <span className="text-emerald-400 font-bold">
                        {block.successors.length > 0 ? block.successors.join(", ") : "EXIT"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Transition Flow Arrow between Blocks */}
                {idx < basicBlocks.length - 1 && (
                  <div className="flex flex-col items-center text-sky-400">
                    <div className="w-0.5 h-4 bg-sky-500/50" />
                    <ArrowDown className="w-4 h-4 text-sky-400 -my-1" />
                    <span className="text-[10px] text-slate-500 font-mono mt-1">Control Flow Edge</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
