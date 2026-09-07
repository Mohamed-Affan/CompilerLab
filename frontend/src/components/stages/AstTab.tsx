import React, { useState } from "react";
import { ASTNodeModel } from "../../types/compiler";
import { Network, ChevronRight, ChevronDown, Info, Tag, Hash, FileCode } from "lucide-react";

interface AstTabProps {
  ast?: ASTNodeModel;
  nodeCount: number;
}

export const AstTab: React.FC<AstTabProps> = ({ ast, nodeCount }) => {
  const [selectedNode, setSelectedNode] = useState<ASTNodeModel | null>(ast || null);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());

  const toggleCollapse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(collapsedNodes);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCollapsedNodes(next);
  };

  const renderNode = (node: ASTNodeModel, depth = 0) => {
    const isCollapsed = collapsedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode?.id === node.id;

    const getNodeColor = (type: string) => {
      switch (type) {
        case "Program":
          return "border-indigo-500/50 bg-indigo-950/30 text-indigo-300";
        case "VarDecl":
          return "border-sky-500/50 bg-sky-950/30 text-sky-300";
        case "Assign":
          return "border-cyan-500/50 bg-cyan-950/30 text-cyan-300";
        case "BinaryExpression":
          return "border-amber-500/50 bg-amber-950/30 text-amber-300";
        case "UnaryExpression":
          return "border-orange-500/50 bg-orange-950/30 text-orange-300";
        case "Literal":
          return "border-emerald-500/50 bg-emerald-950/30 text-emerald-300";
        case "Identifier":
          return "border-purple-500/50 bg-purple-950/30 text-purple-300";
        case "IfStatement":
        case "WhileStatement":
          return "border-rose-500/50 bg-rose-950/30 text-rose-300";
        case "FunctionDecl":
        case "FunctionCall":
          return "border-fuchsia-500/50 bg-fuchsia-950/30 text-fuchsia-300";
        default:
          return "border-slate-700 bg-slate-900 text-slate-300";
      }
    };

    return (
      <div key={node.id} className="flex flex-col ml-4 relative">
        {/* Node Pill */}
        <div
          onClick={() => setSelectedNode(node)}
          className={`flex items-center space-x-2 py-1.5 px-3 rounded-lg border my-1 cursor-pointer transition-all ${getNodeColor(
            node.type
          )} ${isSelected ? "ring-2 ring-sky-400 font-bold shadow-lg" : "hover:border-slate-400"}`}
        >
          {hasChildren && (
            <button
              onClick={(e) => toggleCollapse(node.id, e)}
              className="p-0.5 hover:bg-white/10 rounded transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}

          <span className="font-mono text-xs font-semibold">{node.label}</span>

          {node.inferred_type && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950/60 text-slate-300 border border-slate-700">
              type: {node.inferred_type}
            </span>
          )}

          {node.line && (
            <span className="text-[10px] text-slate-500 font-mono">
              L{node.line}
            </span>
          )}
        </div>

        {/* Children Recursion */}
        {hasChildren && !isCollapsed && (
          <div className="border-l-2 border-slate-800/80 pl-2">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full bg-[#0b0f19] overflow-hidden">
      {/* Left: Tree Viewer */}
      <div className="flex-1 flex flex-col border-r border-[#1e293b] p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Network className="w-4 h-4 text-sky-400" />
              <span>Abstract Syntax Tree (AST) Visualization</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Constructed hierarchical syntax tree with decorated static type annotations.
            </p>
          </div>
          <span className="text-xs font-mono text-sky-400 bg-sky-950/40 border border-sky-800/60 px-2.5 py-1 rounded">
            Total AST Nodes: {nodeCount}
          </span>
        </div>

        <div className="flex-1 bg-[#090d16] border border-[#1e293b] rounded-lg p-4 overflow-auto">
          {ast ? (
            renderNode(ast)
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs">
              No AST available. Click "Compile" to generate syntax tree.
            </div>
          )}
        </div>
      </div>

      {/* Right: Selected Node Inspector */}
      <div className="w-80 bg-[#090d16] p-4 flex flex-col space-y-4 overflow-y-auto select-none">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-800 text-slate-400 text-xs">
          <Info className="w-4 h-4 text-sky-400" />
          <span className="font-semibold text-white">AST Node Inspector</span>
        </div>

        {selectedNode ? (
          <div className="space-y-3 text-xs font-mono">
            <div>
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Node Type</span>
              <p className="text-sky-300 font-bold text-sm">{selectedNode.type}</p>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Node Label</span>
              <p className="text-slate-200 bg-[#0f172a] p-2 rounded border border-slate-800 break-words">
                {selectedNode.label}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#0f172a] p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Inferred Type</span>
                <span className="text-emerald-400 font-bold">{selectedNode.inferred_type || "N/A"}</span>
              </div>
              <div className="bg-[#0f172a] p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Position</span>
                <span className="text-slate-300">
                  {selectedNode.line ? `Line ${selectedNode.line}` : "—"}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Node Details</span>
              <pre className="bg-[#0f172a] p-2 rounded border border-slate-800 text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(selectedNode.details, null, 2)}
              </pre>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Child Count</span>
              <p className="text-slate-300">{selectedNode.children ? selectedNode.children.length : 0} children</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 text-xs">
            Click any node in the AST tree to inspect its type and attributes.
          </div>
        )}
      </div>
    </div>
  );
};
