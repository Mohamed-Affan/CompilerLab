# MASTER PRD — COMPILERLAB

## Interactive Compiler Analysis & Optimization Workbench

**Project Type:** Web-based educational compiler / developer tool
**Primary Course:** CSA1405 — Compiler Design
**Project Theme:** Compiler Design, Static Analysis, Parsing, Type Checking, Intermediate Code Generation, Optimization
**Build Platform:** Antigravity
**Target:** Desktop-first responsive web application
**Project Status:** Master Product Requirements Document
**Version:** 1.0

---

# 1. Product Overview

## 1.1 Product Name

# **CompilerLab**

### Subtitle

**Interactive Compiler Analysis & Optimization Workbench**

### One-line description

> A browser-based visual compiler laboratory that allows users to write programs in a simple custom programming language and observe how a compiler processes them through lexical analysis, syntax analysis, symbol-table construction, semantic/type checking, intermediate code generation, optimization, and code generation.

---

# 2. Problem Statement

Compiler Design concepts are often taught as isolated theoretical stages:

```text
Lexer
Parser
Symbol Table
Semantic Analysis
Intermediate Code
Optimization
Code Generation
```

The attached project/report already establishes a basic integrated flow:

> **Source Code → Lexical Analysis → Syntax Analysis → Symbol Table → Static Type Checking → Result** 

However, a command-line implementation does not make the relationship between these stages visually obvious.

CompilerLab solves this by creating a **single interactive environment** where a student can enter source code and inspect the internal representation produced at every compiler stage.

The system therefore turns compiler theory into an observable engineering workflow.

---

# 3. Project Objective

The primary objective is to develop an interactive web-based compiler workbench capable of:

1. Accepting source code written in a defined simple programming language.
2. Performing lexical analysis.
3. Generating and displaying tokens.
4. Performing syntax analysis.
5. Generating a parse structure / AST.
6. Building and displaying a symbol table.
7. Performing semantic analysis and static type checking.
8. Detecting semantic/type errors before execution.
9. Generating intermediate code.
10. Performing selected code optimizations.
11. Demonstrating basic code generation.
12. Visually explaining the transformation of source code through compiler stages.

The existing project objectives already require lexical analysis, syntax analysis, symbol-table management, static type checking, semantic error detection, and meaningful error messages. 

CompilerLab extends this foundation to cover additional concepts from Units IV and V.

---

# 4. Academic Scope

CompilerLab must remain firmly connected to the supplied **CSA1405 Compiler Design syllabus**.

## Unit I — Introduction to Compiling

The application should demonstrate:

* Compiler phases
* Language processing
* Lexical analysis
* Tokens
* Identifier recognition
* Keyword recognition
* Lexical errors
* Lexical analyzer visualization
* LEX concept demonstration

---

# Unit II — Syntax Analysis

The application should demonstrate:

* Context-Free Grammars
* Top-down parsing
* Recursive descent parsing
* Predictive parsing
* Bottom-up parsing
* Shift-reduce parsing
* Operator-precedence parsing
* LR parser concepts
* SLR parser concepts
* Syntax errors
* Error handling and recovery
* YACC concept demonstration

Not every parser needs to be the primary production parser for the complete language.

The application should instead clearly distinguish:

**Production compiler pipeline**

from

**Educational parser demonstrations**

so the project does not pretend to implement a complete industrial compiler.

---

# Unit III — Syntax-Directed Translation and Type Checking

This is the **core academic area** of the project.

Implement:

* Syntax-directed definitions
* Syntax tree / AST construction
* S-attributed concepts
* L-attributed concepts where practical
* Type systems
* Type expressions
* Type equivalence
* Type conversions
* Static type checking
* Assignment compatibility
* Expression type checking
* Function parameter checking
* Return-type checking
* Semantic error generation

The supplied project specifically defines assignment checking, expression type checking, function parameter checking, return-type verification and semantic error generation. 

---

# Unit IV — Intermediate Code Generation

Implement:

* Intermediate representations
* Declarations
* Assignment statements
* Arithmetic expressions
* Boolean expressions
* Conditional control flow
* Case-style control flow where supported
* Procedure/function calls
* Three-address code
* Temporary variables
* Backpatching demonstration

---

# Unit V — Code Generation and Code Optimization

Implement selected concepts:

* Basic blocks
* Flow graphs
* Peephole optimization
* Constant folding
* Constant propagation
* Algebraic simplification
* Dead-code elimination where safely applicable
* Basic data-flow concepts
* Next-use information
* Target-code generation
* Runtime-storage concepts

The system should **not claim to implement a complete industrial compiler backend**.

---

# 5. Product Vision

CompilerLab should feel less like a college CRUD application and more like a lightweight **compiler IDE / laboratory**.

The core experience:

