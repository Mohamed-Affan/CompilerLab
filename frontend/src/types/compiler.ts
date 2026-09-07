export interface Diagnostic {
  severity: "error" | "warning" | "info" | "success";
  stage: "lexical" | "syntax" | "semantic" | "type" | "ir" | "optimization" | "codegen";
  line: number;
  column: number;
  code: string;
  message: string;
  suggestion?: string;
}

export interface TokenModel {
  index: number;
  lexeme: string;
  token_type: string;
  category: "KEYWORD" | "TYPE" | "LITERAL" | "IDENTIFIER" | "OPERATOR" | "ASSIGNMENT" | "DELIMITER" | "COMMENT" | "EOF" | "SPECIAL";
  line: number;
  column: number;
  value?: any;
}

export interface ASTNodeModel {
  id: string;
  type: string;
  label: string;
  line?: number;
  column?: number;
  inferred_type?: string;
  details: Record<string, any>;
  children: ASTNodeModel[];
}

export interface SymbolModel {
  name: string;
  type_name: string;
  scope: string;
  scope_level: number;
  kind: "variable" | "function" | "parameter";
  line: number;
  column: number;
  is_constant: boolean;
  is_used: boolean;
  value?: any;
  param_types?: string[];
  return_type?: string;
}

export interface ScopeTreeModel {
  name: string;
  level: number;
  parent?: string;
  symbols: SymbolModel[];
  children: ScopeTreeModel[];
}

export interface TACInstructionModel {
  index: number;
  op: string;
  arg1?: string;
  arg2?: string;
  result?: string;
  raw: string;
  is_leader: boolean;
  block_id?: string;
}

export interface QuadrupleModel {
  index: number;
  op: string;
  arg1: string;
  arg2: string;
  result: string;
}

export interface TripleModel {
  index: number;
  op: string;
  arg1: string;
  arg2: string;
}

export interface BackpatchRecordModel {
  id: string;
  condition_expr: string;
  true_list: number[];
  false_list: number[];
  next_list: number[];
  resolved_true?: string;
  resolved_false?: string;
}

export interface BasicBlockModel {
  id: string;
  label: string;
  start_index: number;
  end_index: number;
  instructions: TACInstructionModel[];
  predecessors: string[];
  successors: string[];
}

export interface FlowGraphEdgeModel {
  source: string;
  target: string;
  label?: string;
}

export interface FlowGraphModel {
  nodes: BasicBlockModel[];
  edges: FlowGraphEdgeModel[];
}

export interface OptimizationPassModel {
  pass_type: string;
  description: string;
  line_affected?: number;
  before: string;
  after: string;
}

export interface OptimizationReportModel {
  passes_applied: OptimizationPassModel[];
  counts_by_type: Record<string, number>;
  instructions_before: number;
  instructions_after: number;
  reduction_percentage: number;
  optimized_tac: TACInstructionModel[];
}

export interface TargetInstructionModel {
  index: number;
  opcode: string;
  operands: string[];
  raw: string;
  comment?: string;
}

export interface NextUseEntryModel {
  instruction_index: number;
  instruction_raw: string;
  variable: string;
  next_use_line?: number;
  is_live: boolean;
}

export interface StackFrameSlotModel {
  offset: number;
  name: string;
  type_name: string;
  role: string;
  value?: any;
}

export interface StackFrameModel {
  function_name: string;
  slots: StackFrameSlotModel[];
  frame_size_bytes: number;
}

export interface StageTimingModel {
  stage: string;
  duration_ms: number;
  status: "success" | "error" | "skipped";
}

export interface CompilationResult {
  success: boolean;
  source_code: string;
  failed_stage?: string;
  diagnostics: Diagnostic[];
  timings: StageTimingModel[];
  tokens: TokenModel[];
  token_stats: Record<string, number>;
  parse_tree_trace: string[];
  ast?: ASTNodeModel;
  ast_node_count: number;
  symbol_table: SymbolModel[];
  scope_tree?: ScopeTreeModel;
  semantic_report: Record<string, any>;
  tac_instructions: TACInstructionModel[];
  quadruples: QuadrupleModel[];
  triples: TripleModel[];
  backpatch_records: BackpatchRecordModel[];
  basic_blocks: BasicBlockModel[];
  flow_graph?: FlowGraphModel;
  optimization?: OptimizationReportModel;
  target_code: TargetInstructionModel[];
  next_use_table: NextUseEntryModel[];
  stack_frames: StackFrameModel[];
  summary: {
    tokens_count: number;
    ast_nodes_count: number;
    symbols_count: number;
    errors_count: number;
    warnings_count: number;
    tac_instructions_count: number;
    optimizations_count: number;
    target_instructions_count: number;
  };
}

export interface ExampleProgram {
  id: string;
  category: "valid" | "error";
  name: string;
  description: string;
  code: string;
}

export interface Lesson {
  id: string;
  unit: string;
  title: string;
  concept: string;
  summary: string;
  key_points: string[];
  example_code: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}
