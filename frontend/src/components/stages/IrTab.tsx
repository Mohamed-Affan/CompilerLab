import React, { useState } from "react";
import { TACInstructionModel, QuadrupleModel, TripleModel, BackpatchRecordModel } from "../../types/compiler";
import { Code, Table, GitBranch, Copy, Check, Terminal, Zap } from "lucide-react";

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
  const [copied, setCopied] = useState(false);

  const handleCopyTac = () => {
    const raw = tacInstructions.map((i) => `${i.index.toString().padStart(2, " ")}: ${i.raw}`).join("\n");
    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#080d1a] p-4 space-y-4 overflow-y-auto select-none">
      {/* Header & Sub-Tab Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Code className="w-4 h-4 text-amber-400" />
            <span>Intermediate Code Generation — IR (Unit IV)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Machine-independent representations: Three-Address Code (TAC), Quadruples, Triples, and Backpatching lists.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center space-x-1 bg-[#0b101d] p-1 rounded-lg border border-[#1e293b]">
          <button
            onClick={() => setActiveSubTab("tac")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeSubTab === "tac"
                ? "bg-amber-500 text-slate-950 shadow-sm font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            TAC ({tacInstructions.length})
          </button>
          <button
            onClick={() => setActiveSubTab("quadruples")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeSubTab === "quadruples"
                ? "bg-amber-500 text-slate-950 shadow-sm font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Quadruples
          </button>
          <button
            onClick={() => setActiveSubTab("triples")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeSubTab === "triples"
                ? "bg-amber-500 text-slate-950 shadow-sm font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Triples
          </button>
          <button
            onClick={() => setActiveSubTab("backpatch")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeSubTab === "backpatch"
                ? "bg-amber-500 text-slate-950 shadow-sm font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Backpatching ({backpatchRecords.length})
          </button>
        </div>
      </div>

      {/* 1. TAC View */}
      {activeSubTab === "tac" && (
        <div className="border border-[#1e293b] rounded-xl bg-[#0b101d] p-4 flex-1 font-mono text-xs overflow-auto flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-slate-400 text-[11px]">
            <span className="flex items-center space-x-1.5">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>Generated Three-Address Code Stream</span>
            </span>
            <button
              onClick={handleCopyTac}
              className="flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied TAC" : "Copy TAC"}</span>
            </button>
          </div>

          <div className="space-y-1.5 text-slate-300 flex-1 overflow-y-auto">
            {tacInstructions.length === 0 ? (
              <div className="text-center py-12 text-slate-500">No TAC instructions generated.</div>
            ) : (
              tacInstructions.map((instr) => (
                <div
                  key={instr.index}
                  className="flex items-center space-x-3 py-1 px-2.5 rounded hover:bg-slate-800/40 transition-colors font-mono"
                >
                  <span className="text-slate-600 text-[11px] w-6">{instr.index}</span>
                  {instr.op === "label" ? (
                    <span className="text-pink-400 font-bold bg-pink-950/40 px-2 py-0.5 rounded border border-pink-900">
                      {instr.raw}
                    </span>
                  ) : ["goto", "if_goto", "if_false_goto"].includes(instr.op) ? (
                    <span className="text-amber-300 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900">
                      {instr.raw}
                    </span>
                  ) : instr.op === "=" ? (
                    <span className="text-sky-300 font-medium">{instr.raw}</span>
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
        <div className="border border-[#1e293b] rounded-xl overflow-hidden flex-1 bg-[#0b101d]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0f172a] text-slate-400 text-[11px] uppercase border-b border-[#1e293b]">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Operator (Op)</th>
                <th className="py-2.5 px-3">Argument 1</th>
                <th className="py-2.5 px-3">Argument 2</th>
                <th className="py-2.5 px-3">Result Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {quadruples.map((q) => (
                <tr key={q.index} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 text-slate-500">{q.index}</td>
                  <td className="py-2 px-3 font-bold text-amber-400">
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {q.op}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-sky-300">{q.arg1}</td>
                  <td className="py-2 px-3 text-sky-300">{q.arg2}</td>
                  <td className="py-2 px-3 font-bold text-emerald-400">{q.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. Triples View */}
      {activeSubTab === "triples" && (
        <div className="border border-[#1e293b] rounded-xl overflow-hidden flex-1 bg-[#0b101d]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0f172a] text-slate-400 text-[11px] uppercase border-b border-[#1e293b]">
              <tr>
                <th className="py-2.5 px-3">Triple Index</th>
                <th className="py-2.5 px-3">Operator (Op)</th>
                <th className="py-2.5 px-3">Argument 1</th>
                <th className="py-2.5 px-3">Argument 2</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {triples.map((tr) => (
                <tr key={tr.index} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 text-slate-400 font-bold">({tr.index})</td>
                  <td className="py-2 px-3 font-bold text-amber-400">
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {tr.op}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-sky-300">{tr.arg1}</td>
                  <td className="py-2 px-3 text-sky-300">{tr.arg2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Backpatching View */}
      {activeSubTab === "backpatch" && (
        <div className="border border-[#1e293b] rounded-xl bg-[#0b101d] p-4 flex-1 space-y-3 overflow-auto">
          <div className="text-xs text-slate-400 pb-2 border-b border-slate-800">
            Backpatching dynamically resolves unresolved jump targets in Boolean logic and branching control flow.
          </div>

          {backpatchRecords.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-mono">
              No conditional jump instructions requiring backpatching in this program.
            </div>
          ) : (
            backpatchRecords.map((rec) => (
              <div
                key={rec.id}
                className="bg-[#0f172a] border border-[#1e293b] p-3.5 rounded-xl font-mono text-xs space-y-2.5 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-400 flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{rec.id}</span>
                  </span>
                  <span className="text-slate-200 bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-800 font-bold">
                    {rec.condition_expr}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#0b101d] p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-emerald-400 font-bold block text-[11px]">True List (Fallthrough)</span>
                    <span className="text-slate-400 text-[11px]">
                      Instruction Indices: [{rec.true_list.join(", ") || "none"}]
                    </span>
                    <div className="text-emerald-300 font-bold mt-1 text-xs">
                      → Resolved to: {rec.resolved_true || "N/A"}
                    </div>
                  </div>

                  <div className="bg-[#0b101d] p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-rose-400 font-bold block text-[11px]">False List (Jump Branch)</span>
                    <span className="text-slate-400 text-[11px]">
                      Instruction Indices: [{rec.false_list.join(", ") || "none"}]
                    </span>
                    <div className="text-rose-300 font-bold mt-1 text-xs">
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