```text
WRITE CODE
    ↓
COMPILE
    ↓
WATCH THE PIPELINE
    ↓
INSPECT EVERY STAGE
    ↓
UNDERSTAND WHY IT PASSED / FAILED
    ↓
VIEW GENERATED REPRESENTATIONS
```

---

# 6. Target Users

## Primary User

### Engineering student

A student studying:

* Compiler Design
* Programming Languages
* Language Processing
* Static Analysis

who wants to understand how source code moves through compiler stages.

---

## Secondary User

### Faculty / evaluator

Can use the system to:

* Demonstrate compiler concepts
* Test programs
* Show parsing
* Demonstrate type errors
* Explain intermediate code
* Demonstrate optimization

---

## Tertiary User

### Beginner programmer

Can learn:

* Tokens
* Parsing
* Types
* Symbol tables
* ASTs
* Intermediate representations

without needing to understand a production compiler.

---

# 7. Product Philosophy

The application must follow five principles.

### 1. Visual

Compiler stages should be visible.

### 2. Explainable

Every important compiler decision should have a reason.

### 3. Interactive

The user should be able to inspect compiler artifacts.

### 4. Academically grounded

The implementation must correspond to Compiler Design concepts.

### 5. Technically real

The UI must display **actual output generated by the compiler engine**, not mocked results.

---

# 8. Core User Journey

```text
OPEN COMPILERLAB
       ↓
CREATE / OPEN PROGRAM
       ↓
WRITE SOURCE CODE
       ↓
SELECT COMPILATION MODE
       ↓
CLICK COMPILE
       ↓
LEXICAL ANALYSIS
       ↓
SYNTAX ANALYSIS
       ↓
AST GENERATION
       ↓
SYMBOL TABLE
       ↓
SEMANTIC ANALYSIS
       ↓
TYPE CHECKING
       ↓
INTERMEDIATE CODE
       ↓
OPTIMIZATION
       ↓
CODE GENERATION
       ↓
COMPILATION REPORT
```

If an earlier stage fails:

```text
SOURCE
  ↓
LEXER
  ↓
ERROR
  ✕
STOP
```

For example, syntax errors should prevent semantic analysis from being falsely reported as successful.

The existing report explicitly establishes that type checking should occur after lexical and syntax processing and symbol-table construction. 

---

# 9. Main Application Structure

The application should have the following navigation:

```text
COMPILERLAB

├── Dashboard
├── Compiler
├── Lexer
├── Parser
├── AST
├── Symbol Table
├── Semantic Analyzer
├── Type System
├── Intermediate Code
├── Optimization
├── Code Generator
├── Compilation History
└── Learning Lab
```

---

# 10. Dashboard

The Dashboard is the application's overview screen.

## Display

### Compiler status

```text
COMPILER STATUS

● Ready
```

### Latest compilation

```text
Last Compilation

Tokens             32
AST Nodes           18
Symbols              7
Semantic Errors      0
TAC Instructions    14
Optimizations        4
```

### Pipeline

```text
LEXER
  ✓

PARSER
  ✓

AST
  ✓

SYMBOL TABLE
  ✓

SEMANTIC
  ✓

IR
  ✓

OPTIMIZER
  ✓

CODE GENERATOR
  ✓
```

---

# 11. Main Compiler Workspace

This is the primary application screen.

## Layout

```text
┌─────────────────────────────────────────────────────────────┐
│ COMPILERLAB                     Ready ●       [COMPILE]     │
├───────────────┬─────────────────────────────┬───────────────┤
│ FILES         │ SOURCE CODE                 │ DIAGNOSTICS   │
│               │                             │               │
│ main.spl      │ 1 let age : int = 20;      │ ✓ Lexer       │
│ demo.spl      │ 2 let x : int = age + 5;  │ ✓ Parser      │
│               │ 3 print(x);                │ ✓ Semantic    │
│               │                             │               │
├───────────────┴─────────────────────────────┴───────────────┤
│ COMPILER PIPELINE                                            │
│                                                             │
│ Lexer → Parser → AST → Symbols → Semantic → IR → Optimize │
├─────────────────────────────────────────────────────────────┤
│ OUTPUT                                                      │
└─────────────────────────────────────────────────────────────┘
```

---

# 12. Source Code Editor

The editor must support:

* Line numbers
* Syntax highlighting
* Error highlighting
* Current-line highlighting
* Auto indentation
* Bracket matching
* Basic autocomplete
* Compile button
* Reset button
* Example programs
* Copy code
* Clear code

---

# 13. Custom Programming Language

The project needs its own **simple language**, tentatively named:

# `SimpleLang`

File extension:

```text
.spl
```

The language should be deliberately small.

---

## Basic types

```text
int
float
string
bool
```

Potential future types:

```text
char
```

---

## Variable declaration

```text
let age : int = 20;
let salary : float = 45000.5;
let name : string = "Affan";
let active : bool = true;
```

