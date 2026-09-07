from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional

from compiler.models import (
    CompileRequest, CompilationResult, Diagnostic
)
from compiler.pipeline import CompilerPipeline
from compiler.parser.grammar import GRAMMAR_SPEC
from compiler.semantic.type_system import TypeSystem
from compiler.educational.parser_lab import ParserLabSimulators
from compiler.educational.learning_lab import LearningLabService

app = FastAPI(
    title="CompilerLab API",
    description="Interactive Compiler Analysis & Optimization Workbench API (CSA1405)",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server & production builds
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = CompilerPipeline()


class ParserLabRequest(BaseModel):
    parser_type: str  # shift_reduce, ll1, slr1
    expression: str = "id + id * id"


# --- Preloaded Examples ---
EXAMPLES = [
    {
        "id": "basic_variables",
        "category": "valid",
        "name": "1. Basic Variables & Assignments",
        "description": "Declares integer and float variables, computes arithmetic expressions, and prints results.",
        "code": """// SimpleLang Demo: Basic Variables & Assignments
let age : int = 20;
let salary : float = 45000.5;
let bonus : float = 5000.0;
let totalCompensation : float = salary + bonus;

print(age);
print(totalCompensation);
"""
    },
    {
        "id": "arithmetic_expressions",
        "category": "valid",
        "name": "2. Arithmetic & Optimization Target",
        "description": "Demonstrates constant expressions and algebraic identities ready for compiler optimization.",
        "code": """// SimpleLang Demo: Optimization Candidates
let a : int = 10 * 2;
let b : int = a + 0;
let c : int = b * 1;
let d : int = c + 5;

print(d);
"""
    },
    {
        "id": "functions_and_scopes",
        "category": "valid",
        "name": "3. Functions & Nested Scopes",
        "description": "Defines typed functions with parameters, return statements, and local scope activation records.",
        "code": """// SimpleLang Demo: Functions & Activation Records
function calculateArea(length : int, width : int) : int {
    let area : int = length * width;
    return area;
}

let len : int = 15;
let wid : int = 8;
let result : int = calculateArea(len, wid);
print(result);
"""
    },
    {
        "id": "control_flow",
        "category": "valid",
        "name": "4. Conditional Branching & Loops",
        "description": "Demonstrates relational operators, if-else conditional jumps, and while loop TAC flow.",
        "code": """// SimpleLang Demo: If-Else & While Flow
let counter : int = 1;
let limit : int = 5;

while (counter <= limit) {
    if (counter == 3) {
        print("Reached milestone 3");
    }
    counter = counter + 1;
}
print(counter);
"""
    },
    {
        "id": "type_conversions",
        "category": "valid",
        "name": "5. Explicit Type Casts",
        "description": "Demonstrates explicit type conversions between int and float.",
        "code": """// SimpleLang Demo: Explicit Type Conversions
let baseVal : int = 100;
let floatVal : float = intToFloat(baseVal);
let scaled : float = floatVal * 1.5;
let truncated : int = floatToInt(scaled);

print(truncated);
"""
    },
    # --- ERROR EXAMPLES ---
    {
        "id": "err_type_mismatch",
        "category": "error",
        "name": "❌ Error: Type Mismatch (TYP001)",
        "description": "Attempts to assign a string literal to a declared integer variable.",
        "code": """// Error Demonstration: Type Mismatch
let age : int = 20;
age = "twenty"; // Semantic error: Expected int, received string
print(age);
"""
    },
    {
        "id": "err_undeclared_var",
        "category": "error",
        "name": "❌ Error: Undeclared Variable (SEM001)",
        "description": "Uses a variable before it has been declared in the symbol table.",
        "code": """// Error Demonstration: Undeclared Identifier
let count : int = 10;
total = count + 5; // Error: 'total' has not been declared
print(total);
"""
    },
    {
        "id": "err_duplicate_decl",
        "category": "error",
        "name": "❌ Error: Duplicate Declaration (SEM002)",
        "description": "Declares the same identifier twice within the same scope.",
        "code": """// Error Demonstration: Duplicate Identifier
let score : int = 100;
let score : int = 200; // Error: Duplicate declaration of 'score' in global scope
print(score);
"""
    },
    {
        "id": "err_invalid_op",
        "category": "error",
        "name": "❌ Error: Invalid Binary Operation (TYP002)",
        "description": "Applies an addition operator between incompatible types (int + string).",
        "code": """// Error Demonstration: Incompatible Operator Types
let x : int = 10;
let label : string = "Score: ";
let invalid : int = x + label; // Error: Cannot apply '+' to int and string
"""
    },
    {
        "id": "err_syntax_missing_semi",
        "category": "error",
        "name": "❌ Error: Syntax Error (SYN002)",
        "description": "Missing semicolon delimiter in variable declaration.",
        "code": """// Error Demonstration: Syntax Error
let age : int = 20
let x : int = age + 5;
print(x);
"""
    },
    {
        "id": "err_func_arg_mismatch",
        "category": "error",
        "name": "❌ Error: Function Argument Mismatch (TYP004)",
        "description": "Passes wrong number and types of arguments to a defined function.",
        "code": """// Error Demonstration: Function Parameter Type Mismatch
function multiply(x : int, y : int) : int {
    return x * y;
}

let result : int = multiply(10, "five"); // Error: Arg 2 expected int, got string
"""
    }
]


# --- BREAK IT MUTATION RULES ---
BREAK_IT_MUTATIONS = [
    {
        "name": "Inject Type Mismatch",
        "find": r"let (\w+) : int = (\d+);",
        "replace_fn": lambda m: f'let {m.group(1)} : int = "mismatched_string_{m.group(1)}";'
    },
    {
        "name": "Inject Undeclared Identifier",
        "find": r"(\w+) = ",
        "replace_fn": lambda m: f"undeclared_var_{m.group(1)} = "
    },
    {
        "name": "Remove Semicolon",
        "find": r";\n",
        "replace_fn": lambda m: "\n"
    },
    {
        "name": "Incompatible Addition",
        "find": r"\+ (\w+);",
        "replace_fn": lambda m: '+ "invalid_string";'
    }
]


@app.get("/api/health")
def health_check():
    return {"status": "online", "service": "CompilerLab Backend", "version": "1.0.0"}


@app.post("/api/compile", response_model=CompilationResult)
def compile_code(req: CompileRequest):
    result = pipeline.compile(
        source_code=req.source_code,
        stop_after_stage=req.stop_after_stage,
        optimizations_enabled=req.optimizations_enabled
    )
    return result


@app.post("/api/lexer/analyze")
def analyze_lexer(req: CompileRequest):
    result = pipeline.compile(req.source_code, stop_after_stage="lexer")
    return {
        "success": result.success,
        "tokens": result.tokens,
        "token_stats": result.token_stats,
        "diagnostics": result.diagnostics,
        "timings": result.timings
    }


@app.post("/api/parser/analyze")
def analyze_parser(req: CompileRequest):
    result = pipeline.compile(req.source_code, stop_after_stage="parser")
    return {
        "success": result.success,
        "ast": result.ast,
        "ast_node_count": result.ast_node_count,
        "parse_tree_trace": result.parse_tree_trace,
        "diagnostics": result.diagnostics,
        "timings": result.timings
    }


@app.post("/api/semantic/analyze")
def analyze_semantic(req: CompileRequest):
    result = pipeline.compile(req.source_code, stop_after_stage="semantic")
    return {
        "success": result.success,
        "symbol_table": result.symbol_table,
        "scope_tree": result.scope_tree,
        "semantic_report": result.semantic_report,
        "diagnostics": result.diagnostics,
        "timings": result.timings
    }


@app.post("/api/ir/generate")
def generate_ir(req: CompileRequest):
    result = pipeline.compile(req.source_code, stop_after_stage="ir")
    return {
        "success": result.success,
        "tac_instructions": result.tac_instructions,
        "quadruples": result.quadruples,
        "triples": result.triples,
        "backpatch_records": result.backpatch_records,
        "diagnostics": result.diagnostics,
        "timings": result.timings
    }


@app.post("/api/optimize")
def optimize_ir(req: CompileRequest):
    result = pipeline.compile(req.source_code, stop_after_stage="optimization", optimizations_enabled=True)
    return {
        "success": result.success,
        "optimization": result.optimization,
        "basic_blocks": result.basic_blocks,
        "flow_graph": result.flow_graph,
        "diagnostics": result.diagnostics,
        "timings": result.timings
    }


@app.post("/api/codegen/generate")
def generate_codegen(req: CompileRequest):
    result = pipeline.compile(req.source_code, stop_after_stage=None, optimizations_enabled=req.optimizations_enabled)
    return {
        "success": result.success,
        "target_code": result.target_code,
        "next_use_table": result.next_use_table,
        "stack_frames": result.stack_frames,
        "diagnostics": result.diagnostics,
        "timings": result.timings
    }


@app.get("/api/examples")
def get_examples():
    return {"examples": EXAMPLES}


@app.get("/api/language/spec")
def get_language_spec():
    return {
        "name": "SimpleLang",
        "extension": ".spl",
        "grammar": GRAMMAR_SPEC,
        "type_system": TypeSystem.get_compatibility_matrix()
    }


@app.get("/api/type-explorer/matrix")
def get_type_matrix():
    return TypeSystem.get_compatibility_matrix()


@app.get("/api/learning-lab/lessons")
def get_lessons():
    return {"lessons": LearningLabService.get_lessons()}


@app.get("/api/learning-lab/quizzes")
def get_quizzes():
    return {"quizzes": LearningLabService.get_quizzes()}


@app.post("/api/parser-lab/simulate")
def simulate_parser_lab(req: ParserLabRequest):
    if req.parser_type == "shift_reduce":
        return ParserLabSimulators.simulate_shift_reduce(req.expression)
    elif req.parser_type == "ll1":
        return ParserLabSimulators.simulate_ll1_predictive(req.expression)
    elif req.parser_type == "slr1":
        return ParserLabSimulators.simulate_slr1(req.expression)
    else:
        raise HTTPException(status_code=400, detail=f"Unknown parser simulation type: '{req.parser_type}'")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
