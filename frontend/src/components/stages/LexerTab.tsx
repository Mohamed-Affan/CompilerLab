import React, { useState } from "react";
import { TokenModel } from "../../types/compiler";
import { Search, Filter, Hash, Tag, Layers } from "lucide-react";

interface LexerTabProps {
  tokens: TokenModel[];
  tokenStats: Record<string, number>;
}

export const LexerTab: React.FC<LexerTabProps> = ({ tokens, tokenStats }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = ["ALL", ...Object.keys(tokenStats)];

  const filteredTokens = tokens.filter((t) => {
    const matchesSearch =
      t.lexeme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.token_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "KEYWORD":
        return "bg-pink-500/15 text-pink-300 border-pink-500/30";
      case "TYPE":
        return "bg-sky-500/15 text-sky-300 border-sky-500/30";
      case "IDENTIFIER":
        return "bg-slate-200/15 text-slate-200 border-slate-400/30";
      case "LITERAL":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      case "OPERATOR":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
      case "ASSIGNMENT":
        return "bg-purple-500/15 text-purple-300 border-purple-500/30";
      case "DELIMITER":
        return "bg-blue-500/15 text-blue-300 border-blue-500/30";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] p-4 space-y-4 overflow-y-auto">
      {/* Header & Stats Cards */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Lexical Analysis — Token Stream (Unit I)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Character sequence scanned into discrete tokens according to SimpleLang DFA lexer rules.
            </p>
          </div>
          <span className="text-xs font-mono text-sky-400 font-semibold bg-sky-950/40 border border-sky-800/60 px-2.5 py-1 rounded">
            Total Tokens: {tokens.length}
          </span>
        </div>

        {/* Category Pills Breakdown */}
        <div className="flex flex-wrap gap-2 mt-3">
          {Object.entries(tokenStats).map(([cat, count]) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? "ALL" : cat)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "border-sky-400 bg-sky-900/40 text-white font-bold"
                  : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"
              }`}
            >
              <Tag className="w-3 h-3 text-slate-500" />
              <span>{cat}</span>
              <span className="bg-slate-800 px-1 rounded text-[10px] text-slate-300 font-mono">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search lexeme or token type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#090d16] border border-[#1e293b] rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-sky-500 cursor-pointer"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              Category: {c}
            </option>
          ))}
        </select>
      </div>

      {/* Tokens Table */}
      <div className="border border-[#1e293b] rounded-lg overflow-hidden flex-1 bg-[#090d16]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#0f172a] text-slate-400 text-[11px] uppercase border-b border-[#1e293b]">
            <tr>
              <th className="py-2 px-3">#</th>
              <th className="py-2 px-3">Lexeme</th>
              <th className="py-2 px-3">Token Type</th>
              <th className="py-2 px-3">Category</th>
              <th className="py-2 px-3 text-right">Line</th>
              <th className="py-2 px-3 text-right">Col</th>
              <th className="py-2 px-3">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filteredTokens.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No tokens match the filter.
                </td>
              </tr>
            ) : (
              filteredTokens.map((tok) => (
                <tr key={tok.index} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-1.5 px-3 text-slate-500 text-[11px]">{tok.index}</td>
                  <td className="py-1.5 px-3 font-semibold text-sky-300">
                    <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {tok.lexeme}
                    </span>
                  </td>
                  <td className="py-1.5 px-3 text-slate-300">{tok.token_type}</td>
                  <td className="py-1.5 px-3">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getCategoryColor(
                        tok.category
                      )}`}
                    >
                      {tok.category}
                    </span>
                  </td>
                  <td className="py-1.5 px-3 text-right text-slate-400">{tok.line}</td>
                  <td className="py-1.5 px-3 text-right text-slate-400">{tok.column}</td>
                  <td className="py-1.5 px-3 text-slate-400">
                    {tok.value !== null && tok.value !== undefined ? String(tok.value) : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
