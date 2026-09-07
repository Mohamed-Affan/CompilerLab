import React, { useState, useEffect } from "react";
import { Header } from "./components/layout/Header";
import { PipelineBar } from "./components/layout/PipelineBar";
import { FileManager, VirtualFile } from "./components/editor/FileManager";
import { CodeEditor } from "./components/editor/CodeEditor";
import { DiagnosticsDrawer } from "./components/diagnostics/DiagnosticsDrawer";

import { LexerTab } from "./components/stages/LexerTab";
import { ParserTab } from "./components/stages/ParserTab";
import { AstTab } from "./components/stages/AstTab";
import { SymbolTableTab } from "./components/stages/SymbolTableTab";
import { SemanticTab } from "./components/stages/SemanticTab";
import { IrTab } from "./components/stages/IrTab";
import { OptimizerTab } from "./components/stages/OptimizerTab";
import { FlowGraphTab } from "./components/stages/FlowGraphTab";
import { CodeGenTab } from "./components/stages/CodeGenTab";
import { ReportTab } from "./components/stages/ReportTab";

import { ParserLab } from "./components/educational/ParserLab";
import { TypeExplorer } from "./components/educational/TypeExplorer";
import { LearningLab } from "./components/educational/LearningLab";
import { QuizModal } from "./components/educational/QuizModal";
import { DashboardTab } from "./components/dashboard/DashboardTab";

import { compilerApi } from "./api/compilerApi";
import { CompilationResult, ExampleProgram, Diagnostic } from "./types/compiler";

const DEFAULT_MAIN_CODE = `// SimpleLang Demo: Variables & Arithmetic Optimization
let age : int = 20;
let salary : float = 45000.5;
let bonus : float = 5000.0;
let totalCompensation : float = salary + bonus;

let x : int = 10 * 2;
let y : int = x + 0;
let z : int = y * 1;

print(totalCompensation);
print(z);
`;

