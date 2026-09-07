from typing import List, Dict, Any


LESSONS: List[Dict[str, Any]] = [
    {
        "id": "unit1-compiler-phases",
        "unit": "Unit I",
        "title": "Compiler Phases & Lexical Analysis",
        "concept": "How Source Code Transforms into Tokens",
        "summary": "The compiler pipeline starts with Lexical Analysis (Scanning), where a continuous stream of source characters is transformed into meaningful atomic tokens (Keywords, Identifiers, Literals, Operators, Delimiters) according to regular expressions and Deterministic Finite Automata (DFA).",
        "key_points": [
            "Lexer strips comments and whitespace while tracking line and column numbers.",
            "Each token has a type, lexeme, and optional literal value.",
            "Lexical errors (LEX001, LEX002) catch illegal characters and unclosed strings before parsing."
        ],
        "example_code": "let age : int = 20;\n// Scanned into: [LET, IDENTIFIER(age), COLON, TYPE_INT, ASSIGN, LITERAL_INT(20), SEMICOLON]"
    },
    {
        "id": "unit2-syntax-analysis",
        "unit": "Unit II",
        "title": "Syntax Analysis & Context-Free Grammars",
        "concept": "Top-Down vs Bottom-Up Parsing",
        "summary": "Syntax analysis validates that token sequences follow Context-Free Grammar (CFG) rules. Top-Down parsers (such as Recursive Descent and LL(1)) construct parse trees from the start symbol down, while Bottom-Up parsers (Shift-Reduce and SLR/LR) reduce input tokens towards the start symbol.",
        "key_points": [
            "Recursive descent uses mutually recursive functions matching CFG productions.",
            "Ambiguity in grammars is resolved through operator precedence and associativity.",
            "Abstract Syntax Trees (ASTs) discard non-essential punctuation to preserve semantic structure."
        ],
        "example_code": "Assignment\n├── Identifier: age\n└── Literal: 20"
    },
    {
        "id": "unit3-semantic-type-checking",
        "unit": "Unit III",
        "title": "Static Type Checking & Symbol Tables",
        "concept": "Enforcing Semantic Integrity Before Execution",
        "summary": "Semantic analysis verifies that program constructs obey language type rules and scoping laws. The Symbol Table stores identifier attributes across global and local function frames. Static type checking prevents illegal assignments and type errors at compile-time.",
        "key_points": [
            "Symbol table tracks identifier name, type, scope level, and declaration line.",
            "Type compatibility rule: declared_type == evaluated_type.",
            "Catches undeclared variables (SEM001), duplicates (SEM002), and type mismatches (TYP001/TYP002)."
        ],
        "example_code": "let age : int = 20;\nage = \"hello\"; // Error TYP001: Cannot assign 'string' to variable 'age' of type 'int'"
    },
    {
        "id": "unit4-intermediate-code",
        "unit": "Unit IV",
        "title": "Intermediate Code Generation (IR)",
        "concept": "Three-Address Code (TAC), Quadruples & Backpatching",
        "summary": "Intermediate representations provide a machine-independent abstraction between the frontend and backend. Three-Address Code (TAC) decomposes complex expressions into instructions with at most three operands, while Quadruples and Triples provide clean tabular structures.",
        "key_points": [
            "TAC uses synthetic temporaries (t1, t2...) and labels (L1, L2...).",
            "Quadruple format: (operator, argument1, argument2, result).",
            "Backpatching resolves jump destinations for boolean expressions and control structures."
        ],
        "example_code": "x = a + b * c;\n// TAC:\n// t1 = b * c\n// t2 = a + t1\n// x = t2"
    },
    {
        "id": "unit5-optimization-codegen",
        "unit": "Unit V",
        "title": "Code Optimization & Target Virtual Machine",
        "concept": "Basic Blocks, Flow Graphs & Assembly Generation",
        "summary": "Optimization transformations improve code execution efficiency without changing program semantics. TAC is partitioned into Basic Blocks at leader instructions, and safe transformations (Constant Folding, Propagation, Algebraic Simplification, Peephole) reduce instruction counts before Target Assembly is emitted.",
        "key_points": [
            "Leaders: instruction 1, jump targets, and instructions immediately after jumps.",
            "Constant Folding evaluates expressions like 10 * 2 into 20 at compile time.",
            "Target VM instructions (LOAD, STORE, ADD, JMPZ, HALT) map directly to machine execution."
        ],
        "example_code": "LOAD R1, a\nADD R1, b\nSTORE x, R1\nHALT"
    }
]


