import React, { useState } from "react";
import { TargetInstructionModel, NextUseEntryModel, StackFrameModel } from "../../types/compiler";
import { Cpu, HardDrive, Terminal, Layers, ArrowDown } from "lucide-react";

interface CodeGenTabProps {
  targetCode: TargetInstructionModel[];
  nextUseTable: NextUseEntryModel[];
  stackFrames: StackFrameModel[];
}

export const CodeGenTab: React.FC<CodeGenTabProps> = ({
  targetCode,
  nextUseTable,
  stackFrames,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"target" | "next_use" | "stack">("target");

  return (
    <div className="flex flex-col h-full bg-[#080d1a] p-4 space-y-4 overflow-y-auto select-none">
      {/* Header & Sub-Tab Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-sky-400" />
            <span>Target Code Generation & Virtual Machine (Unit V)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Assembly instructions for educational register VM, Next-Use liveness analysis, and runtime activation stack.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center space-x-1 bg-[#0b101d] p-1 rounded-lg border border-[#1e293b]">
          <button
            onClick={() => setActiveSubTab("target")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeSubTab === "target"
                ? "bg-sky-500 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Target Assembly ({targetCode.length})
          </button>
          <button
            onClick={() => setActiveSubTab("next_use")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeSubTab === "next_use"
                ? "bg-sky-500 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Next-Use Table
          </button>
          <button
            onClick={() => setActiveSubTab("stack")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeSubTab === "stack"
                ? "bg-sky-500 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Runtime Stack
          </button>
        </div>
      </div>

      {/* 1. Target Machine Code Listing */}
      {activeSubTab === "target" && (
        <div className="border border-[#1e293b] rounded-xl bg-[#0b101d] p-4 flex-1 font-mono text-xs overflow-auto">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-slate-400 text-[11px]">
            <span className="flex items-center space-x-1.5">
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span>Target Assembly Instructions (R0: Return, R1/R2: Operands)</span>
            </span>
            <span className="text-emerald-400 font-semibold">{targetCode.length} target instructions emitted</span>
          </div>

          <div className="space-y-1 text-slate-300">
            {targetCode.map((instr) => (
              <div
                key={instr.index}
                className="flex items-center space-x-4 py-1.5 px-3 rounded hover:bg-slate-800/40 font-mono transition-colors"
              >
                <span className="text-slate-600 text-[11px] w-6">{instr.index}</span>
                <span className="text-amber-400 font-bold w-16">{instr.opcode}</span>
                <span className="text-sky-300 font-semibold w-36">{instr.operands.join(", ")}</span>
                {instr.comment && <span className="text-slate-500 italic text-[11px]">; {instr.comment}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Next-Use Information Table */}
      {activeSubTab === "next_use" && (
        <div className="border border-[#1e293b] rounded-xl overflow-hidden flex-1 bg-[#0b101d]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0f172a] text-slate-400 text-[11px] uppercase border-b border-[#1e293b]">
              <tr>
                <th className="py-2.5 px-3">Instruction #</th>
                <th className="py-2.5 px-3">Instruction TAC</th>
                <th className="py-2.5 px-3">Variable</th>
                <th className="py-2.5 px-3 text-right">Next-Use Line</th>
                <th className="py-2.5 px-3">Liveness Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {nextUseTable.map((entry, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 text-slate-500">Line {entry.instruction_index}</td>
                  <td className="py-2 px-3 text-sky-300 font-semibold">{entry.instruction_raw}</td>
                  <td className="py-2 px-3 font-bold text-white">{entry.variable}</td>
                  <td className="py-2 px-3 text-right">
                    {entry.next_use_line ? (
                      <span className="text-emerald-400 font-semibold">Line {entry.next_use_line}</span>
                    ) : (
                      <span className="text-slate-500">— (Dead)</span>
                    )}
                  </td>
                  <td className="py-2 px-3">
                    {entry.is_live ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        LIVE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-500 border border-slate-700">
                        DEAD
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. Runtime Stack Activation Frames Visualizer */}
      {activeSubTab === "stack" && (
        <div className="border border-[#1e293b] rounded-xl bg-[#0b101d] p-4 flex-1 space-y-4 overflow-auto">
          <div className="text-xs text-slate-400 pb-2 border-b border-slate-800">
            Activation record memory layout: Saved Frame Pointer ($FP), Return Address, Parameter bindings, and Local variables.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stackFrames.map((frame, idx) => (
              <div
                key={idx}
                className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-3.5 font-mono text-xs space-y-2 shadow-lg"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-sky-400 flex items-center space-x-1.5">
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>{frame.function_name}</span>
                  </span>
                  <span className="text-slate-400 text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {frame.frame_size_bytes} Bytes
                  </span>
                </div>

                <div className="space-y-1.5">
                  {frame.slots.map((slot, sIdx) => (
                    <div
                      key={sIdx}
                      className="bg-[#0b101d] border border-slate-800/80 p-2 rounded-lg flex items-center justify-between hover:border-slate-700"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-500 text-[10px] font-mono w-14">
                          +0x{slot.offset.toString(16).padStart(2, "0")}
                        </span>
                        <span className="text-slate-200 font-semibold">{slot.name}</span>
                      </div>
                      <span className="text-emerald-400 text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900 font-bold">
                        {slot.type_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