---

## Assignment

```text
age = age + 1;
salary = salary + 1000.0;
```

---

## Arithmetic

```text
+
-
*
/
%
```

---

## Relational

```text
==
!=
<
>
<=
>=
```

---

## Boolean

```text
&&
||
!
```

---

## Conditional

```text
if (age > 18) {
    print("adult");
}
```

---

## Functions

```text
function add(a : int, b : int) : int {
    return a + b;
}
```

---

## Function call

```text
let result : int = add(10, 20);
```

---

## Output

```text
print(result);
```

---

# 14. Language Design Rules

The language specification must be stored centrally.

Do not scatter grammar rules throughout the application.

Example:

```text
Program
    → StatementList

Statement
    → Declaration
    → Assignment
    → IfStatement
    → FunctionDeclaration
    → ReturnStatement
    → PrintStatement

Declaration
    → let Identifier : Type = Expression ;

Type
    → int
    → float
    → string
    → bool
```

The actual grammar should be documented inside the project.

---

# 15. Lexer Module

## Purpose

Convert source code into tokens.

The existing project defines lexical analysis around tokenization, identifier recognition, keyword recognition, parser validation and syntax-error detection. 

---

## Token categories

```text
KEYWORD
IDENTIFIER
TYPE
INTEGER
FLOAT
STRING
BOOLEAN
OPERATOR
DELIMITER
ASSIGNMENT
COMMENT
EOF
```

---

## Lexer output

| # | Lexeme | Token      | Line | Column |
| - | ------ | ---------- | ---: | -----: |
| 1 | let    | KEYWORD    |    1 |      1 |
| 2 | age    | IDENTIFIER |    1 |      5 |
| 3 | :      | COLON      |    1 |      8 |
| 4 | int    | TYPE       |    1 |     10 |
| 5 | =      | ASSIGN     |    1 |     14 |
| 6 | 20     | INTEGER    |    1 |     16 |

---

## Lexer errors

Example:

```text
Unknown character '@'

Line 4
Column 13
```

---

# 16. Parser Module

The parser converts tokens into structured syntax.

The main implementation should use a clearly documented parsing strategy.

Recommended:

## Recursive Descent Parser

because it is straightforward to explain and demonstrate.

---

## Parser screen

```text
PARSER

Strategy
[ Recursive Descent ▼ ]

Grammar
Expression
Term
Factor
Statement
...

Parser Trace

parseStatement()
    ↓
parseDeclaration()
    ↓
parseExpression()
    ↓
parseTerm()
    ↓
SUCCESS
```

---

# 17. Parser Visualization

Show:

### Parse Tree

and:

### AST

Example:

```text
Assignment
├── Identifier: x
└── BinaryExpression
    ├── Identifier: a
    ├── +
    └── BinaryExpression
        ├── Identifier: b
        ├── *
        └── Literal: 5
```

---

# 18. Educational Parser Lab

A separate area should demonstrate syllabus parser concepts.

```text
PARSER LAB

Recursive Descent
Predictive Parsing
Shift Reduce
Operator Precedence
SLR
```

Each demonstration should provide:

* Grammar
* Input
* Current state
* Stack
* Input buffer
* Action
* Result

Example shift-reduce:

```text
STACK          INPUT        ACTION

$              id + id $    SHIFT id
$ id           + id $       REDUCE F → id
$ F            + id $       SHIFT +
...
```

This should be explicitly labelled **Educational Demonstration** rather than pretending it is the production compiler parser.

---

# 19. AST Module

The AST should be generated from actual parser output.

Features:

* Zoom
* Pan
* Expand/collapse
* Node selection
* Node metadata

Clicking a node should show:

```text
NODE

Type:
BinaryExpression

Operator:
+

Left:
Identifier(age)

Right:
Literal(5)

Inferred Type:
int
```

---

# 20. Symbol Table Module

The symbol table is a core component.

The existing report defines:

* variable declaration
* data-type storage
* scope management
* duplicate declaration checking
* variable lookup 

---

## UI

```text
SYMBOL TABLE

┌────────┬────────┬──────────┬──────┬──────────────┐
│ Name   │ Type   │ Scope    │ Line │ Status       │
├────────┼────────┼──────────┼──────┼──────────────┤
│ age    │ int    │ global   │ 1    │ declared     │
│ salary │ float  │ global   │ 2    │ declared     │
│ result │ int    │ function │ 7    │ declared     │
└────────┴────────┴──────────┴──────┴──────────────┘
```

---

# 21. Scope Visualization

For nested scopes:

```text
GLOBAL SCOPE
│
├── age : int
├── salary : float
│
└── FUNCTION add
      │
      ├── a : int
      └── b : int
```

---

# 22. Semantic Analyzer

This is the **central module**.

Pipeline:

