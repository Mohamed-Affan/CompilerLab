import pytest
from compiler.lexer.lexer import Lexer
from compiler.parser.parser import Parser
from compiler.parser.ast_nodes import ProgramNode, VarDeclNode, BinaryOpNode


def test_parser_valid_program():
    src = """
    let x : int = 10;
    let y : int = x + 5 * 2;
    """
    lexer = Lexer(src)
    tokens, _ = lexer.tokenize()
    parser = Parser(tokens)
    ast, diags, trace = parser.parse()

    assert len(diags) == 0
    assert isinstance(ast, ProgramNode)
    assert len(ast.statements) == 2
    assert isinstance(ast.statements[0], VarDeclNode)
    assert ast.statements[0].name == "x"


def test_parser_syntax_error_missing_semicolon():
    src = "let x : int = 10 let y : int = 20;"
    lexer = Lexer(src)
    tokens, _ = lexer.tokenize()
    parser = Parser(tokens)
    ast, diags, _ = parser.parse()

    assert len(diags) > 0
    assert any(d.code == "SYN002" or d.code == "SYN001" for d in diags)
