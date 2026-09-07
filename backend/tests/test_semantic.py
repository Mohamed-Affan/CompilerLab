import pytest
from compiler.lexer.lexer import Lexer
from compiler.parser.parser import Parser
from compiler.semantic.symbol_table import SymbolTableManager
from compiler.semantic.type_checker import TypeChecker


def test_type_checker_valid():
    src = """
    let a : int = 5;
    let b : int = 10;
    let c : int = a + b;
    """
    lexer = Lexer(src)
    tokens, _ = lexer.tokenize()
    parser = Parser(tokens)
    ast, _, _ = parser.parse()
    
    checker = TypeChecker()
    diags, rep = checker.check(ast)
    errors = [d for d in diags if d.severity == "error"]
    assert len(errors) == 0


def test_type_checker_mismatch():
    src = """
    let age : int = "twenty";
    """
    lexer = Lexer(src)
    tokens, _ = lexer.tokenize()
    parser = Parser(tokens)
    ast, _, _ = parser.parse()

    checker = TypeChecker()
    diags, _ = checker.check(ast)
    errors = [d for d in diags if d.severity == "error"]
    assert len(errors) == 1
    assert errors[0].code == "TYP001"


def test_undeclared_variable():
    src = """
    x = 10;
    """
    lexer = Lexer(src)
    tokens, _ = lexer.tokenize()
    parser = Parser(tokens)
    ast, _, _ = parser.parse()

    checker = TypeChecker()
    diags, _ = checker.check(ast)
    errors = [d for d in diags if d.severity == "error"]
    assert len(errors) == 1
    assert errors[0].code == "SEM001"


def test_duplicate_declaration():
    src = """
    let x : int = 10;
    let x : int = 20;
    """
    lexer = Lexer(src)
    tokens, _ = lexer.tokenize()
    parser = Parser(tokens)
    ast, _, _ = parser.parse()

    checker = TypeChecker()
    diags, _ = checker.check(ast)
    errors = [d for d in diags if d.severity == "error"]
    assert len(errors) == 1
    assert errors[0].code == "SEM002"
