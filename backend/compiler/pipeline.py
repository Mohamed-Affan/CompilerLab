import time
from typing import Optional, List, Dict, Any

from .models import (
    CompilationResult, Diagnostic, StageTimingModel, TokenModel,
    ASTNodeModel, SymbolModel, ScopeTreeModel, TACInstructionModel,
    QuadrupleModel, TripleModel, BackpatchRecordModel, BasicBlockModel,
    FlowGraphModel, OptimizationReportModel, TargetInstructionModel,
    NextUseEntryModel, StackFrameModel
)
from .lexer.lexer import Lexer
from .parser.parser import Parser
from .semantic.symbol_table import SymbolTableManager
from .semantic.type_checker import TypeChecker
from .ir.tac import TACGenerator, TACInstruction
from .ir.quadruples import QuadrupleBuilder, TripleBuilder
from .ir.backpatch import BackpatchAnalyzer
from .optimization.basic_blocks import BasicBlockPartitioner
from .optimization.flow_graph import FlowGraphBuilder
from .optimization.optimizer import Optimizer
from .optimization.peephole import PeepholeOptimizer
from .codegen.generator import TargetCodeGenerator
from .codegen.next_use import NextUseAnalyzer
from .codegen.runtime_stack import RuntimeStackVisualizer


class CompilerPipeline:
    def __init__(self):
        pass

    def compile(self, source_code: str, stop_after_stage: Optional[str] = None, optimizations_enabled: bool = True) -> CompilationResult:
        timings: List[StageTimingModel] = []
        diagnostics: List[Diagnostic] = []

        tokens_models: List[TokenModel] = []
        token_stats: Dict[str, int] = {}
        parse_trace: List[str] = []
        ast_model: Optional[ASTNodeModel] = None
        ast_node_count = 0
        symbols_models: List[SymbolModel] = []
        scope_tree_model: Optional[ScopeTreeModel] = None
        semantic_report: Dict[str, Any] = {}
        tac_models: List[TACInstructionModel] = []
        quad_models: List[QuadrupleModel] = []
        triple_models: List[TripleModel] = []
        backpatch_models: List[BackpatchRecordModel] = []
        basic_blocks_models: List[BasicBlockModel] = []
        flow_graph_model: Optional[FlowGraphModel] = None
        optimization_report: Optional[OptimizationReportModel] = None
        target_code_models: List[TargetInstructionModel] = []
        next_use_models: List[NextUseEntryModel] = []
        stack_frames_models: List[StackFrameModel] = []

        # -------------------------------------------------------------
        # 1. STAGE: LEXICAL ANALYSIS
        # -------------------------------------------------------------
        t0 = time.perf_counter()
        lexer = Lexer(source_code)
        raw_tokens, lex_diags = lexer.tokenize()
        t1 = time.perf_counter()
        dur_lexer = round((t1 - t0) * 1000.0, 3)

        tokens_models, token_stats = lexer.to_models()
        diagnostics.extend(lex_diags)

        if lex_diags and any(d.severity == "error" for d in lex_diags):
            timings.append(StageTimingModel(stage="Lexer", duration_ms=dur_lexer, status="error"))
            return CompilationResult(
                success=False,
                source_code=source_code,
                failed_stage="Lexical Analysis",
                diagnostics=diagnostics,
                timings=timings,
                tokens=tokens_models,
                token_stats=token_stats,
                summary=self._build_summary(tokens_models, 0, 0, diagnostics, 0, 0, 0)
            )

        timings.append(StageTimingModel(stage="Lexer", duration_ms=dur_lexer, status="success"))
        if stop_after_stage == "lexer":
            return self._build_result(True, source_code, diagnostics, timings, tokens_models, token_stats)

        # -------------------------------------------------------------
        # 2. STAGE: SYNTAX ANALYSIS & AST GENERATION
        # -------------------------------------------------------------
        t0 = time.perf_counter()
        parser = Parser(raw_tokens)
        ast_root, syn_diags, parse_trace = parser.parse()
        t1 = time.perf_counter()
        dur_parser = round((t1 - t0) * 1000.0, 3)

        diagnostics.extend(syn_diags)

        if ast_root:
            ast_model = ast_root.to_model()
            ast_node_count = self._count_ast_nodes(ast_model)

        if syn_diags and any(d.severity == "error" for d in syn_diags):
            timings.append(StageTimingModel(stage="Parser", duration_ms=dur_parser, status="error"))
            return CompilationResult(
                success=False,
                source_code=source_code,
                failed_stage="Syntax Analysis",
                diagnostics=diagnostics,
                timings=timings,
                tokens=tokens_models,
                token_stats=token_stats,
                parse_tree_trace=parse_trace,
                ast=ast_model,
                ast_node_count=ast_node_count,
                summary=self._build_summary(tokens_models, ast_node_count, 0, diagnostics, 0, 0, 0)
            )

        timings.append(StageTimingModel(stage="Parser", duration_ms=dur_parser, status="success"))
        if stop_after_stage == "parser" or not ast_root:
            return self._build_result(True, source_code, diagnostics, timings, tokens_models, token_stats,
                                       parse_trace=parse_trace, ast=ast_model, ast_count=ast_node_count)

        # -------------------------------------------------------------
        # 3. STAGE: SEMANTIC ANALYSIS & STATIC TYPE CHECKING
        # -------------------------------------------------------------
        t0 = time.perf_counter()
        sym_manager = SymbolTableManager()
        type_checker = TypeChecker(sym_manager)
        sem_diags, semantic_report = type_checker.check(ast_root)
        t1 = time.perf_counter()
        dur_semantic = round((t1 - t0) * 1000.0, 3)

        diagnostics.extend(sem_diags)
        symbols_models = sym_manager.get_symbol_models()
        scope_tree_model = sym_manager.get_scope_tree()

        # Update AST model with inferred types
        ast_model = ast_root.to_model()

        if any(d.severity == "error" for d in sem_diags):
            timings.append(StageTimingModel(stage="Semantic Analysis", duration_ms=dur_semantic, status="error"))
            return CompilationResult(
                success=False,
                source_code=source_code,
                failed_stage="Semantic Analysis",
                diagnostics=diagnostics,
                timings=timings,
                tokens=tokens_models,
                token_stats=token_stats,
                parse_tree_trace=parse_trace,
                ast=ast_model,
                ast_node_count=ast_node_count,
                symbol_table=symbols_models,
                scope_tree=scope_tree_model,
                semantic_report=semantic_report,
                summary=self._build_summary(tokens_models, ast_node_count, len(symbols_models), diagnostics, 0, 0, 0)
            )

        timings.append(StageTimingModel(stage="Semantic Analysis", duration_ms=dur_semantic, status="success"))
        if stop_after_stage == "semantic":
            return self._build_result(True, source_code, diagnostics, timings, tokens_models, token_stats,
                                       parse_trace=parse_trace, ast=ast_model, ast_count=ast_node_count,
                                       symbols=symbols_models, scope_tree=scope_tree_model, semantic_rep=semantic_report)

        # -------------------------------------------------------------
        # 4. STAGE: INTERMEDIATE CODE GENERATION (IR)
        # -------------------------------------------------------------
        t0 = time.perf_counter()
        tac_gen = TACGenerator()
        raw_tac = tac_gen.generate(ast_root)
        quad_models = QuadrupleBuilder.build(raw_tac)
        triple_models = TripleBuilder.build(raw_tac)
        backpatch_models = BackpatchAnalyzer.analyze(raw_tac)
        tac_models = [t.to_model() for t in raw_tac]
        t1 = time.perf_counter()
        dur_ir = round((t1 - t0) * 1000.0, 3)
        timings.append(StageTimingModel(stage="IR Generation", duration_ms=dur_ir, status="success"))

        if stop_after_stage == "ir":
            return self._build_result(True, source_code, diagnostics, timings, tokens_models, token_stats,
                                       parse_trace=parse_trace, ast=ast_model, ast_count=ast_node_count,
                                       symbols=symbols_models, scope_tree=scope_tree_model, semantic_rep=semantic_report,
                                       tac=tac_models, quads=quad_models, triples=triple_models, bp=backpatch_models)

        # -------------------------------------------------------------
        # 5. STAGE: OPTIMIZATION & BASIC BLOCKS
        # -------------------------------------------------------------
        t0 = time.perf_counter()
        active_tac = raw_tac
        if optimizations_enabled:
            optimizer = Optimizer(raw_tac)
            optimization_report = optimizer.optimize()
            # Apply peephole
            optimized_tac_objects = [
                TACInstruction(index=m.index, op=m.op, arg1=m.arg1, arg2=m.arg2, result=m.result)
                for m in optimization_report.optimized_tac
            ]
            peephole_tac = PeepholeOptimizer.optimize_window(optimized_tac_objects, optimization_report.passes_applied)
            active_tac = peephole_tac
            optimization_report.optimized_tac = [i.to_model() for i in peephole_tac]
            optimization_report.instructions_after = len(peephole_tac)
            if optimization_report.instructions_before > 0:
                optimization_report.reduction_percentage = round(
                    ((optimization_report.instructions_before - len(peephole_tac)) / optimization_report.instructions_before) * 100.0, 2
                )
        else:
            optimization_report = OptimizationReportModel(
                passes_applied=[],
                counts_by_type={},
                instructions_before=len(raw_tac),
                instructions_after=len(raw_tac),
                reduction_percentage=0.0,
                optimized_tac=[t.to_model() for t in raw_tac]
            )

        # Construct Basic Blocks & Flow Graph
        basic_blocks_models = BasicBlockPartitioner.partition(active_tac)
        flow_graph_model = FlowGraphBuilder.build(basic_blocks_models)

        t1 = time.perf_counter()
        dur_opt = round((t1 - t0) * 1000.0, 3)
        timings.append(StageTimingModel(stage="Optimization", duration_ms=dur_opt, status="success"))

        if stop_after_stage == "optimization":
            return self._build_result(True, source_code, diagnostics, timings, tokens_models, token_stats,
                                       parse_trace=parse_trace, ast=ast_model, ast_count=ast_node_count,
                                       symbols=symbols_models, scope_tree=scope_tree_model, semantic_rep=semantic_report,
                                       tac=tac_models, quads=quad_models, triples=triple_models, bp=backpatch_models,
                                       blocks=basic_blocks_models, cfg=flow_graph_model, opt=optimization_report)

        # -------------------------------------------------------------
        # 6. STAGE: CODE GENERATION & RUNTIME SIMULATION
        # -------------------------------------------------------------
        t0 = time.perf_counter()
        codegen = TargetCodeGenerator()
        target_code_models = codegen.generate(active_tac)
        next_use_models = NextUseAnalyzer.analyze(active_tac)
        stack_frames_models = RuntimeStackVisualizer.generate_frames(sym_manager)
        t1 = time.perf_counter()
        dur_codegen = round((t1 - t0) * 1000.0, 3)
        timings.append(StageTimingModel(stage="Code Generation", duration_ms=dur_codegen, status="success"))

        summary = self._build_summary(
            tokens_models,
            ast_node_count,
            len(symbols_models),
            diagnostics,
            len(tac_models),
            len(optimization_report.passes_applied) if optimization_report else 0,
            len(target_code_models)
        )

        return CompilationResult(
            success=True,
            source_code=source_code,
            diagnostics=diagnostics,
            timings=timings,
            tokens=tokens_models,
            token_stats=token_stats,
            parse_tree_trace=parse_trace,
            ast=ast_model,
            ast_node_count=ast_node_count,
            symbol_table=symbols_models,
            scope_tree=scope_tree_model,
            semantic_report=semantic_report,
            tac_instructions=tac_models,
            quadruples=quad_models,
            triples=triple_models,
            backpatch_records=backpatch_models,
            basic_blocks=basic_blocks_models,
            flow_graph=flow_graph_model,
            optimization=optimization_report,
            target_code=target_code_models,
            next_use_table=next_use_models,
            stack_frames=stack_frames_models,
            summary=summary
        )

    def _count_ast_nodes(self, node: Optional[ASTNodeModel]) -> int:
        if not node:
            return 0
        count = 1
        for child in node.children:
            count += self._count_ast_nodes(child)
        return count

    def _build_summary(self, tokens, ast_nodes, symbols, diagnostics, tac_count, opt_count, target_count) -> Dict[str, Any]:
        errors = len([d for d in diagnostics if d.severity == "error"])
        warnings = len([d for d in diagnostics if d.severity == "warning"])
        return {
            "tokens_count": len(tokens),
            "ast_nodes_count": ast_nodes,
            "symbols_count": symbols,
            "errors_count": errors,
            "warnings_count": warnings,
            "tac_instructions_count": tac_count,
            "optimizations_count": opt_count,
            "target_instructions_count": target_count,
        }

    def _build_result(self, success, src, diags, timings, tokens, token_stats, **kwargs) -> CompilationResult:
        summary = self._build_summary(
            tokens,
            kwargs.get("ast_count", 0),
            len(kwargs.get("symbols", [])),
            diags,
            len(kwargs.get("tac", [])),
            len(kwargs.get("opt").passes_applied) if kwargs.get("opt") else 0,
            len(kwargs.get("target", []))
        )
        return CompilationResult(
            success=success,
            source_code=src,
            diagnostics=diags,
            timings=timings,
            tokens=tokens,
            token_stats=token_stats,
            parse_tree_trace=kwargs.get("parse_trace", []),
            ast=kwargs.get("ast"),
            ast_node_count=kwargs.get("ast_count", 0),
            symbol_table=kwargs.get("symbols", []),
            scope_tree=kwargs.get("scope_tree"),
            semantic_report=kwargs.get("semantic_rep", {}),
            tac_instructions=kwargs.get("tac", []),
            quadruples=kwargs.get("quads", []),
            triples=kwargs.get("triples", []),
            backpatch_records=kwargs.get("bp", []),
            basic_blocks=kwargs.get("blocks", []),
            flow_graph=kwargs.get("cfg"),
            optimization=kwargs.get("opt"),
            target_code=kwargs.get("target", []),
            summary=summary
        )