```text
AST
 ↓
Symbol Lookup
 ↓
Type Resolution
 ↓
Type Compatibility
 ↓
Semantic Rules
 ↓
Diagnostics
```

---

# 23. Type Checker

Implement:

### Assignment

```text
let age : int = 20;       ✓
age = 30;                 ✓
age = "hello";            ✗
```

Output:

```text
TYPE ERROR

Line 3

Variable:
age

Expected:
int

Received:
string
```

The supplied implementation already establishes this fundamental rule:

> declared type = assigned type → valid assignment
> declared type ≠ assigned type → type error 

---

# 24. Expression Type Checking

Example:

```text
10 + 20
```

```text
int + int → int
```

But:

```text
10 + "hello"
```

```text
int + string → ERROR
```

The existing project explicitly uses `int + int` as a valid operation and `int + string` as an invalid operation. 

---

# 25. Semantic Error Categories

CompilerLab should classify errors.

```text
LEXICAL ERROR
SYNTAX ERROR
SEMANTIC ERROR
TYPE ERROR
UNDECLARED IDENTIFIER
DUPLICATE DECLARATION
INVALID OPERATION
INVALID FUNCTION CALL
INVALID RETURN TYPE
```

---

# 26. Diagnostics System

Errors should be displayed like an IDE.

Example:

```text
ERROR

main.spl:7:12

Type mismatch:
Cannot assign string to variable 'age' of type int.

Expected:
int

Received:
string

Rule:
Assignment compatibility
```

Clicking the error should take the user to the exact source line.

---

# 27. Error Severity

Support:

```text
ERROR
WARNING
INFO
SUCCESS
```

Example:

```text
✗ ERROR   incompatible assignment
⚠ WARNING unused variable
✓ SUCCESS type check passed
```

---

# 28. Type System Explorer

A dedicated educational page.

Display:

```text
TYPE SYSTEM

int
float
string
bool
```

and compatibility matrix:

| Operation | int | float | string | bool |
| --------- | --: | ----: | -----: | ---: |
| int +     |   ✓ |    ✓* |      ✗ |    ✗ |
| float +   |  ✓* |     ✓ |      ✗ |    ✗ |
| string +  |   ✗ |     ✗ |      ✓ |    ✗ |
| bool &&   |   ✗ |     ✗ |      ✗ |    ✓ |

`*` indicates conversion rules if implemented.

The exact conversion policy must be documented in the language specification.

---

# 29. Type Conversion

Support explicit conversions where defined.

Example:

```text
let x : float = intToFloat(10);
```

The system should show:

```text
int
 ↓
conversion
 ↓
float
```

---

# 30. Syntax-Directed Translation

This section demonstrates how syntax structures can carry semantic information.

Example:

```text
Expression
    ↓
Binary Expression
    ↓
Evaluate children
    ↓
Determine resulting type
```

Show:

```text
a + b

a → int
b → int

+

Result → int
```

---

# 31. Intermediate Representation

After successful semantic analysis:

```text
AST
 ↓
IR GENERATOR
 ↓
Three Address Code
```

---

# 32. Three Address Code

Example:

```text
x = a + b * c;
```

Output:

```text
t1 = b * c
t2 = a + t1
x = t2
```

---

# 33. IR Viewer

Support tabs:

```text
Three Address Code
Quadruples
Triples
```

Where implemented.

Example:

| # | Operator | Arg1 | Arg2 | Result |
| - | -------- | ---- | ---- | ------ |
| 1 | `*`      | b    | c    | t1     |
| 2 | `+`      | a    | t1   | t2     |
| 3 | `=`      | t2   | —    | x      |

---

# 34. Boolean Expressions

Generate intermediate code for:

```text
if (a < b && b < c)
```

Show conditional jumps:

```text
if a < b goto L1
goto Lfalse

L1:
if b < c goto Ltrue
goto Lfalse
```

---

# 35. Backpatching Visualizer

Provide an educational visualization.

Show:

```text
TRUE LIST
FALSE LIST
NEXT LIST
```

Then:

```text
Backpatch TRUE list → L1
Backpatch FALSE list → L2
```

This is a teaching component rather than a requirement for every language construct.

---

# 36. Basic Blocks

Given TAC:

```text
1  t1 = a + b
2  t2 = t1 * c
3  if t2 < 10 goto 7
4  x = 20
5  goto 8
6  ...
7  x = 30
8  print(x)
```

Identify leaders and construct:

```text
BLOCK B1
  1
  2
  3

BLOCK B2
  4
  5

BLOCK B3
  7

BLOCK B4
  8
```

---

# 37. Flow Graph

Visualize:

```text
        ┌───────┐
        │  B1   │
        └───┬───┘
          /   \
         ▼     ▼
      ┌────┐ ┌────┐
      │ B2 │ │ B3 │
      └──┬─┘ └──┬─┘
         \      /
          ▼    ▼
          ┌────┐
          │ B4 │
          └────┘
```

