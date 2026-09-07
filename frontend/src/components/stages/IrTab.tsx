import React, { useState } from "react";
import { TACInstructionModel, QuadrupleModel, TripleModel, BackpatchRecordModel } from "../../types/compiler";
import { Code, Table, GitBranch, ArrowRight, CornerDownRight } from "lucide-react";

interface IrTabProps {
  tacInstructions: TACInstructionModel[];
  quadruples: QuadrupleModel[];
  triples: TripleModel[];
  backpatchRecords: BackpatchRecordModel[];
}

export const IrTab: React.FC<IrTabProps> = ({
  tacInstructions,
  quadruples,
  triples,
  backpatchRecords,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"tac" | "quadruples" | "triples" | "backpatch">("tac");

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] p-4 space-y-4 overflow-y-auto">
      {/* Header & Sub-Tab Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Code className="w-4 h-4 text-sky-400" />
            <span>Intermediate Code Generation — IR (Unit IV)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Machine-independent Three-Address Code (TAC), Quadruples, Triples, and Backpatching lists.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center space-x-1 bg-[#090d16] p-1 rounded-lg border border-[#1e293b]">
          <button
            onClick={() => setActiveSubTab("tac")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeSubTab === "tac"
                ? "bg-sky-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Three-Address Code ({tacInstructions.length})
          </button>
          <button
            onClick={() => setActiveSubTab("quadruples")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeSubTab === "quadruples"
                ? "bg-sky-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Quadruples Table
          </button>
          <button
            onClick={() => setActiveSubTab("triples")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeSubTab === "triples"
                ? "bg-sky-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Triples Table
          </button>
          <button
            onClick={() => setActiveSubTab("backpatch")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeSubTab === "backpatch"
                ? "bg-sky-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Backpatching ({backpatchRecords.length})
          </button>
        </div>
      </div>

      {/* 1. TAC View */}
      {activeSubTab === "tac" && (
        <div className="border border-[#1e293b] rounded-lg bg-[#090d16] p-4 flex-1 font-mono text-xs overflow-auto">
          <div className="space-y-1 text-slate-300">
            {tacInstructions.length === 0 ? (
              <div className="text-center py-12 text-slate-500">No TAC instructions generated.</div>
            ) : (
              tacInstructions.map((instr) => (
                <div
                  key={instr.index}
                  className="flex items-center space-x-3 py-1 px-2.5 rounded hover:bg-slate-800/30 transition-colors"
                >
                  <span className="text-slate-600 text-[11px] w-6">{instr.index}</span>
                  {instr.op === "label" ? (
                    <span className="text-pink-400 font-bold">{instr.raw}</span>
                  ) : ["goto", "if_goto", "if_false_goto"].includes(instr.op) ? (
                    <span className="text-amber-300 font-semibold">{instr.raw}</span>
                  ) : instr.op === "=" ? (
                    <span className="text-sky-300">{instr.raw}</span>
                  ) : (
                    <span className="text-slate-200">{instr.raw}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 2. Quadruples View */}
      {activeSubTab === "quadruples" && (
        <div className="border border-[#1e293b] rounded-lg overflow-hidden flex-1 bg-[#090d16]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0f172a] text-slate-400 text-[11px] uppercase border-b border-[#1e293b]">
              <tr>
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">Operator (Op)</th>
                <th className="py-2 px-3">Argument 1</th>
                <th className="py-2 px-3">Argument 2</th>
                <th className="py-2 px-3">Result Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {quadruples.map((q) => (
                <tr key={q.index} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-1.5 px-3 text-slate-500">{q.index}</td>
                  <td className="py-1.5 px-3 font-bold text-amber-400">
                    <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {q.op}
                    </span>
                  </td>
                  <td className="py-1.5 px-3 text-sky-300">{q.arg1}</td>
                  <td className="py-1.5 px-3 text-sky-300">{q.arg2}</td>
                  <td className="py-1.5 px-3 font-semibold text-emerald-400">{q.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. Triples View */}
      {activeSubTab === "triples" && (
        <div className="border border-[#1e293b] rounded-lg overflow-hidden flex-1 bg-[#090d16]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0f172a] text-slate-400 text-[11px] uppercase border-b border-[#1e293b]">
              <tr>
                <th className="py-2 px-3">Triple Index</th>
                <th className="py-2 px-3">Operator (Op)</th>
                <th className="py-2 px-3">Argument 1</th>
                <th className="py-2 px-3">Argument 2</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {triples.map((tr) => (
                <tr key={tr.index} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-1.5 px-3 text-slate-500 font-bold">({tr.index})</td>
                  <td className="py-1.5 px-3 font-bold text-amber-400">
                    <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {tr.op}
                    </span>
                  </td>
                  <td className="py-1.5 px-3 text-sky-300">{tr.arg1}</td>
                  <td className="py-1.5 px-3 text-sky-300">{tr.arg2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Backpatching View */}
      {activeSubTab === "backpatch" && (
        <div className="border border-[#1e293b] rounded-lg bg-[#090d16] p-4 flex-1 space-y-3 overflow-auto">
          <div className="text-xs text-slate-400 pb-2 border-b border-slate-800">
            Backpatching dynamically resolves unresolved forward jumps in Boolean and Conditional flow.
          </div>

          {backpatchRecords.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-mono">
              No conditional jump instructions requiring backpatching in this program.
            </div>
          ) : (
            backpatchRecords.map((rec) => (
              <div
                key={rec.id}
                className="bg-[#0f172a] border border-[#1e293b] p-3 rounded-lg font-mono text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-400">{rec.id}</span>
                  <span className="text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {rec.condition_expr}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-[#090d16] p-2 rounded border border-slate-800">
                    <span className="text-emerald-400 font-semibold block">True List</span>
                    <span className="text-slate-400">
                      Instructions: [{rec.true_list.join(", ") || "none"}]
                    </span>
                    <div className="text-emerald-300 font-bold mt-1">
                      → Resolved to: {rec.resolved_true || "N/A"}
                    </div>
                  </div>

                  <div className="bg-[#090d16] p-2 rounded border border-slate-800">
                    <span className="text-rose-400 font-semibold block">False List / Jump Target</span>
                    <span className="text-slate-400">
                      Instructions: [{rec.false_list.join(", ") || "none"}]
                    </span>
                    <div className="text-rose-300 font-bold mt-1">
                      → Resolved to: {rec.resolved_false || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
