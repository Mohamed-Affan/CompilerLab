import React, { useState } from "react";
import { SymbolModel, ScopeTreeModel } from "../../types/compiler";
import { Database, Search, GitFork, Check, AlertCircle } from "lucide-react";

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

  const renderScopeTree = (node: ScopeTreeModel, depth = 0) => {
    return (
      <div key={node.name} className="ml-4 border-l border-slate-700 pl-3 my-1">
        <div className="flex items-center space-x-2 py-1">
          <GitFork className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-mono text-xs font-bold text-white">{node.name}</span>
          <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.2 rounded font-mono">
            Level {node.level} ({node.symbols.length} symbols)
          </span>
        </div>

        {node.symbols.length > 0 && (
          <div className="grid grid-cols-2 gap-1 my-1 ml-2">
            {node.symbols.map((sym) => (
              <div
                key={sym.name}
                className="bg-[#0f172a] border border-[#1e293b] px-2 py-1 rounded text-[11px] font-mono flex items-center justify-between"
              >
                <span className="text-sky-300 font-semibold">{sym.name}</span>
                <span className="text-emerald-400 text-[10px]">{sym.type_name}</span>
              </div>
            ))}
          </div>
        )}

        {node.children && node.children.map((c) => renderScopeTree(c, depth + 1))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] p-4 space-y-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Database className="w-4 h-4 text-sky-400" />
            <span>Scoped Symbol Table & Identifier Environment (Unit III)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Maintains identifier bindings, scope levels, data types, function signatures, and liveness.
          </p>
        </div>
        <span className="text-xs font-mono text-sky-400 bg-sky-950/40 border border-sky-800/60 px-2.5 py-1 rounded">
          Total Symbols: {symbolTable.length}
        </span>
      </div>

      {/* Scope Hierarchy Visualizer */}
      {scopeTree && (
        <div className="bg-[#090d16] border border-[#1e293b] p-3 rounded-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Scope Hierarchy Tree
          </span>
          <div className="font-mono text-xs text-slate-300">{renderScopeTree(scopeTree)}</div>
        </div>
      )}

      {/* Search & Scope Filters */}
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search identifier name or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#090d16] border border-[#1e293b] rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500"
          />
        </div>

        <select
          value={selectedScope}
          onChange={(e) => setSelectedScope(e.target.value)}
          className="bg-[#090d16] border border-[#1e293b] rounded-md px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-sky-500 cursor-pointer"
        >
          {scopes.map((sc) => (
            <option key={sc} value={sc}>
              Scope: {sc}
            </option>
          ))}
        </select>
      </div>

      {/* Symbol Table View */}
      <div className="border border-[#1e293b] rounded-lg overflow-hidden flex-1 bg-[#090d16]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#0f172a] text-slate-400 text-[11px] uppercase border-b border-[#1e293b]">
            <tr>
              <th className="py-2 px-3">Identifier</th>
              <th className="py-2 px-3">Data Type</th>
              <th className="py-2 px-3">Scope</th>
              <th className="py-2 px-3">Kind</th>
              <th className="py-2 px-3 text-right">Decl Line</th>
              <th className="py-2 px-3">Liveness / Usage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filteredSymbols.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No symbols found.
                </td>
              </tr>
            ) : (
              filteredSymbols.map((sym, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 font-bold text-sky-300">{sym.name}</td>
                  <td className="py-2 px-3">
                    <span className="bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-emerald-300 font-semibold">
                      {sym.type_name}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-400">
                    <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">{sym.scope}</span>
                  </td>
                  <td className="py-2 px-3">
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {sym.kind}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right text-slate-400">{sym.line}</td>
                  <td className="py-2 px-3">
                    {sym.is_used ? (
                      <span className="flex items-center space-x-1 text-emerald-400 text-[11px]">
                        <Check className="w-3 h-3" />
                        <span>Used in expressions</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-amber-400 text-[11px]">
                        <AlertCircle className="w-3 h-3" />
                        <span>Declared (Unread)</span>
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
