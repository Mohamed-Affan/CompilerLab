from typing import List, Tuple, Optional, Any
from ..lexer.tokens import Token, TokenType
from .ast_nodes import (
    ASTNode, ProgramNode, VarDeclNode, AssignNode, BinaryOpNode,
    UnaryOpNode, LiteralNode, IdentifierNode, BlockNode, IfNode,
    WhileNode, FunctionDeclNode, ReturnNode, FunctionCallNode,
    PrintNode, TypeCastNode, ParamNode
)
from ..models import Diagnostic


class Parser:
    def __init__(self, tokens: List[Token]):
        # Filter out comments for AST building, but keep EOF
        self.tokens = [t for t in tokens if t.type != TokenType.COMMENT]
        self.pos = 0
        self.trace: List[str] = []
        self.diagnostics: List[Diagnostic] = []

    def current_token(self) -> Token:
        if self.pos < len(self.tokens):
            return self.tokens[self.pos]
        return self.tokens[-1]  # EOF token

    def peek(self, offset: int = 1) -> Token:
        target = self.pos + offset
        if target < len(self.tokens):
            return self.tokens[target]
        return self.tokens[-1]

    def advance(self) -> Token:
        tok = self.current_token()
        if self.pos < len(self.tokens) - 1:
            self.pos += 1
        return tok

    def check(self, token_type: TokenType) -> bool:
        return self.current_token().type == token_type

    def match(self, *token_types: TokenType) -> bool:
        for tt in token_types:
            if self.check(tt):
                self.advance()
                return True
        return False

    def consume(self, token_type: TokenType, error_code: str, error_msg: str, suggestion: Optional[str] = None) -> Optional[Token]:
        if self.check(token_type):
            return self.advance()
        curr = self.current_token()
        self.diagnostics.append(Diagnostic(
            severity="error",
            stage="syntax",
            line=curr.line,
            column=curr.column,
            code=error_code,
            message=f"{error_msg} (got '{curr.lexeme}')",
            suggestion=suggestion
        ))
        return None

    def log_trace(self, rule_name: str, message: str = ""):
        indent = "  " * min(len(self.trace) % 4, 3)
        tok = self.current_token()
        self.trace.append(f"{indent}{rule_name} [lookahead: '{tok.lexeme}'] {message}".strip())

    # --- Grammar Parsing Methods ---

    def parse(self) -> Tuple[Optional[ProgramNode], List[Diagnostic], List[str]]:
        self.log_trace("parseProgram()", "Starting parse")
        program = ProgramNode(line=1, column=1)
        
        while not self.check(TokenType.EOF):
            stmt = self.parse_statement()
            if stmt:
                program.statements.append(stmt)
            else:
                # Synchronization recovery: advance until semicolon or brace
                self.synchronize()

        self.log_trace("parseProgram()", f"Completed with {len(program.statements)} statements")
        return program, self.diagnostics, self.trace

    def synchronize(self):
        self.advance()
        while not self.check(TokenType.EOF):
            if self.tokens[self.pos - 1].type == TokenType.SEMICOLON:
                return
            if self.current_token().type in (TokenType.LET, TokenType.IF, TokenType.WHILE, 
                                             TokenType.FUNCTION, TokenType.RETURN, TokenType.PRINT):
                return
            self.advance()

    def parse_statement(self) -> Optional[ASTNode]:
        tok = self.current_token()
        self.log_trace("parseStatement()", f"at token '{tok.lexeme}'")

        if self.check(TokenType.LET):
            return self.parse_declaration()
        elif self.check(TokenType.IF):
            return self.parse_if()
        elif self.check(TokenType.WHILE):
            return self.parse_while()
        elif self.check(TokenType.FUNCTION):
            return self.parse_function()
        elif self.check(TokenType.RETURN):
            return self.parse_return()
        elif self.check(TokenType.PRINT):
            return self.parse_print()
        elif self.check(TokenType.IDENTIFIER):
            if self.peek().type == TokenType.ASSIGN:
                return self.parse_assignment()
            else:
                # Expression statement or function call
                expr = self.parse_expression()
                self.consume(TokenType.SEMICOLON, "SYN002", "Expected ';' after expression", "Add ';' to terminate statement")
                return expr
        else:
            self.diagnostics.append(Diagnostic(
                severity="error",
                stage="syntax",
                line=tok.line,
                column=tok.column,
                code="SYN001",
                message=f"Unexpected token '{tok.lexeme}' in statement position",
                suggestion="Statement must start with 'let', 'if', 'while', 'function', 'return', 'print', or variable assignment"
            ))
            return None

    def parse_declaration(self) -> Optional[VarDeclNode]:
        self.log_trace("parseDeclaration()")
        let_tok = self.consume(TokenType.LET, "SYN001", "Expected 'let'")
        if not let_tok:
            return None
        
        ident_tok = self.consume(TokenType.IDENTIFIER, "SYN001", "Expected variable identifier after 'let'", "Provide a variable name like 'age'")
        if not ident_tok:
            return None

        self.consume(TokenType.COLON, "SYN002", "Expected ':' after variable name", "Add ':' followed by type annotation (e.g. ': int')")
        
        type_tok = self.current_token()
        if type_tok.type in (TokenType.TYPE_INT, TokenType.TYPE_FLOAT, TokenType.TYPE_STRING, TokenType.TYPE_BOOL):
            self.advance()
            type_name = type_tok.lexeme
        else:
            self.diagnostics.append(Diagnostic(
                severity="error",
                stage="syntax",
                line=type_tok.line,
                column=type_tok.column,
                code="SYN001",
                message=f"Expected type (int, float, string, bool), got '{type_tok.lexeme}'",
                suggestion="Specify a valid SimpleLang type: int, float, string, or bool"
            ))
            type_name = "unknown"

        init_expr = None
        if self.match(TokenType.ASSIGN):
            init_expr = self.parse_expression()

        self.consume(TokenType.SEMICOLON, "SYN002", "Expected ';' at end of declaration", "Add ';' after declaration")

        return VarDeclNode(
            line=let_tok.line,
            column=let_tok.column,
            name=ident_tok.lexeme,
            declared_type=type_name,
            initializer=init_expr
        )

    def parse_assignment(self) -> Optional[AssignNode]:
        self.log_trace("parseAssignment()")
        ident_tok = self.consume(TokenType.IDENTIFIER, "SYN001", "Expected variable name")
        if not ident_tok:
            return None

        self.consume(TokenType.ASSIGN, "SYN001", "Expected '='")
        expr = self.parse_expression()
        self.consume(TokenType.SEMICOLON, "SYN002", "Expected ';' after assignment expression", "Add ';' to terminate assignment statement")

        return AssignNode(
            line=ident_tok.line,
            column=ident_tok.column,
            name=ident_tok.lexeme,
            expression=expr
        )

    def parse_block(self) -> BlockNode:
        self.log_trace("parseBlock()")
        lbrace = self.consume(TokenType.LBRACE, "SYN002", "Expected '{' to start block", "Add '{'")
        line = lbrace.line if lbrace else self.current_token().line
        col = lbrace.column if lbrace else self.current_token().column
        
        stmts = []
        while not self.check(TokenType.RBRACE) and not self.check(TokenType.EOF):
            stmt = self.parse_statement()
            if stmt:
                stmts.append(stmt)
            else:
                self.synchronize()

        self.consume(TokenType.RBRACE, "SYN002", "Expected '}' to close block", "Add '}'")
        return BlockNode(line=line, column=col, statements=stmts)

    def parse_if(self) -> Optional[IfNode]:
        self.log_trace("parseIf()")
        if_tok = self.consume(TokenType.IF, "SYN001", "Expected 'if'")
        if not if_tok:
            return None

        self.consume(TokenType.LPAREN, "SYN002", "Expected '(' after 'if'", "Enclose if condition in parentheses: if (cond)")
        cond = self.parse_expression()
        self.consume(TokenType.RPAREN, "SYN002", "Expected ')' after if condition", "Close condition parentheses with ')'")

        then_block = self.parse_block()
        else_block = None
        if self.match(TokenType.ELSE):
            if self.check(TokenType.IF):
                # else if chained
                nested_if = self.parse_if()
                if nested_if:
                    else_block = BlockNode(line=nested_if.line, column=nested_if.column, statements=[nested_if])
            else:
                else_block = self.parse_block()

        return IfNode(line=if_tok.line, column=if_tok.column, condition=cond, then_branch=then_block, else_branch=else_block)

    def parse_while(self) -> Optional[WhileNode]:
        self.log_trace("parseWhile()")
        while_tok = self.consume(TokenType.WHILE, "SYN001", "Expected 'while'")
        if not while_tok:
            return None

        self.consume(TokenType.LPAREN, "SYN002", "Expected '(' after 'while'", "Enclose condition in parentheses: while (cond)")
        cond = self.parse_expression()
        self.consume(TokenType.RPAREN, "SYN002", "Expected ')' after while condition", "Close condition parentheses with ')'")
        body = self.parse_block()

        return WhileNode(line=while_tok.line, column=while_tok.column, condition=cond, body=body)

    def parse_function(self) -> Optional[FunctionDeclNode]:
        self.log_trace("parseFunction()")
        fn_tok = self.consume(TokenType.FUNCTION, "SYN001", "Expected 'function'")
        if not fn_tok:
            return None

        ident_tok = self.consume(TokenType.IDENTIFIER, "SYN001", "Expected function name", "Provide function name, e.g., 'add'")
        if not ident_tok:
            return None

        self.consume(TokenType.LPAREN, "SYN002", "Expected '(' after function name", "Add '(' for parameter list")
        params: List[ParamNode] = []

        if not self.check(TokenType.RPAREN):
            while True:
                p_ident = self.consume(TokenType.IDENTIFIER, "SYN001", "Expected parameter name")
                if not p_ident:
                    break
                self.consume(TokenType.COLON, "SYN002", "Expected ':' after parameter name")
                p_type_tok = self.current_token()
                if p_type_tok.type in (TokenType.TYPE_INT, TokenType.TYPE_FLOAT, TokenType.TYPE_STRING, TokenType.TYPE_BOOL):
                    self.advance()
                    p_type = p_type_tok.lexeme
                else:
                    self.diagnostics.append(Diagnostic(
                        severity="error",
                        stage="syntax",
                        line=p_type_tok.line,
                        column=p_type_tok.column,
                        code="SYN001",
                        message=f"Expected parameter type, got '{p_type_tok.lexeme}'"
                    ))
                    p_type = "int"

                params.append(ParamNode(name=p_ident.lexeme, param_type=p_type, line=p_ident.line, column=p_ident.column))
                if not self.match(TokenType.COMMA):
                    break

        self.consume(TokenType.RPAREN, "SYN002", "Expected ')' after parameters", "Close parameter list with ')'")
        
        return_type = "void"
        if self.match(TokenType.COLON):
            ret_tok = self.current_token()
            if ret_tok.type in (TokenType.TYPE_INT, TokenType.TYPE_FLOAT, TokenType.TYPE_STRING, TokenType.TYPE_BOOL):
                self.advance()
                return_type = ret_tok.lexeme
            else:
                self.diagnostics.append(Diagnostic(
                    severity="error",
                    stage="syntax",
                    line=ret_tok.line,
                    column=ret_tok.column,
                    code="SYN001",
                    message=f"Expected return type, got '{ret_tok.lexeme}'"
                ))

        body = self.parse_block()
        return FunctionDeclNode(
            line=fn_tok.line,
            column=fn_tok.column,
            name=ident_tok.lexeme,
            params=params,
            return_type=return_type,
            body=body
        )

    def parse_return(self) -> Optional[ReturnNode]:
        self.log_trace("parseReturn()")
        ret_tok = self.consume(TokenType.RETURN, "SYN001", "Expected 'return'")
        if not ret_tok:
            return None

        expr = None
        if not self.check(TokenType.SEMICOLON):
            expr = self.parse_expression()

        self.consume(TokenType.SEMICOLON, "SYN002", "Expected ';' after return statement", "Add ';' to terminate return")
        return ReturnNode(line=ret_tok.line, column=ret_tok.column, expression=expr)

    def parse_print(self) -> Optional[PrintNode]:
        self.log_trace("parsePrint()")
        print_tok = self.consume(TokenType.PRINT, "SYN001", "Expected 'print'")
        if not print_tok:
            return None

        self.consume(TokenType.LPAREN, "SYN002", "Expected '(' after print", "Use print(expression)")
        expr = self.parse_expression()
        self.consume(TokenType.RPAREN, "SYN002", "Expected ')' after print argument", "Close print call with ')'")
        self.consume(TokenType.SEMICOLON, "SYN002", "Expected ';' after print statement", "Add ';'")

        return PrintNode(line=print_tok.line, column=print_tok.column, expression=expr)

    # --- Expressions (Precedence Climbing) ---

    def parse_expression(self) -> ASTNode:
        return self.parse_logical_or()

    def parse_logical_or(self) -> ASTNode:
        left = self.parse_logical_and()
        while self.check(TokenType.OR):
            op_tok = self.advance()
            right = self.parse_logical_and()
            left = BinaryOpNode(line=op_tok.line, column=op_tok.column, left=left, op="||", right=right)
        return left

    def parse_logical_and(self) -> ASTNode:
        left = self.parse_equality()
        while self.check(TokenType.AND):
            op_tok = self.advance()
            right = self.parse_equality()
            left = BinaryOpNode(line=op_tok.line, column=op_tok.column, left=left, op="&&", right=right)
        return left

    def parse_equality(self) -> ASTNode:
        left = self.parse_relational()
        while self.check(TokenType.EQUAL_EQUAL) or self.check(TokenType.NOT_EQUAL):
            op_tok = self.advance()
            right = self.parse_relational()
            left = BinaryOpNode(line=op_tok.line, column=op_tok.column, left=left, op=op_tok.lexeme, right=right)
        return left

    def parse_relational(self) -> ASTNode:
        left = self.parse_additive()
        while self.check(TokenType.LESS) or self.check(TokenType.LESS_EQUAL) or \
              self.check(TokenType.GREATER) or self.check(TokenType.GREATER_EQUAL):
            op_tok = self.advance()
            right = self.parse_additive()
            left = BinaryOpNode(line=op_tok.line, column=op_tok.column, left=left, op=op_tok.lexeme, right=right)
        return left

    def parse_additive(self) -> ASTNode:
        left = self.parse_multiplicative()
        while self.check(TokenType.PLUS) or self.check(TokenType.MINUS):
            op_tok = self.advance()
            right = self.parse_multiplicative()
            left = BinaryOpNode(line=op_tok.line, column=op_tok.column, left=left, op=op_tok.lexeme, right=right)
        return left

    def parse_multiplicative(self) -> ASTNode:
        left = self.parse_unary()
        while self.check(TokenType.STAR) or self.check(TokenType.SLASH) or self.check(TokenType.PERCENT):
            op_tok = self.advance()
            right = self.parse_unary()
            left = BinaryOpNode(line=op_tok.line, column=op_tok.column, left=left, op=op_tok.lexeme, right=right)
        return left

    def parse_unary(self) -> ASTNode:
        if self.check(TokenType.NOT) or self.check(TokenType.MINUS):
            op_tok = self.advance()
            operand = self.parse_unary()
            return UnaryOpNode(line=op_tok.line, column=op_tok.column, op=op_tok.lexeme, operand=operand)
        return self.parse_primary()

    def parse_primary(self) -> ASTNode:
        tok = self.current_token()

        if self.check(TokenType.LITERAL_INT):
            self.advance()
            return LiteralNode(line=tok.line, column=tok.column, value=tok.value, literal_type="int")
        elif self.check(TokenType.LITERAL_FLOAT):
            self.advance()
            return LiteralNode(line=tok.line, column=tok.column, value=tok.value, literal_type="float")
        elif self.check(TokenType.LITERAL_STRING):
            self.advance()
            return LiteralNode(line=tok.line, column=tok.column, value=tok.value, literal_type="string")
        elif self.check(TokenType.LITERAL_BOOL):
            self.advance()
            return LiteralNode(line=tok.line, column=tok.column, value=tok.value, literal_type="bool")
        elif self.check(TokenType.INT_TO_FLOAT) or self.check(TokenType.FLOAT_TO_INT):
            fn_tok = self.advance()
            target_type = "float" if fn_tok.type == TokenType.INT_TO_FLOAT else "int"
            self.consume(TokenType.LPAREN, "SYN002", "Expected '(' after type conversion function")
            expr = self.parse_expression()
            self.consume(TokenType.RPAREN, "SYN002", "Expected ')' after type conversion expression")
            return TypeCastNode(line=fn_tok.line, column=fn_tok.column, target_type=target_type, expression=expr)
        elif self.check(TokenType.IDENTIFIER):
            ident_tok = self.advance()
            if self.check(TokenType.LPAREN):
                # Function call
                self.advance()
                args: List[ASTNode] = []
                if not self.check(TokenType.RPAREN):
                    while True:
                        args.append(self.parse_expression())
                        if not self.match(TokenType.COMMA):
                            break
                self.consume(TokenType.RPAREN, "SYN002", "Expected ')' after function arguments")
                return FunctionCallNode(line=ident_tok.line, column=ident_tok.column, name=ident_tok.lexeme, arguments=args)
            return IdentifierNode(line=ident_tok.line, column=ident_tok.column, name=ident_tok.lexeme)
        elif self.match(TokenType.LPAREN):
            line = tok.line
            col = tok.column
            expr = self.parse_expression()
            self.consume(TokenType.RPAREN, "SYN002", "Expected ')' after parenthesized expression")
            return expr
        else:
            self.diagnostics.append(Diagnostic(
                severity="error",
                stage="syntax",
                line=tok.line,
                column=tok.column,
                code="SYN001",
                message=f"Expected expression, found '{tok.lexeme}'",
                suggestion="Enter a literal, identifier, function call, or parenthesized expression"
            ))
            self.advance()
            return LiteralNode(line=tok.line, column=tok.column, value=0, literal_type="int")