---

# 38. Optimization Lab

Optimization must display **before and after**.

Example:

### Before

```text
t1 = 10 * 2
x = t1
y = x + 0
z = y * 1
```

### After

```text
x = 20
y = x
z = y
```

---

# 39. Optimization Techniques

Implement selected safe transformations.

## Constant Folding

```text
x = 10 * 2
```

becomes:

```text
x = 20
```

---

## Algebraic Simplification

```text
x + 0 → x
x * 1 → x
x - 0 → x
```

---

## Constant Propagation

```text
x = 10
y = x + 5
```

becomes:

```text
x = 10
y = 15
```

when safe.

---

## Dead Code Elimination

Only where the implementation can confidently determine that code has no observable effect.

---

## Peephole Optimization

Example:

```text
LOAD R1, x
ADD R1, 0
```

becomes:

```text
LOAD R1, x
```

---

# 40. Optimization Report

Display:

```text
OPTIMIZATION REPORT

Constant Folding             3
Constant Propagation         2
Algebraic Simplification     4
Peephole                     2

Instructions Before          24
Instructions After           15

Reduction                    37.5%
```

Important:

The percentage should be **calculated from actual generated IR**, never hardcoded.

---

# 41. Code Generator

The code generator should convert the simplified IR into a small educational target instruction set.

Example:

```text
TAC

t1 = a + b
x = t1
```

Target:

```text
LOAD R1, a
ADD R1, b
STORE x, R1
```

---

# 42. Educational Target Machine

Do not attempt to target x86 directly.

Create a simple virtual machine instruction set:

```text
LOAD
STORE
ADD
SUB
MUL
DIV
CMP
JMP
JMPZ
CALL
RET
PRINT
HALT
```

This makes Unit V easier to demonstrate and explain.

---

# 43. Runtime Storage Visualization

Show:

```text
STACK

┌─────────────────┐
│ function frame  │
├─────────────────┤
│ return address  │
│ parameter b     │
│ parameter a     │
│ local result    │
└─────────────────┘
```

This is educational rather than a real operating-system memory simulator.

---

# 44. Next-Use Information

For a basic block, show:

| Instruction | Variable | Next Use |
| ----------- | -------- | -------: |
| `t1=a+b`    | a        |        5 |
| `t1=a+b`    | b        |        3 |
| `t2=t1*c`   | t1       |        4 |

This should be generated from actual TAC.

---

# 45. Compilation Pipeline Visualization

This is the **hero feature**.

```text
SOURCE
  │
  ▼
┌──────────────┐
│ LEXICAL      │ ✓
│ ANALYSIS     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ SYNTAX       │ ✓
│ ANALYSIS     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ AST          │ ✓
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ SYMBOL       │ ✓
│ TABLE        │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ SEMANTIC     │ ✓
│ TYPE CHECK   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ INTERMEDIATE │ ✓
│ CODE         │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ OPTIMIZATION │ ✓
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ CODE         │ ✓
│ GENERATION   │
└──────────────┘
```

Each node is clickable.

---

# 46. Stage-by-Stage Mode

The user should be able to compile:

### Full Pipeline

or:

### Step-by-Step

```text
[STEP]

Lexer ✓
     ↓
[Next]

Parser
     ↓
[Next]

Semantic Analysis
```

This is important for classroom demonstrations.

---

# 47. Compilation Timeline

Show execution timing:

```text
LEXER          3.2 ms
PARSER         2.1 ms
AST            0.7 ms
SEMANTIC       1.8 ms
IR             1.4 ms
OPTIMIZER      0.9 ms
CODEGEN        0.8 ms
```

If real timings are difficult or inconsistent, label them clearly as **local processing time** and calculate them from actual execution.

---

# 48. Compilation Report

After compilation:

```text
COMPILATION REPORT

Program
main.spl

STATUS
✓ SUCCESS

LEXICAL ANALYSIS
Tokens: 38
Errors: 0

SYNTAX ANALYSIS
AST Nodes: 24
Errors: 0

SYMBOL TABLE
Symbols: 8

SEMANTIC ANALYSIS
Errors: 0
Warnings: 1

INTERMEDIATE CODE
Instructions: 17

OPTIMIZATION
Transformations: 5
Instructions: 12

CODE GENERATION
Target Instructions: 12
```

---

# 49. Error Compilation Report

For failed programs:

```text
COMPILATION FAILED

Stage:
Semantic Analysis

Errors:
2

1. line 4
   age expects int
   received string

2. line 7
   invalid operation:
   string + int
```

Pipeline should visibly stop at the failed stage.

---

# 50. Example Programs

The application must ship with predefined examples.

## Valid programs

```text
Basic Variables
Arithmetic Expressions
Boolean Expressions
Functions
Nested Scope
```

## Error programs