QUIZZES: List[Dict[str, Any]] = [
    {
        "id": "q1",
        "question": "Which compiler phase is responsible for detecting type mismatches such as assigning a 'string' to an 'int' variable?",
        "options": [
            "Lexical Analyzer",
            "Syntax Analyzer (Parser)",
            "Semantic Analyzer / Type Checker",
            "Target Code Generator"
        ],
        "correct_index": 2,
        "explanation": "Static Type Checking is a core component of Semantic Analysis (Unit III). The Lexer only sees character tokens, and the Parser only verifies grammatical structure, but only the Semantic Analyzer verifies data types against the Symbol Table."
    },
    {
        "id": "q2",
        "question": "In basic block identification for code optimization, which of the following is considered a 'Leader' instruction?",
        "options": [
            "Every assignment statement",
            "The very first instruction, any target of a conditional/unconditional jump, and instructions immediately following a jump",
            "Only instructions that contain arithmetic operators",
            "The last instruction of the entire program only"
        ],
        "correct_index": 1,
        "explanation": "According to the fundamental basic-block partitioning algorithm (Unit V), leaders are: 1. The first instruction; 2. Any target label of a jump; 3. Any instruction immediately following a jump or return."
    },
    {
        "id": "q3",
        "question": "What is the primary difference between a Quadruple and a Triple in intermediate code representation?",
        "options": [
            "Quadruples do not support arithmetic operations",
            "Quadruples explicitly store the result location name in a 4th field, whereas Triples reference earlier instruction indices as arguments",
            "Triples can only hold three variables in the entire program",
            "Quadruples are only used for target assembly code"
        ],
        "correct_index": 1,
        "explanation": "A Quadruple has four fields (op, arg1, arg2, result). A Triple has three fields (op, arg1, arg2), and refers to previous operations via their pointer or instruction index (e.g. (1), (2))."
    },
    {
        "id": "q4",
        "question": "What optimization technique transforms the instruction 'x = 10 * 2;' into 'x = 20;' at compile time?",
        "options": [
            "Dead Code Elimination",
            "Loop Unrolling",
            "Constant Folding",
            "Peephole Jump Inversion"
        ],
        "correct_index": 2,
        "explanation": "Constant Folding computes the operations on known compile-time constants ahead of time, eliminating runtime arithmetic."
    },
    {
        "id": "q5",
        "question": "Which parsing technique constructs the parse tree starting from the input terminals and working upwards to the grammar's start symbol?",
        "options": [
            "Recursive Descent Parsing",
            "Predictive LL(1) Parsing",
            "Shift-Reduce Bottom-Up Parsing",
            "Top-Down Backtracking"
        ],
        "correct_index": 2,
        "explanation": "Bottom-Up parsing (like Shift-Reduce, SLR, and LR) repeatedly shifts tokens onto a stack and reduces matching handles until the start symbol is reached."
    },
    {
        "id": "q6",
        "question": "What is the role of 'Backpatching' in intermediate code generation for boolean expressions?",
        "options": [
            "Fixing syntax errors in the source file",
            "Filling in target jump labels for boolean branches once the target address becomes known",
            "Converting all floating-point numbers into integers",
            "Deleting unused functions from memory"
        ],
        "correct_index": 1,
        "explanation": "Backpatching maintains lists of jump instructions whose targets are unknown at creation time (TrueList, FalseList) and fills in the actual target labels as soon as the target basic block is defined."
    },
    {
        "id": "q7",
        "question": "What diagnostic code in SimpleLang is emitted when an undeclared identifier is used in an expression?",
        "options": [
            "LEX001",
            "SYN002",
            "SEM001",
            "TYP003"
        ],
        "correct_index": 2,
        "explanation": "SEM001 corresponds to 'Undeclared identifier' detected during symbol table lookup in semantic analysis."
    }
]


class LearningLabService:
    @staticmethod
    def get_lessons() -> List[Dict[str, Any]]:
        return LESSONS

    @staticmethod
    def get_quizzes() -> List[Dict[str, Any]]:
        return QUIZZES
