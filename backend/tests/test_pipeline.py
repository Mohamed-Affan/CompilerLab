import pytest
from compiler.pipeline import CompilerPipeline


def test_ir_generation():
    src = """
    let a : int = 5;
    let b : int = 10;
    let c : int = a + b * 2;
    """
    pipeline = CompilerPipeline()
    res = pipeline.compile(src)
    assert res.success is True
    assert len(res.tac_instructions) > 0
    assert len(res.quadruples) == len(res.tac_instructions)
    assert len(res.triples) == len(res.tac_instructions)


def test_optimization_constant_folding():
    src = """
    let x : int = 10 * 2;
    let y : int = x + 0;
    let z : int = y * 1;
    """
    pipeline = CompilerPipeline()
    res = pipeline.compile(src, optimizations_enabled=True)
    assert res.success is True
    assert res.optimization is not None
    assert res.optimization.counts_by_type.get("Constant Folding", 0) >= 1
    assert res.optimization.counts_by_type.get("Algebraic Simplification", 0) >= 1
    assert res.optimization.reduction_percentage > 0


def test_codegen_and_next_use():
    src = """
    let a : int = 10;
    let b : int = 20;
    let c : int = a + b;
    print(c);
    """
    pipeline = CompilerPipeline()
    res = pipeline.compile(src)
    assert res.success is True
    assert len(res.target_code) > 0
    assert any(inst.opcode == "PRINT" for inst in res.target_code)
    assert any(inst.opcode == "HALT" for inst in res.target_code)
    assert len(res.next_use_table) > 0
    assert len(res.stack_frames) > 0


def test_end_to_end_function_pipeline():
    src = """
    function add(x : int, y : int) : int {
        let sum : int = x + y;
        return sum;
    }

    let a : int = 5;
    let b : int = 10;
    let res : int = add(a, b);
    print(res);
    """
    pipeline = CompilerPipeline()
    res = pipeline.compile(src)
    assert res.success is True
    assert res.summary["errors_count"] == 0
    assert res.summary["tokens_count"] > 0
    assert res.summary["ast_nodes_count"] > 0
    assert res.summary["symbols_count"] >= 3
