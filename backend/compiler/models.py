from __future__ import annotations
from typing import List, Dict, Any, Optional, Union
from pydantic import BaseModel, Field


class Diagnostic(BaseModel):
    severity: str = "error"  # error, warning, info, success
    stage: str  # lexical, syntax, semantic, type, ir, optimization, codegen
    line: int
    column: int
    code: str  # LEX001, SYN001, SEM001, TYP001, etc.
    message: str
    suggestion: Optional[str] = None


class TokenModel(BaseModel):
    index: int
    lexeme: str
    token_type: str
    category: str
    line: int
    column: int
    value: Optional[Any] = None


class ASTNodeModel(BaseModel):
    id: str
    type: str
    label: str
    line: Optional[int] = None
    column: Optional[int] = None
    inferred_type: Optional[str] = None
    details: Dict[str, Any] = Field(default_factory=dict)
    children: List[ASTNodeModel] = Field(default_factory=list)


class SymbolModel(BaseModel):
    name: str
    type_name: str
    scope: str
    scope_level: int
    kind: str  # variable, function, parameter
    line: int
    column: int
    is_constant: bool = False
    is_used: bool = False
    value: Optional[Any] = None
    param_types: Optional[List[str]] = None
    return_type: Optional[str] = None


class ScopeTreeModel(BaseModel):
    name: str
    level: int
    parent: Optional[str] = None
    symbols: List[SymbolModel] = Field(default_factory=list)
    children: List[ScopeTreeModel] = Field(default_factory=list)


class TACInstructionModel(BaseModel):
    index: int
    op: str
    arg1: Optional[str] = None
    arg2: Optional[str] = None
    result: Optional[str] = None
    raw: str
    is_leader: bool = False
    block_id: Optional[str] = None


class QuadrupleModel(BaseModel):
    index: int
    op: str
    arg1: str
    arg2: str
    result: str


class TripleModel(BaseModel):
    index: int
    op: str
    arg1: str
    arg2: str


class BackpatchRecordModel(BaseModel):
    id: str
    condition_expr: str
    true_list: List[int]
    false_list: List[int]
    next_list: List[int]
    resolved_true: Optional[str] = None
    resolved_false: Optional[str] = None


class BasicBlockModel(BaseModel):
    id: str
    label: str
    start_index: int
    end_index: int
    instructions: List[TACInstructionModel]
    predecessors: List[str] = Field(default_factory=list)
    successors: List[str] = Field(default_factory=list)


class FlowGraphEdgeModel(BaseModel):
    source: str
    target: str
    label: Optional[str] = None  # true, false, jump, fallthrough


class FlowGraphModel(BaseModel):
    nodes: List[BasicBlockModel]
    edges: List[FlowGraphEdgeModel]


class OptimizationPassModel(BaseModel):
    pass_type: str  # Constant Folding, Algebraic Simplification, Constant Propagation, Peephole, Dead Code
    description: str
    line_affected: Optional[int] = None
    before: str
    after: str


class OptimizationReportModel(BaseModel):
    passes_applied: List[OptimizationPassModel]
    counts_by_type: Dict[str, int]
    instructions_before: int
    instructions_after: int
    reduction_percentage: float
    optimized_tac: List[TACInstructionModel]


class TargetInstructionModel(BaseModel):
    index: int
    opcode: str  # LOAD, STORE, ADD, SUB, MUL, DIV, CMP, JMP, JMPZ, CALL, RET, PRINT, HALT
    operands: List[str]
    raw: str
    comment: Optional[str] = None


class NextUseEntryModel(BaseModel):
    instruction_index: int
    instruction_raw: str
    variable: str
    next_use_line: Optional[int] = None  # None if dead / no further use in block
    is_live: bool


class StackFrameSlotModel(BaseModel):
    offset: int
    name: str
    type_name: str
    role: str  # param, local, return_address, saved_fp
    value: Optional[Any] = None


class StackFrameModel(BaseModel):
    function_name: str
    slots: List[StackFrameSlotModel]
    frame_size_bytes: int


class StageTimingModel(BaseModel):
    stage: str
    duration_ms: float
    status: str  # success, error, skipped


class CompilationResult(BaseModel):
    success: bool
    source_code: str
    failed_stage: Optional[str] = None
    diagnostics: List[Diagnostic] = Field(default_factory=list)
    timings: List[StageTimingModel] = Field(default_factory=list)
    
    # Stage artifacts (available up to the failed stage)
    tokens: List[TokenModel] = Field(default_factory=list)
    token_stats: Dict[str, int] = Field(default_factory=dict)
    
    parse_tree_trace: List[str] = Field(default_factory=list)
    ast: Optional[ASTNodeModel] = None
    ast_node_count: int = 0
    
    symbol_table: List[SymbolModel] = Field(default_factory=list)
    scope_tree: Optional[ScopeTreeModel] = None
    
    semantic_report: Dict[str, Any] = Field(default_factory=dict)
    
    tac_instructions: List[TACInstructionModel] = Field(default_factory=list)
    quadruples: List[QuadrupleModel] = Field(default_factory=list)
    triples: List[TripleModel] = Field(default_factory=list)
    backpatch_records: List[BackpatchRecordModel] = Field(default_factory=list)
    
    basic_blocks: List[BasicBlockModel] = Field(default_factory=list)
    flow_graph: Optional[FlowGraphModel] = None
    optimization: Optional[OptimizationReportModel] = None
    
    target_code: List[TargetInstructionModel] = Field(default_factory=list)
    next_use_table: List[NextUseEntryModel] = Field(default_factory=list)
    stack_frames: List[StackFrameModel] = Field(default_factory=list)
    
    summary: Dict[str, Any] = Field(default_factory=dict)


class CompileRequest(BaseModel):
    source_code: str
    stop_after_stage: Optional[str] = None  # None for full pipeline, or lexer, parser, semantic, ir, optimization, codegen
    optimizations_enabled: bool = True