export const App: React.FC = () => {
  // Navigation State
  const [activeView, setActiveView] = useState<"studio" | "parser_lab" | "type_explorer" | "learning_lab" | "quiz" | "dashboard">("studio");
  const [activeStageTab, setActiveStageTab] = useState<string>("lexer");

  // Virtual Files Workspace
  const [files, setFiles] = useState<VirtualFile[]>([
    { id: "main.spl", name: "main.spl", content: DEFAULT_MAIN_CODE },
    {
      id: "functions.spl",
      name: "functions.spl",
      content: `// SimpleLang Demo: Typed Functions & Scopes
function add(a : int, b : int) : int {
    let sum : int = a + b;
    return sum;
}

let num1 : int = 15;
let num2 : int = 25;
let result : int = add(num1, num2);
print(result);
`,
    },
    {
      id: "types.spl",
      name: "types.spl",
      content: `// SimpleLang Demo: Explicit Type Conversions
let baseVal : int = 100;
let floatVal : float = intToFloat(baseVal);
let scaled : float = floatVal * 1.5;
let truncated : int = floatToInt(scaled);
print(truncated);
`,
    },
  ]);
  const [activeFileId, setActiveFileId] = useState<string>("main.spl");

  // Compilation State
  const [status, setStatus] = useState<"ready" | "compiling" | "success" | "error">("ready");
  const [compilationResult, setCompilationResult] = useState<CompilationResult | null>(null);
  const [optimizationsEnabled, setOptimizationsEnabled] = useState(true);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(true);
  const [highlightLine, setHighlightLine] = useState<number | undefined>(undefined);

  // Examples
  const [examples, setExamples] = useState<ExampleProgram[]>([]);
  const [selectedExampleId, setSelectedExampleId] = useState<string>("basic_variables");

  const currentFile = files.find((f) => f.id === activeFileId) || files[0];

  // Fetch examples on mount
  useEffect(() => {
    compilerApi.getExamples().then((exList) => {
      setExamples(exList);
    }).catch(console.error);

    // Initial compile
    handleCompile(currentFile.content);
  }, []);

  const handleCodeChange = (newCode: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, content: newCode } : f))
    );
  };

  const handleCompile = async (codeToCompile = currentFile.content) => {
    setStatus("compiling");
    try {
      const result = await compilerApi.compile(codeToCompile, undefined, optimizationsEnabled);
      setCompilationResult(result);
      setStatus(result.success ? "success" : "error");

      // Auto-open diagnostics if there are errors
      if (!result.success && result.diagnostics.length > 0) {
        setIsDiagnosticsOpen(true);
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const handleSelectExample = (ex: ExampleProgram) => {
    setSelectedExampleId(ex.id);
    handleCodeChange(ex.code);
    handleCompile(ex.code);
  };

  const handleReset = () => {
    handleCodeChange(DEFAULT_MAIN_CODE);
    handleCompile(DEFAULT_MAIN_CODE);
  };

  const handleBreakIt = () => {
    // Introduce a realistic error mutation into the code
    const code = currentFile.content;
    let mutatedCode = code;

    if (code.includes(": int =")) {
      mutatedCode = code.replace(/: int = \d+;/, ': int = "mismatched_string_type";');
    } else if (code.includes("print(")) {
      mutatedCode = code.replace(/print\((\w+)\);/, 'print(undeclared_variable_x);');
    } else if (code.includes(";")) {
      mutatedCode = code.replace(/;\n/, "\n");
    } else {
      mutatedCode = code + '\nlet invalidAssignment : int = "twenty";\n';
    }

    handleCodeChange(mutatedCode);
    handleCompile(mutatedCode);
  };

  const handleAddFile = () => {
    const name = prompt("Enter new SimpleLang filename (e.g. math.spl):", `module_${files.length + 1}.spl`);
    if (!name) return;
    const cleanName = name.endsWith(".spl") ? name : `${name}.spl`;
    const newFile: VirtualFile = {
      id: cleanName,
      name: cleanName,
      content: `// SimpleLang Module: ${cleanName}\nlet value : int = 42;\nprint(value);\n`,
    };
    setFiles([...files, newFile]);
    setActiveFileId(newFile.id);
  };

  const handleDeleteFile = (id: string) => {
    if (files.length <= 1) return;
    const remaining = files.filter((f) => f.id !== id);
    setFiles(remaining);
    if (activeFileId === id) {
      setActiveFileId(remaining[0].id);
    }
  };

  const totalTime = compilationResult?.timings?.reduce((acc, t) => acc + t.duration_ms, 0) || 0;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#090d16] text-slate-100 font-sans">
      {/* Top Main Navigation Header */}
      <Header
        status={status}
        onCompile={() => handleCompile()}
        onReset={handleReset}
        onBreakIt={handleBreakIt}
        examples={examples}
        selectedExampleId={selectedExampleId}
        onSelectExample={handleSelectExample}
        activeView={activeView}
        onSelectView={setActiveView}
        optimizationsEnabled={optimizationsEnabled}
        onToggleOptimizations={() => {
          const next = !optimizationsEnabled;
          setOptimizationsEnabled(next);
          compilerApi.compile(currentFile.content, undefined, next).then(setCompilationResult);
        }}
      />

      {/* Main Content Area */}
      {activeView === "studio" && (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Hero Pipeline Navigation Bar */}
          <PipelineBar
            timings={compilationResult?.timings || []}
            activeStageTab={activeStageTab}
            onSelectStageTab={setActiveStageTab}
            failedStage={compilationResult?.failed_stage}
            totalTimeMs={totalTime}
          />

          {/* Workspace Split Panels */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Panel: File Manager + Code Editor */}
            <div className="w-1/2 flex flex-col border-r border-[#1e293b]">
              <FileManager
                files={files}
                activeFileId={activeFileId}
                onSelectFile={setActiveFileId}
                onAddFile={handleAddFile}
                onDeleteFile={handleDeleteFile}
              />
              <div className="flex-1 overflow-hidden">
                <CodeEditor
                  code={currentFile.content}
                  onChange={handleCodeChange}
                  diagnostics={compilationResult?.diagnostics || []}
                  onCompile={() => handleCompile()}
                  activeLine={highlightLine}
                />
              </div>
            </div>

            {/* Right Panel: Compiler Stage Inspector */}
            <div className="w-1/2 flex flex-col bg-[#0b0f19] overflow-hidden">
              {/* Active Stage Panel Render */}
              <div className="flex-1 overflow-hidden">
                {activeStageTab === "lexer" && (
                  <LexerTab
                    tokens={compilationResult?.tokens || []}
                    tokenStats={compilationResult?.token_stats || {}}
                  />
                )}
                {activeStageTab === "parser" && (
                  <ParserTab
                    parseTreeTrace={compilationResult?.parse_tree_trace || []}
                  />
                )}
                {activeStageTab === "ast" && (
                  <AstTab
                    ast={compilationResult?.ast}
                    nodeCount={compilationResult?.ast_node_count || 0}
                  />
                )}
                {activeStageTab === "symbols" && (
                  <SymbolTableTab
                    symbolTable={compilationResult?.symbol_table || []}
                    scopeTree={compilationResult?.scope_tree}
                  />
                )}
                {activeStageTab === "semantic" && (
                  <SemanticTab
                    semanticReport={compilationResult?.semantic_report || {}}
                    diagnostics={compilationResult?.diagnostics || []}
                  />
                )}
                {activeStageTab === "ir" && (
                  <IrTab
                    tacInstructions={compilationResult?.tac_instructions || []}
                    quadruples={compilationResult?.quadruples || []}
                    triples={compilationResult?.triples || []}
                    backpatchRecords={compilationResult?.backpatch_records || []}
                  />
                )}
                {activeStageTab === "optimizer" && (
                  <OptimizerTab
                    optimization={compilationResult?.optimization}
                    rawTac={compilationResult?.tac_instructions || []}
                  />
                )}
                {activeStageTab === "flowgraph" && (
                  <FlowGraphTab
                    basicBlocks={compilationResult?.basic_blocks || []}
                    flowGraph={compilationResult?.flow_graph}
                  />
                )}
                {activeStageTab === "codegen" && (
                  <CodeGenTab
                    targetCode={compilationResult?.target_code || []}
                    nextUseTable={compilationResult?.next_use_table || []}
                    stackFrames={compilationResult?.stack_frames || []}
                  />
                )}
                {activeStageTab === "report" && compilationResult && (
                  <ReportTab result={compilationResult} />
                )}
              </div>
            </div>
          </div>

          {/* Bottom Diagnostics Drawer */}
          <DiagnosticsDrawer
            diagnostics={compilationResult?.diagnostics || []}
            isOpen={isDiagnosticsOpen}
            onToggle={() => setIsDiagnosticsOpen(!isDiagnosticsOpen)}
            onSelectLine={(line) => {
              setHighlightLine(line);
              setTimeout(() => setHighlightLine(undefined), 3000);
            }}
          />
        </div>
      )}

      {/* Alternative View Modes */}
      {activeView === "dashboard" && (
        <DashboardTab
          lastResult={compilationResult || undefined}
          onOpenStudio={(stage) => {
            setActiveView("studio");
            if (stage) setActiveStageTab(stage);
          }}
        />
      )}

      {activeView === "parser_lab" && <ParserLab />}
      {activeView === "type_explorer" && <TypeExplorer />}
      {activeView === "learning_lab" && <LearningLab />}
      {activeView === "quiz" && <QuizModal />}
    </div>
  );
};

export default App;
