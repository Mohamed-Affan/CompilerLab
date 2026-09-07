import React, { useState } from "react";
import { GitCommit, BookOpen, Terminal, CheckCircle2 } from "lucide-react";

interface ParserTabProps {
  parseTreeTrace: string[];
}

export const ParserTab: React.FC<ParserTabProps> = ({ parseTreeTrace }) => {
  const [activeSubTab, setActiveSubTab] = useState<"trace" | "grammar">("trace");

  const grammarRules = [
    { lhs: "Program", rhs: "StatementList" },
    { lhs: "StatementList", rhs: "Statement StatementList | ε" },
    { lhs: "Statement", rhs: "Declaration | Assignment | IfStatement | WhileStatement | FunctionDeclaration | ReturnStatement | PrintStatement" },
    { lhs: "Declaration", rhs: "let Identifier : Type [ = Expression ] ;" },
    { lhs: "Assignment", rhs: "Identifier = Expression ;" },
    { lhs: "IfStatement", rhs: "if ( Expression ) Block [ else Block ]" },
    { lhs: "WhileStatement", rhs: "while ( Expression ) Block" },
    { lhs: "FunctionDeclaration", rhs: "function Identifier ( [ ParamList ] ) : Type Block" },
    { lhs: "Expression", rhs: "LogicalOr" },
    { lhs: "LogicalOr", rhs: "LogicalAnd { '||' LogicalAnd }" },
    { lhs: "LogicalAnd", rhs: "Equality { '&&' Equality }" },
    { lhs: "Equality", rhs: "Relational { ('==' | '!=') Relational }" },
    { lhs: "Relational", rhs: "Additive { ('<' | '<=' | '>' | '>=') Additive }" },
    { lhs: "Additive", rhs: "Multiplicative { ('+' | '-') Multiplicative }" },
    { lhs: "Multiplicative", rhs: "Unary { ('*' | '/' | '%') Unary }" },
    { lhs: "Unary", rhs: "('!' | '-') Unary | Primary" },
    { lhs: "Primary", rhs: "Literal | Identifier | FunctionCall | ( Expression )" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] p-4 space-y-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <GitCommit className="w-4 h-4 text-sky-400" />
            <span>Syntax Analysis & Parser Trace (Unit II)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrates Recursive Descent Top-Down Parser function invocations matching SimpleLang CFG.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center space-x-1 bg-[#090d16] p-1 rounded-lg border border-[#1e293b]">
          <button
            onClick={() => setActiveSubTab("trace")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeSubTab === "trace"
                ? "bg-sky-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Parser Call Trace ({parseTreeTrace.length})
          </button>
          <button
            onClick={() => setActiveSubTab("grammar")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeSubTab === "grammar"
                ? "bg-sky-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            CFG Grammar Rules
          </button>
        </div>
      </div>

      {activeSubTab === "trace" ? (
        <div className="border border-[#1e293b] rounded-lg bg-[#090d16] p-4 flex-1 flex flex-col font-mono text-xs overflow-auto">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-slate-500 text-[11px]">
            <span className="flex items-center space-x-1.5">
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span>Recursive Descent Function Call Hierarchy</span>
            </span>
            <span className="text-emerald-400 font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Deterministic Lookahead (LL(1) tokens)</span>
            </span>
          </div>

          <div className="space-y-1 text-slate-300">
            {parseTreeTrace.map((traceLine, idx) => {
              const isEntry = traceLine.includes("Starting") || traceLine.includes("()");
              const isMatch = traceLine.includes("Completed") || traceLine.includes("SUCCESS");

              return (
                <div
                  key={idx}
                  className={`py-1 px-2.5 rounded transition-colors ${
                    isMatch
                      ? "bg-emerald-950/20 text-emerald-300 font-bold border-l-2 border-emerald-500"
                      : isEntry
                      ? "hover:bg-slate-800/40 text-sky-300"
                      : "hover:bg-slate-800/20 text-slate-400"
                  }`}
                >
                  <span className="text-slate-600 text-[10px] mr-2">[{idx + 1}]</span>
                  <span>{traceLine}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="border border-[#1e293b] rounded-lg bg-[#090d16] p-4 flex-1 overflow-auto">
          <div className="flex items-center space-x-2 pb-2 mb-3 border-b border-slate-800 text-slate-400 text-xs">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-white">SimpleLang Context-Free Grammar Production Set</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {grammarRules.map((rule, idx) => (
              <div
                key={idx}
                className="bg-[#0f172a] border border-[#1e293b] p-3 rounded-md font-mono text-xs"
              >
                <div className="flex items-center space-x-2 text-sky-400 font-bold mb-1">
                  <span>{rule.lhs}</span>
                  <span className="text-slate-500">→</span>
                </div>
                <div className="text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800 text-[11px]">
                  {rule.rhs}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
