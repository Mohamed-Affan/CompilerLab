from enum import Enum, auto
from dataclasses import dataclass
from typing import Any, Optional


class TokenType(Enum):
    # Keywords
    LET = "LET"
    FUNCTION = "FUNCTION"
    RETURN = "RETURN"
    IF = "IF"
    ELSE = "ELSE"
    WHILE = "WHILE"
    PRINT = "PRINT"
    INT_TO_FLOAT = "INT_TO_FLOAT"
    FLOAT_TO_INT = "FLOAT_TO_INT"
    
    # Types
    TYPE_INT = "TYPE_INT"
    TYPE_FLOAT = "TYPE_FLOAT"
    TYPE_STRING = "TYPE_STRING"
    TYPE_BOOL = "TYPE_BOOL"
    
    # Literals
    LITERAL_INT = "LITERAL_INT"
    LITERAL_FLOAT = "LITERAL_FLOAT"
    LITERAL_STRING = "LITERAL_STRING"
    LITERAL_BOOL = "LITERAL_BOOL"
    
    # Identifiers
    IDENTIFIER = "IDENTIFIER"
    
    # Operators
    PLUS = "+"
    MINUS = "-"
    STAR = "*"
    SLASH = "/"
    PERCENT = "%"
    
    # Relational Operators
    EQUAL_EQUAL = "=="
    NOT_EQUAL = "!="
    LESS = "<"
    LESS_EQUAL = "<="
    GREATER = ">"
    GREATER_EQUAL = ">="
    
    # Logical Operators
    AND = "&&"
    OR = "||"
    NOT = "!"
    
    # Assignment
    ASSIGN = "="
    
    # Delimiters
    SEMICOLON = ";"
    COLON = ":"
    COMMA = ","
    LPAREN = "("
    RPAREN = ")"
    LBRACE = "{"
    RBRACE = "}"
    
    # Special
    COMMENT = "COMMENT"
    EOF = "EOF"
    ERROR = "ERROR"


@dataclass
class Token:
    type: TokenType
    lexeme: str
    line: int
    column: int
    value: Optional[Any] = None

    def get_category(self) -> str:
        if self.type in (TokenType.LET, TokenType.FUNCTION, TokenType.RETURN, TokenType.IF, 
                         TokenType.ELSE, TokenType.WHILE, TokenType.PRINT, TokenType.INT_TO_FLOAT, TokenType.FLOAT_TO_INT):
            return "KEYWORD"
        elif self.type in (TokenType.TYPE_INT, TokenType.TYPE_FLOAT, TokenType.TYPE_STRING, TokenType.TYPE_BOOL):
            return "TYPE"
        elif self.type in (TokenType.LITERAL_INT, TokenType.LITERAL_FLOAT, TokenType.LITERAL_STRING, TokenType.LITERAL_BOOL):
            return "LITERAL"
        elif self.type == TokenType.IDENTIFIER:
            return "IDENTIFIER"
        elif self.type in (TokenType.PLUS, TokenType.MINUS, TokenType.STAR, TokenType.SLASH, TokenType.PERCENT,
                           TokenType.EQUAL_EQUAL, TokenType.NOT_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL,
                           TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.AND, TokenType.OR, TokenType.NOT):
            return "OPERATOR"
        elif self.type == TokenType.ASSIGN:
            return "ASSIGNMENT"
        elif self.type in (TokenType.SEMICOLON, TokenType.COLON, TokenType.COMMA, TokenType.LPAREN, TokenType.RPAREN, TokenType.LBRACE, TokenType.RBRACE):
            return "DELIMITER"
        elif self.type == TokenType.COMMENT:
            return "COMMENT"
        elif self.type == TokenType.EOF:
            return "EOF"
        return "SPECIAL"
