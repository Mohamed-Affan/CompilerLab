import React, { useState, useEffect } from "react";
import { compilerApi } from "../../api/compilerApi";
import { QuizQuestion } from "../../types/compiler";
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award } from "lucide-react";

export const QuizModal: React.FC = () => {
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    compilerApi.getQuizzes().then(setQuizzes).catch(console.error);
  }, []);

  if (quizzes.length === 0) {
    return <div className="p-8 text-center text-slate-500 text-xs">Loading Quiz Mode...</div>;
  }

  const q = quizzes[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === q.correct_index) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIdx((prev) => (prev + 1) % quizzes.length);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIdx(0);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-[#0b0f19] select-none">
      <div className="w-full max-w-2xl bg-[#090d16] border border-[#1e293b] rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Quiz Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Compiler Design Knowledge Check</h3>
          </div>
          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="text-slate-400">
              Question {currentIdx + 1} of {quizzes.length}
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/40">
              Score: {score}
            </span>
          </div>
        </div>

        {/* Question Title */}
        <div>
          <h4 className="text-sm font-semibold text-slate-100 leading-snug">{q.question}</h4>
        </div>

        {/* Options List */}
        <div className="space-y-2.5">
          {q.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === q.correct_index;
            let btnClass = "bg-[#0f172a] border-[#1e293b] text-slate-300 hover:border-slate-700 hover:bg-slate-800/60";

            if (isAnswered) {
              if (isCorrect) {
                btnClass = "bg-emerald-950/40 border-emerald-500 text-emerald-200 font-semibold";
              } else if (isSelected && !isCorrect) {
                btnClass = "bg-rose-950/40 border-rose-500 text-rose-200";
              } else {
                btnClass = "opacity-40 bg-[#0f172a] border-slate-800 text-slate-500";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-mono text-[11px] font-bold text-slate-400">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
              </button>
            );
          })}
        </div>

        {/* Explanation Card */}
        {isAnswered && (
          <div className="p-3.5 bg-[#0f172a] border border-slate-800 rounded-xl space-y-1 text-xs">
            <span className="font-bold text-slate-200 flex items-center space-x-1.5">
              <span>💡 Academic Rationale</span>
            </span>
            <p className="text-slate-400 leading-relaxed">{q.explanation}</p>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Quiz</span>
          </button>

          {isAnswered && (
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 text-white font-bold px-4 py-2 rounded-lg flex items-center space-x-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>{currentIdx === quizzes.length - 1 ? "Finish & Review" : "Next Question"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
