import React from "react";
import { CheckCircle2, XCircle, Clock, ChevronRight } from "lucide-react";
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
  unit: string;
  description: string;
}

const STAGES: StageDefinition[] = [
  { id: "lexer", name: "1. Lexer", unit: "Unit I", description: "Tokenization & Lexeme Recognition" },
  { id: "parser", name: "2. Parser", unit: "Unit II", description: "Recursive Descent & CFG Validation" },
  { id: "ast", name: "3. AST", unit: "Unit II/III", description: "Abstract Syntax Tree Construction" },
  { id: "symbols", name: "4. Symbol Table", unit: "Unit III", description: "Scoped Identifiers & Declarations" },
  { id: "semantic", name: "5. Semantic / Types", unit: "Unit III", description: "Static Type Checking & Diagnostics" },
  { id: "ir", name: "6. Intermediate Code", unit: "Unit IV", description: "TAC, Quadruples, Triples & Backpatching" },
  { id: "optimizer", name: "7. Optimizer & CFG", unit: "Unit V", description: "Basic Blocks & Constant Folding" },
  { id: "codegen", name: "8. Target VM", unit: "Unit V", description: "Assembly Instructions & Activation Records" },
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
      codegen: "Code Generation",
    };
    const targetName = map[stageId] || "";
    return timings.find((t) => t.stage.toLowerCase().includes(targetName.toLowerCase()));
  };

  return (
    <div className="bg-[#090d16] border-b border-[#1e293b] px-4 py-2 overflow-x-auto select-none">
      <div className="flex items-center justify-between min-w-max space-x-2">
        <div className="flex items-center space-x-1">
          {STAGES.map((stage, idx) => {
            const timing = getStageTiming(stage.id);
            const isSelected = activeStageTab === stage.id;
            const isError = timing?.status === "error" || (failedStage && failedStage.toLowerCase().includes(stage.id));
            const isSuccess = timing?.status === "success";

            let borderClass = "border-[#1e293b]";
            let bgClass = "bg-[#0f172a]";
            let textClass = "text-slate-400";
            let pillClass = "text-slate-500";

            if (isSelected) {
              borderClass = "border-sky-500 shadow-md shadow-sky-500/10";
              bgClass = "bg-sky-950/40 text-sky-200";
              textClass = "text-sky-300 font-semibold";
              pillClass = "text-sky-400";
            } else if (isError) {
              borderClass = "border-rose-500/50";
              bgClass = "bg-rose-950/30";
              textClass = "text-rose-300";
              pillClass = "text-rose-400";
            } else if (isSuccess) {
              borderClass = "border-emerald-500/30";
              bgClass = "bg-emerald-950/20";
              textClass = "text-emerald-300";
              pillClass = "text-emerald-400";
            }

            return (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => onSelectStageTab(stage.id)}
                  title={stage.description}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border ${borderClass} ${bgClass} transition-all hover:border-slate-500 active:scale-95 text-left cursor-pointer group`}
                >
                  {/* Status Indicator */}
                  {isError ? (
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-pulse" />
                  ) : isSuccess ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
                  )}

                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className={`text-xs font-medium ${textClass}`}>{stage.name}</span>
                      <span className={`text-[9px] uppercase px-1 py-0.2 bg-slate-800/80 rounded ${pillClass}`}>
                        {stage.unit}
                      </span>
                    </div>
                    {timing && (
                      <div className="text-[10px] text-slate-500 flex items-center space-x-0.5 mt-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{timing.duration_ms} ms</span>
                      </div>
                    )}
                  </div>
                </button>

                {idx < STAGES.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Total Time & Report Quick Link */}
        {totalTimeMs > 0 && (
          <div className="hidden xl:flex items-center space-x-2 pl-4 border-l border-slate-800 text-xs text-slate-400">
            <span className="text-[11px] text-slate-500">Pipeline Total:</span>
            <span className="font-mono text-emerald-400 font-semibold">{totalTimeMs.toFixed(2)} ms</span>
            <button
              onClick={() => onSelectStageTab("report")}
              className={`px-2 py-1 text-[11px] rounded border transition-all ${
                activeStageTab === "report"
                  ? "bg-sky-500 text-white border-sky-400"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              }`}
            >
              Full Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