```text
Type Mismatch
Undeclared Variable
Duplicate Declaration
Invalid Operation
Syntax Error
Lexical Error
Wrong Function Argument
Wrong Return Type
```

---

# 51. "Break It" Mode

A useful educational feature.

Button:

> **Introduce an Error**

The system takes a valid program and introduces a controlled mistake.

Example:

```text
Before:
let age : int = 20;

After:
let age : int = "twenty";
```

Then compile.

This gives a very good classroom demonstration.

---

# 52. Learning Lab

Dedicated educational area.

Each concept contains:

```text
CONCEPT

What is a Symbol Table?

[Explanation]

Example

[Code]

Compiler View

[Visualization]

Try It

[Interactive Exercise]
```

Topics:

```text
Compiler Phases
Lexical Analysis
Tokens
CFG
Parsing
AST
Symbol Tables
Semantic Analysis
Type Systems
Three Address Code
Backpatching
Basic Blocks
Optimization
Code Generation
```

---

# 53. Interactive Quiz

Optional but recommended.

Example:

```text
Which stage detects:

int x;
x = "hello";

○ Lexer
○ Parser
● Semantic Analyzer
○ Code Generator
```

The answer should include an explanation.

---

# 54. Architecture

Recommended architecture:

```text
                    WEB CLIENT
                        │
                        ▼
               ┌─────────────────┐
               │ CompilerLab UI  │
               └────────┬────────┘
                        │
                       API
                        │
                        ▼
               ┌─────────────────┐
               │ Compiler Engine  │
               └────────┬────────┘
                        │
       ┌────────────────┼────────────────┐
       ▼                ▼                ▼
     Lexer            Parser        Semantic
                                         │
                                         ▼
                                   Symbol Table
                                         │
                                         ▼
                                    Type Checker
                                         │
                                         ▼
                                    IR Generator
                                         │
                                         ▼
                                     Optimizer
                                         │
                                         ▼
                                    Code Generator
```

---

# 55. Recommended Technology Stack

## Frontend

Use:

* React
* TypeScript
* modern component architecture
* Monaco Editor or equivalent code editor
* SVG / React Flow / equivalent for compiler visualizations
* responsive CSS

---

## Backend

Use:

**Python**

because the existing project already uses Python for the type-checker implementation and uses a dictionary-based symbol table. 

Recommended:

```text
FastAPI
```

---

## Compiler Engine

Python modules:

```text
compiler/
│
├── lexer/
│   ├── lexer.py
│   └── tokens.py
│
├── parser/
│   ├── parser.py
│   ├── grammar.py
│   └── ast.py
│
├── semantic/
│   ├── symbol_table.py
│   ├── type_checker.py
│   └── type_system.py
│
├── ir/
│   ├── tac.py
│   ├── quadruples.py
│   └── backpatch.py
│
├── optimization/
│   ├── basic_blocks.py
│   ├── optimizer.py
│   └── peephole.py
│
├── codegen/
│   └── generator.py
│
└── pipeline.py
```

---

# 56. Backend API

Potential endpoints:

```text
POST /api/compile

POST /api/lexer/analyze

POST /api/parser/analyze

POST /api/semantic/analyze

POST /api/ir/generate

POST /api/optimize

POST /api/codegen/generate

GET /api/examples

GET /api/language/spec
```

The primary endpoint can return the complete compilation artifact.

---

# 57. Compilation Response Model

Conceptually:

```text
{
    status,
    source,
    tokens,
    parse_tree,
    ast,
    symbol_table,
    diagnostics,
    semantic_result,
    intermediate_code,
    basic_blocks,
    flow_graph,
    optimizations,
    target_code,
    statistics
}
```

The frontend should render this response rather than implementing compiler logic itself.

---

# 58. Data Persistence

No database is required for the core compiler.

### MVP

Use:

```text
local browser storage
```

for:

* recent programs
* selected example
* UI preferences

---

## Optional

If persistence is needed:

```text
SQLite
```

for local development.

Do **not** introduce authentication, user accounts, cloud databases, or unnecessary SaaS infrastructure unless there is a clear requirement.

---

# 59. Project File System

Users should be able to:

```text
New File
Open
Save
Rename
Delete
Duplicate
```

Initial project:

```text
My Compiler Project

├── main.spl
├── arithmetic.spl
├── types.spl
└── functions.spl
```

---

# 60. Security Requirements

Since users can enter arbitrary source code:

### Never execute arbitrary source code on the host machine.

The compiler should:

* parse source code
* analyze it
* generate IR
* generate target code

without directly executing user programs on the server.

If a virtual execution feature is later added, it must execute inside a strictly controlled sandbox.

---

# 61. Error Handling

The backend must never crash because of malformed source code.

Instead:

```text
User Input
 ↓
Lexer
 ↓
Structured Diagnostic
```

Example:

