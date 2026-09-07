import pytest
from compiler.lexer.lexer import Lexer
from compiler.lexer.tokens import TokenType


def test_tokenize_basic_declaration():
    src = "let age : int = 20;"
    lexer = Lexer(src)
    tokens, diags = lexer.tokenize()
    
    assert len(diags) == 0
    token_types = [t.type for t in tokens]
    assert token_types == [
        TokenType.LET,
        TokenType.IDENTIFIER,
        TokenType.COLON,
        TokenType.TYPE_INT,
        TokenType.ASSIGN,
        TokenType.LITERAL_INT,
        TokenType.SEMICOLON,
        TokenType.EOF
    ]
    assert tokens[1].lexeme == "age"
    assert tokens[5].value == 20


def test_tokenize_operators_and_comments():
    src = """
    // Single line comment
    /* Multi
       line */
    let total : float = 10.5 + 20.25 * 2.0;
    """
    lexer = Lexer(src)
    tokens, diags = lexer.tokenize()
    assert len(diags) == 0
    assert any(t.type == TokenType.STAR for t in tokens)
    assert any(t.type == TokenType.PLUS for t in tokens)


def test_tokenize_lexical_error_unknown_char():
    src = "let x : int = 10 @ 20;"
    lexer = Lexer(src)
    tokens, diags = lexer.tokenize()
    assert len(diags) == 1
    assert diags[0].code == "LEX001"
    assert "Unexpected character '@'" in diags[0].message
