from typing import List, Tuple, Optional
from .tokens import Token, TokenType
from ..models import Diagnostic, TokenModel


class Lexer:
    KEYWORDS = {
        "let": TokenType.LET,
        "function": TokenType.FUNCTION,
        "return": TokenType.RETURN,
        "if": TokenType.IF,
        "else": TokenType.ELSE,
        "while": TokenType.WHILE,
        "print": TokenType.PRINT,
        "intToFloat": TokenType.INT_TO_FLOAT,
        "floatToInt": TokenType.FLOAT_TO_INT,
        "int": TokenType.TYPE_INT,
        "float": TokenType.TYPE_FLOAT,
        "string": TokenType.TYPE_STRING,
        "bool": TokenType.TYPE_BOOL,
        "true": TokenType.LITERAL_BOOL,
        "false": TokenType.LITERAL_BOOL,
    }

    def __init__(self, source_code: str):
        self.source = source_code
        self.length = len(source_code)
        self.pos = 0
        self.line = 1
        self.column = 1
        self.tokens: List[Token] = []
        self.diagnostics: List[Diagnostic] = []

    def current_char(self) -> Optional[str]:
        if self.pos >= self.length:
            return None
        return self.source[self.pos]

    def peek(self, offset: int = 1) -> Optional[str]:
        target = self.pos + offset
        if target >= self.length:
            return None
        return self.source[target]

    def advance(self) -> Optional[str]:
        ch = self.current_char()
        if ch is not None:
            self.pos += 1
            if ch == '\n':
                self.line += 1
                self.column = 1
            else:
                self.column += 1
        return ch

    def tokenize(self) -> Tuple[List[Token], List[Diagnostic]]:
        while self.pos < self.length:
            ch = self.current_char()

            # Skip whitespace
            if ch in (' ', '\t', '\r', '\n'):
                self.advance()
                continue

            start_line = self.line
            start_col = self.column

            # Comments: single-line // or multi-line /* ... */
            if ch == '/' and self.peek() == '/':
                comment_text = ""
                while self.current_char() is not None and self.current_char() != '\n':
                    comment_text += self.advance()
                # Optional: Record comment token or ignore
                continue

            if ch == '/' and self.peek() == '*':
                self.advance() # /
                self.advance() # *
                comment_text = "/*"
                closed = False
                while self.current_char() is not None:
                    if self.current_char() == '*' and self.peek() == '/':
                        self.advance() # *
                        self.advance() # /
                        closed = True
                        break
                    comment_text += self.advance()
                if not closed:
                    self.diagnostics.append(Diagnostic(
                        severity="error",
                        stage="lexical",
                        line=start_line,
                        column=start_col,
                        code="LEX002",
                        message="Unterminated multi-line comment",
                        suggestion="Close the multi-line comment with '*/'"
                    ))
                continue

            # Two-character operators
            if ch == '=' and self.peek() == '=':
                self.advance()
                self.advance()
                self.tokens.append(Token(TokenType.EQUAL_EQUAL, "==", start_line, start_col))
                continue
            if ch == '!' and self.peek() == '=':
                self.advance()
                self.advance()
                self.tokens.append(Token(TokenType.NOT_EQUAL, "!=", start_line, start_col))
                continue
            if ch == '<' and self.peek() == '=':
                self.advance()
                self.advance()
                self.tokens.append(Token(TokenType.LESS_EQUAL, "<=", start_line, start_col))
                continue
            if ch == '>' and self.peek() == '=':
                self.advance()
                self.advance()
                self.tokens.append(Token(TokenType.GREATER_EQUAL, ">=", start_line, start_col))
                continue
            if ch == '&' and self.peek() == '&':
                self.advance()
                self.advance()
                self.tokens.append(Token(TokenType.AND, "&&", start_line, start_col))
                continue
            if ch == '|' and self.peek() == '|':
                self.advance()
                self.advance()
                self.tokens.append(Token(TokenType.OR, "||", start_line, start_col))
                continue

            # Single-character tokens
            if ch == '+':
                self.advance()
                self.tokens.append(Token(TokenType.PLUS, "+", start_line, start_col))
                continue
            if ch == '-':
                self.advance()
                self.tokens.append(Token(TokenType.MINUS, "-", start_line, start_col))
                continue
            if ch == '*':
                self.advance()
                self.tokens.append(Token(TokenType.STAR, "*", start_line, start_col))
                continue
            if ch == '/':
                self.advance()
                self.tokens.append(Token(TokenType.SLASH, "/", start_line, start_col))
                continue
            if ch == '%':
                self.advance()
                self.tokens.append(Token(TokenType.PERCENT, "%", start_line, start_col))
                continue
            if ch == '=':
                self.advance()
                self.tokens.append(Token(TokenType.ASSIGN, "=", start_line, start_col))
                continue
            if ch == '<':
                self.advance()
                self.tokens.append(Token(TokenType.LESS, "<", start_line, start_col))
                continue
            if ch == '>':
                self.advance()
                self.tokens.append(Token(TokenType.GREATER, ">", start_line, start_col))
                continue
            if ch == '!':
                self.advance()
                self.tokens.append(Token(TokenType.NOT, "!", start_line, start_col))
                continue
            if ch == ';':
                self.advance()
                self.tokens.append(Token(TokenType.SEMICOLON, ";", start_line, start_col))
                continue
            if ch == ':':
                self.advance()
                self.tokens.append(Token(TokenType.COLON, ":", start_line, start_col))
                continue
            if ch == ',':
                self.advance()
                self.tokens.append(Token(TokenType.COMMA, ",", start_line, start_col))
                continue
            if ch == '(':
                self.advance()
                self.tokens.append(Token(TokenType.LPAREN, "(", start_line, start_col))
                continue
            if ch == ')':
                self.advance()
                self.tokens.append(Token(TokenType.RPAREN, ")", start_line, start_col))
                continue
            if ch == '{':
                self.advance()
                self.tokens.append(Token(TokenType.LBRACE, "{", start_line, start_col))
                continue
            if ch == '}':
                self.advance()
                self.tokens.append(Token(TokenType.RBRACE, "}", start_line, start_col))
                continue

            # String literals
            if ch in ('"', "'"):
                quote = ch
                self.advance()
                str_val = ""
                closed = False
                while self.current_char() is not None:
                    curr = self.current_char()
                    if curr == quote:
                        self.advance()
                        closed = True
                        break
                    elif curr == '\\':
                        self.advance()
                        esc = self.current_char()
                        if esc == 'n':
                            str_val += '\n'
                        elif esc == 't':
                            str_val += '\t'
                        elif esc in ('"', "'", '\\'):
                            str_val += esc
                        else:
                            str_val += esc or ''
                        self.advance()
                    elif curr == '\n':
                        break
                    else:
                        str_val += self.advance()
                
                if not closed:
                    self.diagnostics.append(Diagnostic(
                        severity="error",
                        stage="lexical",
                        line=start_line,
                        column=start_col,
                        code="LEX002",
                        message=f"Unterminated string literal starting with {quote}",
                        suggestion=f"Add closing {quote} before end of line"
                    ))
                else:
                    self.tokens.append(Token(TokenType.LITERAL_STRING, f'"{str_val}"', start_line, start_col, str_val))
                continue

            # Number literals (int or float)
            if ch.isdigit():
                num_str = ""
                is_float = False
                while self.current_char() is not None and (self.current_char().isdigit() or self.current_char() == '.'):
                    if self.current_char() == '.':
                        if is_float:
                            break  # Multiple dots
                        if self.peek() is not None and self.peek().isdigit():
                            is_float = True
                            num_str += self.advance()
                        else:
                            break
                    else:
                        num_str += self.advance()
                
                if is_float:
                    self.tokens.append(Token(TokenType.LITERAL_FLOAT, num_str, start_line, start_col, float(num_str)))
                else:
                    self.tokens.append(Token(TokenType.LITERAL_INT, num_str, start_line, start_col, int(num_str)))
                continue

            # Identifiers and Keywords
            if ch.isalpha() or ch == '_':
                ident = ""
                while self.current_char() is not None and (self.current_char().isalnum() or self.current_char() == '_'):
                    ident += self.advance()
                
                if ident in self.KEYWORDS:
                    ttype = self.KEYWORDS[ident]
                    val = None
                    if ttype == TokenType.LITERAL_BOOL:
                        val = (ident == "true")
                    self.tokens.append(Token(ttype, ident, start_line, start_col, val))
                else:
                    self.tokens.append(Token(TokenType.IDENTIFIER, ident, start_line, start_col, ident))
                continue

            # Unknown character error
            bad_char = self.advance()
            self.diagnostics.append(Diagnostic(
                severity="error",
                stage="lexical",
                line=start_line,
                column=start_col,
                code="LEX001",
                message=f"Unexpected character '{bad_char}'",
                suggestion=f"Remove invalid character '{bad_char}' or replace with valid SimpleLang token"
            ))

        self.tokens.append(Token(TokenType.EOF, "", self.line, self.column))
        return self.tokens, self.diagnostics

    def to_models(self) -> Tuple[List[TokenModel], dict]:
        models = []
        stats = {}
        for idx, t in enumerate(self.tokens):
            cat = t.get_category()
            stats[cat] = stats.get(cat, 0) + 1
            models.append(TokenModel(
                index=idx + 1,
                lexeme=t.lexeme if t.type != TokenType.EOF else "EOF",
                token_type=t.type.value,
                category=cat,
                line=t.line,
                column=t.column,
                value=t.value
            ))
        return models, stats
