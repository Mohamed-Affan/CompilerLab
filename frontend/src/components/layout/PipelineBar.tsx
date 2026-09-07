import React from "react";
import { CheckCircle2, XCircle, Clock, ChevronRight, Activity } from "lucide-react";
import { StageTimingModel } from "../../types/compiler";

interface PipelineBarProps {
  timings: StageTimingModel[];
  activeStageTab: string;
  onSelectStageTab: (stage: string) => void;
  failedStage?: string;
  totalTimeMs?: number;
}

interface StageDefinition {
  id: string;
  name: string;
  shortName: string;
  unit: string;
  description: string;
}

const STAGES: StageDefinition[] = [
  { id: "lexer", name: "1. Lexer", shortName: "Lexer", unit: "Unit I", description: "Tokenization & Lexeme Recognition" },
  { id: "parser", name: "2. Parser", shortName: "Parser", unit: "Unit II", description: "Recursive Descent & CFG Validation" },
  { id: "ast", name: "3. AST", shortName: "AST", unit: "Unit II", description: "Abstract Syntax Tree Hierarchy" },
  { id: "symbols", name: "4. Symbols", shortName: "Symbols", unit: "Unit III", description: "Scoped Identifiers & Scopes" },
  { id: "semantic", name: "5. Semantic", shortName: "Semantic", unit: "Unit III", description: "Static Type Checking & Rules" },
  { id: "ir", name: "6. IR (TAC)", shortName: "IR", unit: "Unit IV", description: "TAC, Quadruples & Triples" },
  { id: "optimizer", name: "7. Optimizer", shortName: "Optimizer", unit: "Unit V", description: "Constant Folding & Simplification" },
  { id: "flowgraph", name: "8. CFG Blocks", shortName: "CFG", unit: "Unit V", description: "Basic Blocks & Flow Graph" },
  { id: "codegen", name: "9. Target VM", shortName: "Codegen", unit: "Unit V", description: "Assembly & Runtime Stack" },
];

export const PipelineBar: React.FC<PipelineBarProps> = ({
  timings,
  activeStageTab,
  onSelectStageTab,
  failedStage,
  totalTimeMs = 0,
}) => {
  const getStageTiming = (stageId: string): StageTimingModel | undefined => {
    const map: Record<string, string> = {
      lexer: "Lexer",
      parser: "Parser",
      ast: "Parser",
      symbols: "Semantic Analysis",
      semantic: "Semantic Analysis",
      ir: "IR Generation",
      optimizer: "Optimization",
      flowgraph: "Optimization",
      codegen: "Code Generation",
    };
    const targetName = map[stageId] || "";
    return timings.find((t) => t.stage.toLowerCase().includes(targetName.toLowerCase()));
  };

  return (
    <div className="bg-[#070b14] border-b border-[#1e293b] px-3 py-2 overflow-x-auto select-none">
      <div className="flex items-center justify-between min-w-max space-x-2">
        <div className="flex items-center space-x-1.5">
          {STAGES.map((stage, idx) => {
            const timing = getStageTiming(stage.id);
            const isSelected = activeStageTab === stage.id;
            const isError = timing?.status === "error" || (failedStage && failedStage.toLowerCase().includes(stage.shortName.toLowerCase()));
            const isSuccess = timing?.status === "success";

            let pillStyle = "bg-[#0b101d] border-slate-800 text-slate-400 hover:border-slate-600";
            if (isSelected) {
              pillStyle = "bg-sky-950/70 border-sky-400 text-sky-200 font-bold shadow-md shadow-sky-500/20";
            } else if (isError) {
              pillStyle = "bg-rose-950/50 border-rose-500 text-rose-200 font-semibold";
            } else if (isSuccess) {
              pillStyle = "bg-emerald-950/20 border-emerald-500/40 text-emerald-300";
            }

            return (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => onSelectStageTab(stage.id)}
                  title={stage.description}
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${pillStyle}`}
                >
                  {isError ? (
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-pulse" />
                  ) : isSuccess ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
                  )}

                  <div className="text-left">
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold">{stage.name}</span>
                    </div>
                    {timing && (
                      <div className="text-[10px] text-slate-400 flex items-center space-x-0.5 font-mono">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{timing.duration_ms} ms</span>
                      </div>
                    )}
                  </div>
                </button>

                {idx < STAGES.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-700 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Master Report Button */}
        <button
          onClick={() => onSelectStageTab("report")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
            activeStageTab === "report"
              ? "bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/30"
              : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700"
          }`}
        >
          Full Report {totalTimeMs > 0 ? `(${totalTimeMs.toFixed(1)}ms)` : ""}
        </button>
      </div>
    </div>
  );
};
