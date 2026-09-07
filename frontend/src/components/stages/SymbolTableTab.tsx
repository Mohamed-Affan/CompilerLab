import React, { useState } from "react";
import { SymbolModel, ScopeTreeModel } from "../../types/compiler";
import { Database, Search, GitFork, Check, AlertCircle, Box, Tag } from "lucide-react";

interface SymbolTableTabProps {
  symbolTable: SymbolModel[];
  scopeTree?: ScopeTreeModel;
}

export const SymbolTableTab: React.FC<SymbolTableTabProps> = ({ symbolTable, scopeTree }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScope, setSelectedScope] = useState<string>("ALL");

  const scopes = ["ALL", ...Array.from(new Set(symbolTable.map((s) => s.scope)))];

  const filteredSymbols = symbolTable.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.type_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesScope = selectedScope === "ALL" || s.scope === selectedScope;
    return matchesSearch && matchesScope;
  });

  const getTypeBadge = (type: string) => {
    if (type.startsWith("(")) return "bg-fuchsia-950/60 text-fuchsia-300 border-fuchsia-800";
    if (type === "int") return "bg-sky-950/60 text-sky-300 border-sky-800";
    if (type === "float") return "bg-cyan-950/60 text-cyan-300 border-cyan-800";
    if (type === "string") return "bg-emerald-950/60 text-emerald-300 border-emerald-800";
    if (type === "bool") return "bg-purple-950/60 text-purple-300 border-purple-800";
    return "bg-slate-800 text-slate-300 border-slate-700";
  };

  const renderScopeTree = (node: ScopeTreeModel, depth = 0) => {
    return (
      <div key={node.name} className="ml-4 border-l-2 border-slate-800 pl-3 my-2">
        <div className="flex items-center space-x-2 py-1">
          <div className="w-5 h-5 rounded bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
            <Box className="w-3 h-3 text-sky-400" />
          </div>
          <span className="font-mono text-xs font-bold text-white">{node.name}</span>
          <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono">
            Scope Level {node.level} • {node.symbols.length} identifiers
          </span>
        </div>

        {node.symbols.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 my-2 ml-2">
            {node.symbols.map((sym) => (
              <div
                key={sym.name}
                className="bg-[#0f172a] border border-[#1e293b] p-2.5 rounded-lg text-xs font-mono flex items-center justify-between shadow-sm hover:border-slate-700"
              >
                <div>
                  <span className="text-sky-300 font-bold block">{sym.name}</span>
                  <span className="text-[10px] text-slate-500 uppercase">{sym.kind}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getTypeBadge(sym.type_name)}`}>
                  {sym.type_name}
                </span>
              </div>
            ))}
          </div>
        )}

        {node.children && node.children.map((c) => renderScopeTree(c, depth + 1))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#080d1a] p-4 space-y-4 overflow-y-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Database className="w-4 h-4 text-sky-400" />
            <span>Scoped Symbol Table & Identifier Environment (Unit III)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Symbol table tracks variable and function bindings, scope levels, data types, and usage status.
          </p>
        </div>
        <span className="text-xs font-mono text-sky-400 bg-sky-950/40 border border-sky-800 px-2.5 py-1 rounded font-bold">
          {symbolTable.length} Total Symbols
        </span>
      </div>

      {/* Scope Hierarchy Visualizer Box */}
      {scopeTree && (
        <div className="bg-[#0b101d] border border-[#1e293b] p-3.5 rounded-xl shadow-inner">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center space-x-1.5">
            <GitFork className="w-3.5 h-3.5 text-sky-400" />
            <span>Hierarchical Scope Architecture</span>
          </span>
          <div className="font-mono text-xs text-slate-300">{renderScopeTree(scopeTree)}</div>
        </div>
      )}

      {/* Search & Scope Filter Controls */}
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Filter symbols by name or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0b101d] border border-[#1e293b] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500"
          />
        </div>

        <select
          value={selectedScope}
          onChange={(e) => setSelectedScope(e.target.value)}
          className="bg-[#0b101d] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-sky-500 cursor-pointer"
        >
          {scopes.map((sc) => (
            <option key={sc} value={sc}>
              Scope: {sc}
            </option>
          ))}
        </select>
      </div>

      {/* Scoped Symbols Table */}
      <div className="border border-[#1e293b] rounded-xl overflow-hidden flex-1 bg-[#0b101d]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#0f172a] text-slate-400 text-[11px] uppercase border-b border-[#1e293b]">
            <tr>
              <th className="py-2.5 px-3">Symbol Name</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Scope</th>
              <th className="py-2.5 px-3">Kind</th>
              <th className="py-2.5 px-3 text-right">Decl Line</th>
              <th className="py-2.5 px-3">Usage Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70 text-slate-300">
            {filteredSymbols.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-500">
                  No symbols matching the criteria.
                </td>
              </tr>
            ) : (
              filteredSymbols.map((sym, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 font-bold text-sky-300">{sym.name}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getTypeBadge(sym.type_name)}`}>
                      {sym.type_name}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-300">
                    <span className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-[11px]">
                      {sym.scope} (lvl {sym.scope_level})
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {sym.kind}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right text-slate-400 font-mono">{sym.line}</td>
                  <td className="py-2 px-3">
                    {sym.is_used ? (
                      <span className="flex items-center space-x-1 text-emerald-400 text-[11px]">
                        <Check className="w-3.5 h-3.5" />
                        <span>Active / Read</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-amber-400 text-[11px]">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Unread Variable</span>
                      </span>
                    )}
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
