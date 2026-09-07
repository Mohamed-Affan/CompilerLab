import React, { useState } from "react";
import { TokenModel } from "../../types/compiler";
import { Search, Tag, Layers, ArrowRight, Hash, Terminal } from "lucide-react";

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
        return "bg-pink-950/60 text-pink-300 border-pink-700/80";
      case "TYPE":
        return "bg-sky-950/60 text-sky-300 border-sky-700/80";
      case "IDENTIFIER":
        return "bg-slate-800 text-slate-200 border-slate-600";
      case "LITERAL":
        return "bg-amber-950/60 text-amber-300 border-amber-700/80";
      case "OPERATOR":
        return "bg-emerald-950/60 text-emerald-300 border-emerald-700/80";
      case "ASSIGNMENT":
        return "bg-purple-950/60 text-purple-300 border-purple-700/80";
      case "DELIMITER":
        return "bg-blue-950/60 text-blue-300 border-blue-700/80";
      default:
        return "bg-slate-900 text-slate-400 border-slate-800";
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#080d1a] p-4 space-y-4 overflow-y-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-pink-400" />
            <span>Lexical Analysis & DFA Token Stream (Unit I)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Sequential source characters scanned into atomic lexical tokens with deterministic finite automata (DFA).
          </p>
        </div>
        <span className="text-xs font-mono text-pink-300 bg-pink-950/50 border border-pink-800 px-3 py-1 rounded-lg font-bold">
          {tokens.length} Total Tokens
        </span>
      </div>

      {/* Visual Token Stream Tape Preview */}
      <div className="bg-[#0b101d] border border-[#1e293b] p-3.5 rounded-xl space-y-2 shadow-inner">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Terminal className="w-3.5 h-3.5 text-pink-400" />
            <span>Sequential Token Tape (Scanner Output)</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Continuous Lexeme Stream</span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto py-2">
          {tokens.slice(0, 20).map((tok) => (
            <div
              key={tok.index}
              className={`shrink-0 px-2.5 py-1 rounded-lg border text-xs font-mono flex items-center space-x-1.5 shadow-sm ${getCategoryColor(
                tok.category
              )}`}
            >
              <span className="font-extrabold">{tok.lexeme}</span>
              <span className="text-[9px] opacity-70">L{tok.line}</span>
            </div>
          ))}
          {tokens.length > 20 && (
            <span className="text-xs text-slate-500 font-mono italic shrink-0">
              + {tokens.length - 20} more tokens...
            </span>
          )}
        </div>
      </div>

      {/* Category Pills Breakdown */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(tokenStats).map(([cat, count]) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? "ALL" : cat)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs border transition-all cursor-pointer ${
              selectedCategory === cat
                ? "border-pink-500 bg-pink-950/60 text-white font-bold shadow-md shadow-pink-500/20"
                : "border-slate-800 bg-[#0b101d] text-slate-400 hover:border-slate-700"
            }`}
          >
            <Tag className="w-3 h-3 text-slate-500" />
            <span>{cat}</span>
            <span className="bg-slate-900 border border-slate-700 px-1.5 py-0.2 rounded text-[10px] text-slate-300 font-mono">
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search lexeme or token type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0b101d] border border-[#1e293b] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-pink-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#0b101d] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-pink-500 cursor-pointer"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              Category: {c}
            </option>
          ))}
        </select>
      </div>

      {/* Tokens Table */}
      <div className="border border-[#1e293b] rounded-xl overflow-hidden flex-1 bg-[#0b101d]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#0f172a] text-slate-400 text-[11px] uppercase border-b border-[#1e293b]">
            <tr>
              <th className="py-2.5 px-3">#</th>
              <th className="py-2.5 px-3">Lexeme</th>
              <th className="py-2.5 px-3">Token Type</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3 text-right">Line</th>
              <th className="py-2.5 px-3 text-right">Col</th>
              <th className="py-2.5 px-3">Literal Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filteredTokens.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-500">
                  No tokens matching the search filter.
                </td>
              </tr>
            ) : (
              filteredTokens.map((tok) => (
                <tr key={tok.index} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 text-slate-500 text-[11px]">{tok.index}</td>
                  <td className="py-2 px-3 font-bold text-sky-300">
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {tok.lexeme}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-200">{tok.token_type}</td>
                  <td className="py-2 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getCategoryColor(tok.category)}`}>
                      {tok.category}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right text-slate-400 font-mono">{tok.line}</td>
                  <td className="py-2 px-3 text-right text-slate-400 font-mono">{tok.column}</td>
                  <td className="py-2 px-3 text-emerald-300 font-semibold">
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
