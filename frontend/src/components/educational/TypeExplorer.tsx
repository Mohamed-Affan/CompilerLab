import React, { useState, useEffect } from "react";
import { compilerApi } from "../../api/compilerApi";
import { Binary, Check, X, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

export const TypeExplorer: React.FC = () => {
  const [matrixData, setMatrixData] = useState<any>(null);

  useEffect(() => {
    compilerApi.getTypeMatrix().then(setMatrixData).catch(console.error);
  }, []);

  const types = ["int", "float", "string", "bool"];

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] p-4 space-y-4 overflow-y-auto select-none">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
            Type System Engine • Unit III
          </span>
          <h2 className="text-base font-bold text-white">SimpleLang Type System Explorer</h2>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Compatibility matrices, type equivalence rules, and explicit conversion policies.
        </p>
      </div>

      {/* 1. Compatibility Matrix Table */}
      <div className="bg-[#090d16] border border-[#1e293b] rounded-lg p-4 space-y-3">
        <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
          Binary '+' Addition & Concatenation Compatibility Matrix
        </span>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs font-mono">
            <thead className="bg-[#0f172a] text-slate-400">
              <tr>
                <th className="py-2.5 px-3 text-left">Left \ Right Type</th>
                {types.map((t) => (
                  <th key={t} className="py-2.5 px-3 text-sky-400 font-bold uppercase">
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {types.map((t1) => (
                <tr key={t1} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 text-left font-bold text-sky-400 uppercase">{t1}</td>
                  {types.map((t2) => {
                    const isValid =
                      (t1 === "int" && t2 === "int") ||
                      (t1 === "float" && t2 === "float") ||
                      (t1 === "string" && t2 === "string");
                    const resType = isValid ? t1 : null;

                    return (
                      <td key={t2} className="py-2.5 px-3">
                        {isValid ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                            <Check className="w-3 h-3" />
                            <span>{resType}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-rose-400/80 bg-rose-950/20 border border-rose-900/30 px-2 py-0.5 rounded">
                            <X className="w-3 h-3" />
                            <span>Incompatible</span>
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Explicit Conversion Rules */}
      <div className="bg-[#090d16] border border-[#1e293b] rounded-lg p-4 space-y-3">
        <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
          Explicit Type Conversion Built-ins
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-[#0f172a] border border-[#1e293b] p-3 rounded-lg font-mono text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sky-300 font-bold">intToFloat(val : int) : float</span>
              <span className="text-emerald-400 text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Widening Cast
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Promotes integer value to floating-point representation with full single-precision accuracy.
            </p>
            <div className="text-slate-300 text-[11px] bg-slate-900 p-1.5 rounded border border-slate-800">
              let x : float = intToFloat(10); // x = 10.0
            </div>
          </div>

          <div className="bg-[#0f172a] border border-[#1e293b] p-3 rounded-lg font-mono text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sky-300 font-bold">floatToInt(val : float) : int</span>
              <span className="text-amber-400 text-[10px] bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                Narrowing Cast
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Truncates fractional component of floating-point number to integer value.
            </p>
            <div className="text-slate-300 text-[11px] bg-slate-900 p-1.5 rounded border border-slate-800">
              let y : int = floatToInt(45.8); // y = 45
            </div>
          </div>
        </div>
      </div>

      {/* 3. Static Type Checking Rules Summary */}
      <div className="bg-[#090d16] border border-[#1e293b] rounded-lg p-4 space-y-2 text-xs">
        <span className="font-bold text-slate-200 uppercase tracking-wider block">
          Academic Type Checking Invariants
        </span>
        <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
          <li>
            <strong className="text-slate-200">Assignment Invariant:</strong> The declared variable type must strictly equal the inferred type of the assignment expression (no implicit narrowing or silent coercion).
          </li>
          <li>
            <strong className="text-slate-200">Conditional Invariant:</strong> All conditions inside <code className="text-sky-400">if</code> and <code className="text-sky-400">while</code> blocks must resolve to the <code className="text-emerald-400">bool</code> type.
          </li>
          <li>
            <strong className="text-slate-200">Function Invariant:</strong> Argument counts and formal parameter types must match exactly at call sites. Return statements must match the declared function return type.
          </li>
        </ul>
      </div>
    </div>
  );
};