```text
{
  "severity": "error",
  "stage": "syntax",
  "line": 4,
  "column": 12,
  "code": "SYN001",
  "message": "Expected ';'",
  "suggestion": "Add ';' after the expression."
}
```

---

# 62. Diagnostic Codes

Recommended:

```text
LEX001  Unknown character
LEX002  Invalid literal

SYN001  Unexpected token
SYN002  Missing delimiter

SEM001  Undeclared identifier
SEM002  Duplicate declaration

TYP001  Assignment type mismatch
TYP002  Invalid binary operation
TYP003  Invalid return type
TYP004  Invalid function argument
```

---

# 63. Non-Functional Requirements

The supplied report already specifies that the system should provide clear error messages, consistent results, maintainable modules and efficient processing. 

CompilerLab therefore requires:

### Performance

Small programs should compile nearly instantly.

### Reliability

The same source should produce deterministic output.

### Maintainability

Compiler stages must remain modular.

### Usability

A student should understand the pipeline without external instructions.

### Responsiveness

The UI should work on:

* desktop
* laptop
* tablet

Desktop is the primary target.

---

# 64. UI / UX Direction

The visual identity should be:

## **Technical + minimal + slightly futuristic**

Not:

* generic Bootstrap dashboard
* corporate SaaS
* excessive gradients
* childish educational UI

Think:

```text
IDE
+
Compiler debugger
+
Engineering laboratory
```

---

# 65. Suggested Visual Language

Use:

* dark editor environment
* subtle borders
* compact panels
* monospace code
* clear typography
* restrained accent colors
* stage-status indicators
* terminal-inspired diagnostics
* clean diagrams

Avoid excessive:

* glassmorphism
* giant gradients
* unnecessary animations
* floating cards everywhere
* stock illustrations

---

# 66. Animation

Use animation only where it communicates compiler flow.

For example:

```text
SOURCE
   ↓
TOKEN
   ↓
AST NODE
   ↓
SYMBOL
   ↓
IR
```

Tokens can visually move through stages when **Step Through Compilation** is selected.

Animations should be:

* fast
* subtle
* interruptible

---

# 67. Accessibility

Include:

* keyboard navigation
* sufficient contrast
* readable code
* tooltips
* accessible buttons
* clear error icons
* non-color-only error identification

---

# 68. Testing Requirements

The compiler engine must have automated tests.

## Lexer tests

```text
keywords
identifiers
numbers
strings
operators
comments
invalid characters
```

## Parser tests

```text
valid declaration
invalid declaration
expression precedence
nested expressions
if statements
functions
```

## Semantic tests

```text
valid assignment
invalid assignment
undeclared variable
duplicate declaration
valid expression
invalid expression
function argument mismatch
return mismatch
```

---

# 69. Optimization Tests

Example:

```text
Input:
x = 10 + 20;

Expected:
x = 30;
```

and:

```text
x = y + 0;

Expected:
x = y;
```

---

# 70. End-to-End Tests

At least:

### Test 1 — Valid program

```text
let x : int = 10;
let y : int = 20;
let z : int = x + y;
print(z);
```

Expected:

```text
Compilation Successful
```

---

### Test 2 — Type mismatch

```text
let x : int = 10;
x = "hello";
```

Expected:

```text
TYP001
```

---

### Test 3 — Invalid operation

```text
let x : int = 10;
let name : string = "A";
let y : int = x + name;
```

Expected:

```text
TYP002
```

---

### Test 4 — Undeclared identifier

```text
x = 10;
```

Expected:

```text
SEM001
```

---

### Test 5 — Duplicate declaration

```text
let x : int = 10;
let x : int = 20;
```

Expected:

```text
SEM002
```

---

# 71. Definition of Done

The project is considered complete when:

### Compiler

* [ ] SimpleLang grammar is documented.
* [ ] Lexer works.
* [ ] Parser works.
* [ ] AST is generated.
* [ ] Symbol table is generated.
* [ ] Type checker works.
* [ ] Semantic diagnostics work.
* [ ] TAC is generated.
* [ ] Basic blocks can be identified.
* [ ] Selected optimizations work.
* [ ] Target code is generated.

### UI

* [ ] Code editor works.
* [ ] Compilation pipeline works.
* [ ] Token viewer works.
* [ ] Parser viewer works.
* [ ] AST viewer works.
* [ ] Symbol-table viewer works.
* [ ] Semantic diagnostics work.
* [ ] IR viewer works.
* [ ] Optimization viewer works.
* [ ] Code-generation viewer works.
* [ ] Compilation report works.

### Educational

* [ ] Parser demonstrations exist.
* [ ] Type-system explanation exists.
* [ ] Compiler-stage explanations exist.
* [ ] Example programs exist.
* [ ] Learning mode works.

### Quality

