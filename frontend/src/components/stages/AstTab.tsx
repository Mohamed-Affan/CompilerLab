import React, { useState, useMemo } from "react";
import { ASTNodeModel } from "../../types/compiler";
import {
  Network,
  ListTree,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronRight,
  ChevronDown,
  Info,
  CheckCircle2,
  Layers,
  Sparkles,
  Maximize2
} from "lucide-react";

interface AstTabProps {
  ast?: ASTNodeModel;
  nodeCount: number;
}

interface LayoutNode {
  node: ASTNodeModel;
  x: number;
  y: number;
  width: number;
  height: number;
  children: LayoutNode[];
}

export const AstTab: React.FC<AstTabProps> = ({ ast, nodeCount }) => {
  const [viewMode, setViewMode] = useState<"visual_graph" | "hierarchy_tree">("visual_graph");
  const [selectedNode, setSelectedNode] = useState<ASTNodeModel | null>(ast || null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());

  // Compute 2D tree layout for SVG visual graph
  const layoutTree = useMemo(() => {
    if (!ast) return null;

    const NODE_W = 160;
    const NODE_H = 48;
    const LEVEL_GAP = 90;
    const SIBLING_GAP = 30;

    let currentLeafX = 0;

    function buildLayout(node: ASTNodeModel, depth: number): LayoutNode {
      const isCollapsed = collapsedNodes.has(node.id);
      const childLayouts: LayoutNode[] = [];

      if (!isCollapsed && node.children && node.children.length > 0) {
        for (const child of node.children) {
          childLayouts.push(buildLayout(child, depth + 1));
        }
      }

      let xPos = 0;
      if (childLayouts.length === 0) {
        xPos = currentLeafX;
        currentLeafX += NODE_W + SIBLING_GAP;
      } else {
        const firstChild = childLayouts[0];
        const lastChild = childLayouts[childLayouts.length - 1];
        xPos = (firstChild.x + lastChild.x) / 2;
      }

      return {
        node,
        x: xPos,
        y: depth * (NODE_H + LEVEL_GAP) + 30,
        width: NODE_W,
        height: NODE_H,
        children: childLayouts,
      };
    }

    return buildLayout(ast, 0);
  }, [ast, collapsedNodes]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const toggleCollapse = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const next = new Set(collapsedNodes);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCollapsedNodes(next);
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case "Program":
        return { bg: "#312e81", border: "#818cf8", text: "#e0e7ff", badge: "bg-indigo-500/30 text-indigo-200" };
      case "VarDecl":
        return { bg: "#0c4a6e", border: "#38bdf8", text: "#e0f2fe", badge: "bg-sky-500/30 text-sky-200" };
      case "Assign":
        return { bg: "#164e63", border: "#22d3ee", text: "#ecfeff", badge: "bg-cyan-500/30 text-cyan-200" };
      case "BinaryExpression":
        return { bg: "#78350f", border: "#f59e0b", text: "#fef3c7", badge: "bg-amber-500/30 text-amber-200" };
      case "UnaryExpression":
        return { bg: "#7c2d12", border: "#fb923c", text: "#ffedd5", badge: "bg-orange-500/30 text-orange-200" };
      case "Literal":
        return { bg: "#064e3b", border: "#34d399", text: "#ecfdf5", badge: "bg-emerald-500/30 text-emerald-200" };
      case "Identifier":
        return { bg: "#581c87", border: "#c084fc", text: "#faf5ff", badge: "bg-purple-500/30 text-purple-200" };
      case "IfStatement":
      case "WhileStatement":
        return { bg: "#881337", border: "#fb7185", text: "#fff1f2", badge: "bg-rose-500/30 text-rose-200" };
      case "FunctionDecl":
      case "FunctionCall":
        return { bg: "#701a75", border: "#f472b6", text: "#fdf2f8", badge: "bg-fuchsia-500/30 text-fuchsia-200" };
      default:
        return { bg: "#1e293b", border: "#64748b", text: "#f1f5f9", badge: "bg-slate-700 text-slate-300" };
    }
  };

  // Render SVG links and nodes recursively
  const renderSvgGraph = (layout: LayoutNode): React.ReactNode => {
    const isSelected = selectedNode?.id === layout.node.id;
    const isCollapsed = collapsedNodes.has(layout.node.id);
    const hasChildren = layout.node.children && layout.node.children.length > 0;
    const colors = getNodeColor(layout.node.type);

    return (
      <g key={layout.node.id}>
        {/* Curved Connector Lines to Children */}
        {layout.children.map((child) => {
          const startX = layout.x + layout.width / 2;
          const startY = layout.y + layout.height;
          const endX = child.x + child.width / 2;
          const endY = child.y;
          const midY = (startY + endY) / 2;

          const pathD = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;

          return (
            <path
              key={`${layout.node.id}->${child.node.id}`}
              d={pathD}
              fill="none"
              stroke="rgba(56, 189, 248, 0.4)"
              strokeWidth="2"
              className="transition-all"
            />
          );
        })}

        {/* Node Box */}
        <g
          transform={`translate(${layout.x}, ${layout.y})`}
          onClick={() => setSelectedNode(layout.node)}
          className="cursor-pointer group"
        >
          <rect
            width={layout.width}
            height={layout.height}
            rx="8"
            fill={colors.bg}
            stroke={isSelected ? "#38bdf8" : colors.border}
            strokeWidth={isSelected ? 3 : 1.5}
            filter={isSelected ? "drop-shadow(0 0 10px rgba(56, 189, 248, 0.6))" : "drop-shadow(0 4px 6px rgba(0,0,0,0.4))"}
            className="transition-all"
          />

          {/* Node Type Banner */}
          <text
            x="10"
            y="18"
            fill="#94a3b8"
            fontSize="9"
            fontWeight="bold"
            fontFamily="JetBrains Mono, monospace"
            letterSpacing="0.5"
          >
            {layout.node.type.toUpperCase()}
          </text>

          {/* Node Label Text */}
          <text
            x="10"
            y="36"
            fill={colors.text}
            fontSize="11"
            fontWeight="600"
            fontFamily="JetBrains Mono, monospace"
          >
            {layout.node.label.length > 18 ? layout.node.label.substring(0, 16) + "..." : layout.node.label}
          </text>

          {/* Type Badge */}
          {layout.node.inferred_type && (
            <g transform={`translate(${layout.width - 45}, 8)`}>
              <rect width="38" height="14" rx="4" fill="rgba(0,0,0,0.6)" stroke={colors.border} strokeWidth="0.5" />
              <text x="19" y="10.5" textAnchor="middle" fill="#34d399" fontSize="8" fontWeight="bold">
                {layout.node.inferred_type}
              </text>
            </g>
          )}

          {/* Collapse/Expand Action Button */}
          {hasChildren && (
            <circle
              cx={layout.width / 2}
              cy={layout.height}
              r="7"
              fill="#0f172a"
              stroke="#38bdf8"
              strokeWidth="1.5"
              onClick={(e) => toggleCollapse(layout.node.id, e)}
              className="hover:fill-sky-500 transition-colors"
            />
          )}
        </g>

        {/* Recursive Children */}
        {layout.children.map((child) => renderSvgGraph(child))}
      </g>
    );
  };

  // Render Indented Tree View
  const renderIndentedTree = (node: ASTNodeModel) => {
    const isCollapsed = collapsedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode?.id === node.id;
    const colors = getNodeColor(node.type);

    return (
      <div key={node.id} className="ml-5 relative">
        <div
          onClick={() => setSelectedNode(node)}
          className={`flex items-center space-x-2 py-1.5 px-3 rounded-lg border my-1 cursor-pointer transition-all ${
            isSelected
              ? "bg-sky-950/60 border-sky-400 font-bold shadow-md shadow-sky-500/20"
              : "bg-[#0f172a]/80 border-slate-800 hover:border-slate-600"
          }`}
        >
          {hasChildren && (
            <button
              onClick={(e) => toggleCollapse(node.id, e)}
              className="p-0.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}

          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${colors.badge}`}>
            {node.type}
          </span>

          <span className="font-mono text-xs text-slate-200 font-semibold">{node.label}</span>

          {node.inferred_type && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
              type: {node.inferred_type}
            </span>
          )}

          {node.line && <span className="text-[10px] text-slate-500 font-mono">L{node.line}</span>}
        </div>

        {hasChildren && !isCollapsed && (
          <div className="border-l-2 border-slate-800 pl-2">
            {node.children.map((child) => renderIndentedTree(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full bg-[#070b14] overflow-hidden select-none">
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col border-r border-[#1e293b]/80 relative overflow-hidden">
        {/* Top Control Bar */}
        <div className="bg-[#0b101d] border-b border-[#1e293b] px-4 py-2.5 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
              <Network className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xs text-white">Interactive AST Explorer</span>
                <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800 px-1.5 py-0.5 rounded font-mono">
                  {nodeCount} Nodes
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Decorated syntax tree with static type annotations</p>
            </div>
          </div>

          {/* Mode Switcher & Zoom Controls */}
          <div className="flex items-center space-x-2">
            {viewMode === "visual_graph" && (
              <div className="flex items-center space-x-1 bg-[#070b14] p-1 rounded-lg border border-[#1e293b]">
                <button
                  onClick={() => setZoom((z) => Math.min(z + 0.15, 2.5))}
                  title="Zoom In"
                  className="p-1 hover:text-sky-400 text-slate-400 rounded transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoom((z) => Math.max(z - 0.15, 0.4))}
                  title="Zoom Out"
                  className="p-1 hover:text-sky-400 text-slate-400 rounded transition-colors"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setZoom(1);
                    setPan({ x: 40, y: 40 });
                  }}
                  title="Reset Viewport"
                  className="p-1 hover:text-white text-slate-400 rounded transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center space-x-1 bg-[#070b14] p-1 rounded-lg border border-[#1e293b]">
              <button
                onClick={() => setViewMode("visual_graph")}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs transition-all ${
                  viewMode === "visual_graph"
                    ? "bg-sky-500 text-white font-bold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Network className="w-3 h-3" />
                <span>2D Graph</span>
              </button>
              <button
                onClick={() => setViewMode("hierarchy_tree")}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs transition-all ${
                  viewMode === "hierarchy_tree"
                    ? "bg-sky-500 text-white font-bold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ListTree className="w-3 h-3" />
                <span>Tree List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Body */}
        <div
          className="flex-1 relative overflow-hidden bg-[#070b14] bg-grid-pattern cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {viewMode === "visual_graph" ? (
            layoutTree ? (
              <svg
                className="w-full h-full"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: "0 0",
                  transition: isDragging ? "none" : "transform 0.1s ease-out",
                }}
              >
                {renderSvgGraph(layoutTree)}
              </svg>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                Click "Compile" to generate the AST.
              </div>
            )
          ) : (
            <div className="p-4 overflow-y-auto h-full">{ast ? renderIndentedTree(ast) : null}</div>
          )}
        </div>
      </div>

      {/* Right: Node Attribute Inspector Sidebar */}
      <div className="w-80 bg-[#090d16] p-4 flex flex-col space-y-4 overflow-y-auto border-l border-[#1e293b]/60">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-800 text-xs text-slate-300 font-bold">
          <Info className="w-4 h-4 text-sky-400" />
          <span>AST Node Details</span>
        </div>

        {selectedNode ? (
          <div className="space-y-3 font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Grammar Node Type</span>
              <div className="text-sky-300 font-extrabold text-sm mt-0.5">{selectedNode.type}</div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Node Representation</span>
              <div className="text-slate-200 bg-[#0f172a] p-2.5 rounded-lg border border-slate-800 break-words mt-0.5">
                {selectedNode.label}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#0f172a] p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase font-bold block">Inferred Type</span>
                <span className="text-emerald-400 font-bold text-xs">{selectedNode.inferred_type || "void"}</span>
              </div>
              <div className="bg-[#0f172a] p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase font-bold block">Source Position</span>
                <span className="text-slate-300 text-xs">{selectedNode.line ? `Line ${selectedNode.line}` : "—"}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Node Metadata Attributes</span>
              <pre className="bg-[#0f172a] p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap mt-0.5">
                {JSON.stringify(selectedNode.details, null, 2)}
              </pre>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Subtree Branches</span>
              <div className="text-slate-300 mt-0.5">
                {selectedNode.children ? selectedNode.children.length : 0} direct child nodes
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 text-xs">
            Click any node in the visual tree to inspect its type, operator, and grammar attributes.
          </div>
        )}
      </div>
    </div>
  );
};
