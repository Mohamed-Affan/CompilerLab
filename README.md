# CompilerLab

**Interactive Compiler Analysis & Optimization Workbench**
*Designed for Course CSA1405 — Compiler Design (Units I through V)*

---

## Overview

**CompilerLab** is a visual, educational compiler laboratory and IDE built for the **SimpleLang (`.spl`)** language. It provides an end-to-end pipeline with real dynamic computation for:
- **Unit I**: Lexical Analysis & Token Stream
- **Unit II**: Recursive Descent Parsing, Context-Free Grammars & AST construction
- **Unit III**: Scoped Symbol Tables & Static Type Checking
- **Unit IV**: Intermediate Code Generation (Three-Address Code, Quadruples, Triples, Backpatching)
- **Unit V**: Basic Blocks, Control Flow Graphs (CFG), Code Optimization (Constant Folding, Algebraic Simplification, Propagation, Peephole), and Target Virtual Machine Assembly Generation.

---

## Quick Start

### 1. Backend Setup & Run

```bash
cd backend
python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 2. Run Automated Tests

```bash
python -m pytest
```

### 3. Frontend Setup & Run

```bash
cd frontend
npm install
npm run dev
```
Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in your browser.

---

## Features

- **Compiler Studio**: Live multi-file code editor with line numbers, active line indicators, error gutter badges, and hotkey compilation (`Ctrl+Enter`).
- **Interactive 8-Stage Pipeline**: Clickable stage pills displaying real execution timing (`ms`) and phase status.
- **Stage Inspectors**:
  - *Lexer*: Filterable token stream and category distribution metrics.
  - *Parser*: Top-down recursive descent call tree and CFG grammar reference.
  - *AST*: Interactive hierarchical tree visualizer with node attribute inspector.
  - *Symbol Table*: Scoped identifiers table with scope hierarchy visualizer.
  - *Semantic / Types*: Type checking audit trail and diagnostic logs.
  - *Intermediate Code*: TAC, Quadruples, Triples, and Backpatching lists.
  - *Optimizer*: Before vs. After IR diff and calculated instruction reduction percentage.
  - *Flow Graph*: Basic blocks (B1..Bn) with leaders and branch transitions.
  - *Target VM*: Assembly listing, next-use liveness table, and stack activation records.
  - *Report*: Master compilation report with export to `.txt`.
- **Educational Parser Lab**: Interactive simulators for Shift-Reduce, Predictive LL(1), and SLR(1) parsing.
- **Type System Explorer**: Compatibility matrix and explicit type casting guides.
- **Learning Lab**: Structured lessons covering Units I to V.
- **Quiz Mode**: Interactive Compiler Design quizzes with instant feedback and explanations.
- **Break It**: Educational error injector demonstrating live compile-time error detection.