* [ ] Automated tests exist.
* [ ] Error handling works.
* [ ] No arbitrary source execution occurs.
* [ ] UI is responsive.
* [ ] No fake compiler outputs are used.

---

# 72. MVP vs Advanced Scope

This is **very important for Antigravity**.

Do not let the agent attempt everything simultaneously.

## Phase 1 — Foundation

```text
SimpleLang
Lexer
Parser
AST
Symbol Table
Type Checker
```

This establishes the original project's complete core.

The existing report itself describes the implementation as three major modules: lexical/syntax analysis, symbol-table management and static type checking. 

---

## Phase 2 — Web Workbench

```text
Code Editor
Pipeline
Token Viewer
AST Viewer
Symbol Table
Diagnostics
```

---

## Phase 3 — Compiler Expansion

```text
TAC
Quadruples
Boolean IR
Backpatching
```

---

## Phase 4 — Optimization

```text
Basic Blocks
Flow Graph
Constant Folding
Propagation
Algebraic Simplification
Peephole
```

---

## Phase 5 — Code Generation

```text
Virtual Machine
Target Instructions
Runtime Visualization
Next-Use
```

---

## Phase 6 — Educational Layer

```text
Parser Lab
Type System Explorer
Learning Mode
Quiz Mode
Compilation Walkthrough
```

---

# 73. What Should NOT Be Built

Antigravity must explicitly avoid scope creep.

Do **not** build:

* Full C compiler
* Full Python compiler
* JavaScript interpreter
* Real x86 compiler
* Operating-system-level execution
* User authentication
* Social features
* Chatbot
* AI-generated code as a core feature
* Cloud IDE infrastructure
* Complex database architecture
* Microservices for every compiler phase
* Cryptocurrency / blockchain nonsense
* unnecessary admin dashboard

The project is a **compiler laboratory**, not a generic SaaS platform.

---

# 74. Academic Positioning

The project should be presented as:

> **An interactive educational compiler workbench implementing and visualizing fundamental compiler phases from lexical analysis through code generation and optimization.**

The static type checker remains a major semantic-analysis component.

This is consistent with the existing project's purpose: static type checking verifies variable and expression types before execution and detects incompatible assignments and operations. 

---

# 75. Proposed Final Project Title

## **CompilerLab: An Interactive Web-Based Compiler Analysis and Optimization Workbench**

### Alternative formal title

> **Design and Development of an Interactive Compiler Workbench for Lexical Analysis, Syntax Analysis, Static Type Checking, Intermediate Code Generation and Optimization**

I prefer the first for the actual product and the second for formal academic documentation.

---

# 76. Final Product Architecture

The final system should conceptually look like:

```text
                         COMPILERLAB
                              │
              ┌───────────────┴───────────────┐
              │                               │
          LEARNING                         COMPILER
             LAB                              IDE
              │                               │
     ┌────────┴─────────┐             ┌───────┴────────┐
     │                  │             │                │
 Parser Lab       Type System     Code Editor      Pipeline
     │                  │             │                │
     └──────────────────┴─────────────┴────────────────┘
                                      │
                                      ▼
                              COMPILER ENGINE
                                      │
       ┌────────────┬────────────┬────┴─────┬────────────┐
       ▼            ▼            ▼          ▼            ▼
     LEXER        PARSER       AST       SEMANTIC       IR
       │            │            │          │             │
       │            │            │       SYMBOL TABLE    │
       │            │            │       TYPE CHECKER    │
       │            │            │          │             │
       └────────────┴────────────┴──────────┴─────────────┘
                                      │
                                      ▼
                                  OPTIMIZER
                                      │
                                      ▼
                                CODE GENERATOR
                                      │
                                      ▼
                              TARGET INSTRUCTIONS
```

---

# 77. The Golden Rule for Antigravity

The most important requirement in the entire PRD:

> **The interface must never simulate compiler output. Every token, AST node, symbol-table entry, diagnostic, intermediate-code instruction, optimization transformation, and generated instruction displayed by the UI must originate from the actual compiler engine.**

This is what separates:

**“a nice-looking compiler dashboard”**

from

**“an actual Compiler Design project with a nice dashboard.”**

Your current report already follows a modular engineering approach—requirements → system design → module development → integration → testing → result analysis → documentation. 

CompilerLab should preserve that engineering structure while giving it a much stronger interface and substantially broader syllabus coverage.

---

# 78. Master Build Directive

When this PRD is eventually given to Antigravity, the build instruction should essentially be:

> **Build CompilerLab as a real full-stack compiler workbench, not a frontend mockup. Implement the compiler engine first, expose structured compiler artifacts through the backend, and build the dashboard around those artifacts. Prioritize correctness, modular compiler architecture, deterministic outputs, explainability, and syllabus alignment over feature quantity. Every visual element representing compiler behavior must be backed by actual computation.**

That should be the **master source of truth** for the build.
