from typing import List, Tuple, Optional, Any, Dict
from ..models import Diagnostic
from .symbol_table import SymbolTableManager
from .type_system import TypeSystem
from ..parser.ast_nodes import (
    ASTNode, ProgramNode, VarDeclNode, AssignNode, BinaryOpNode,
    UnaryOpNode, LiteralNode, IdentifierNode, BlockNode, IfNode,
    WhileNode, FunctionDeclNode, ReturnNode, FunctionCallNode,
    PrintNode, TypeCastNode
)


class TypeChecker:
    def __init__(self, symbol_table: Optional[SymbolTableManager] = None):
        self.sym_manager = symbol_table or SymbolTableManager()
        self.diagnostics: List[Diagnostic] = []
        self.current_function_return_type: Optional[str] = None
        self.type_checks_log: List[Dict[str, Any]] = []

    def check(self, program: ProgramNode) -> Tuple[List[Diagnostic], Dict[str, Any]]:
        self.visit(program)
        
        # Check for unused variables warning
        for sym in self.sym_manager.all_symbols:
            if sym.kind == "variable" and not sym.is_used:
                self.diagnostics.append(Diagnostic(
                    severity="warning",
                    stage="semantic",
                    line=sym.line,
                    column=sym.column,
                    code="SEM003",
                    message=f"Variable '{sym.name}' declared but never read.",
                    suggestion=f"Use variable '{sym.name}' in expressions or remove it."
                ))

        # Check for combined diagnostics
        all_diags = self.sym_manager.diagnostics + self.diagnostics

        summary = {
            "total_checks": len(self.type_checks_log),
            "errors": [d for d in all_diags if d.severity == "error"],
            "warnings": [d for d in all_diags if d.severity == "warning"],
            "logs": self.type_checks_log
        }
        return all_diags, summary

    def visit(self, node: ASTNode) -> Optional[str]:
        if node is None:
            return None

        method_name = f"visit_{node.__class__.__name__}"
        visitor = getattr(self, method_name, self.generic_visit)
        return visitor(node)

    def generic_visit(self, node: ASTNode) -> Optional[str]:
        return None

    def visit_ProgramNode(self, node: ProgramNode) -> None:
        for stmt in node.statements:
            self.visit(stmt)

    def visit_VarDeclNode(self, node: VarDeclNode) -> None:
        if not TypeSystem.is_valid_type(node.declared_type):
            self.diagnostics.append(Diagnostic(
                severity="error",
                stage="type",
                line=node.line,
                column=node.column,
                code="TYP000",
                message=f"Unknown type '{node.declared_type}' in declaration of '{node.name}'",
                suggestion="Use valid types: int, float, string, bool"
            ))

        init_type = None
        if node.initializer:
            init_type = self.visit(node.initializer)
            if init_type and init_type != "unknown":
                if not TypeSystem.is_assignable(node.declared_type, init_type):
                    self.diagnostics.append(Diagnostic(
                        severity="error",
                        stage="type",
                        line=node.line,
                        column=node.column,
                        code="TYP001",
                        message=f"Type mismatch: Cannot assign '{init_type}' to variable '{node.name}' of declared type '{node.declared_type}'",
                        suggestion=f"Change initializer expression to evaluate to '{node.declared_type}', or use explicit conversion."
                    ))
                self.type_checks_log.append({
                    "check": "variable_declaration_init",
                    "var": node.name,
                    "declared": node.declared_type,
                    "received": init_type,
                    "valid": node.declared_type == init_type,
                    "line": node.line
                })

        # Register in symbol table
        self.sym_manager.define(
            name=node.name,
            type_name=node.declared_type,
            kind="variable",
            line=node.line,
            column=node.column
        )
        node.inferred_type = node.declared_type

    def visit_AssignNode(self, node: AssignNode) -> None:
        sym = self.sym_manager.lookup(node.name, line=node.line, column=node.column, report_missing=True)
        expr_type = self.visit(node.expression)

        if sym and expr_type and expr_type != "unknown":
            if not TypeSystem.is_assignable(sym.type_name, expr_type):
                self.diagnostics.append(Diagnostic(
                    severity="error",
                    stage="type",
                    line=node.line,
                    column=node.column,
                    code="TYP001",
                    message=f"Type mismatch: Cannot assign '{expr_type}' to variable '{node.name}' of type '{sym.type_name}'",
                    suggestion=f"Ensure value assigned to '{node.name}' matches its declared type '{sym.type_name}'."
                ))
            self.type_checks_log.append({
                "check": "assignment_compatibility",
                "var": node.name,
                "expected": sym.type_name,
                "received": expr_type,
                "valid": sym.type_name == expr_type,
                "line": node.line
            })
            node.inferred_type = sym.type_name

    def visit_BinaryOpNode(self, node: BinaryOpNode) -> str:
        left_type = self.visit(node.left)
        right_type = self.visit(node.right)

        if not left_type or not right_type or left_type == "unknown" or right_type == "unknown":
            node.inferred_type = "unknown"
            return "unknown"

        result_type = TypeSystem.check_binary_op(left_type, node.op, right_type)
        if result_type is None:
            self.diagnostics.append(Diagnostic(
                severity="error",
                stage="type",
                line=node.line,
                column=node.column,
                code="TYP002",
                message=f"Invalid binary operation: operator '{node.op}' cannot be applied to types '{left_type}' and '{right_type}'",
                suggestion=f"Verify operand types. For example '+' is supported for (int, int), (float, float), (string, string)."
            ))
            node.inferred_type = "unknown"
            return "unknown"

        self.type_checks_log.append({
            "check": "binary_op",
            "op": node.op,
            "left": left_type,
            "right": right_type,
            "result": result_type,
            "line": node.line
        })
        node.inferred_type = result_type
        return result_type

    def visit_UnaryOpNode(self, node: UnaryOpNode) -> str:
        op_type = self.visit(node.operand)
        if not op_type or op_type == "unknown":
            node.inferred_type = "unknown"
            return "unknown"

        res_type = TypeSystem.check_unary_op(node.op, op_type)
        if res_type is None:
            self.diagnostics.append(Diagnostic(
                severity="error",
                stage="type",
                line=node.line,
                column=node.column,
                code="TYP002",
                message=f"Invalid unary operation '{node.op}' on operand of type '{op_type}'",
                suggestion=f"Operator '{node.op}' is not defined for '{op_type}'."
            ))
            node.inferred_type = "unknown"
            return "unknown"

        node.inferred_type = res_type
        return res_type

    def visit_LiteralNode(self, node: LiteralNode) -> str:
        node.inferred_type = node.literal_type
        return node.literal_type

    def visit_IdentifierNode(self, node: IdentifierNode) -> str:
        sym = self.sym_manager.lookup(node.name, line=node.line, column=node.column, report_missing=True)
        if sym:
            node.inferred_type = sym.type_name
            return sym.type_name
        node.inferred_type = "unknown"
        return "unknown"

    def visit_BlockNode(self, node: BlockNode) -> None:
        for stmt in node.statements:
            self.visit(stmt)

    def visit_IfNode(self, node: IfNode) -> None:
        cond_type = self.visit(node.condition)
        if cond_type and cond_type != "bool" and cond_type != "unknown":
            self.diagnostics.append(Diagnostic(
                severity="error",
                stage="type",
                line=node.line,
                column=node.column,
                code="TYP005",
                message=f"Condition in 'if' statement must evaluate to 'bool', received '{cond_type}'",
                suggestion="Use relational or logical expressions resulting in boolean (e.g. x > 0)."
            ))
        if node.then_branch:
            self.visit(node.then_branch)
        if node.else_branch:
            self.visit(node.else_branch)

    def visit_WhileNode(self, node: WhileNode) -> None:
        cond_type = self.visit(node.condition)
        if cond_type and cond_type != "bool" and cond_type != "unknown":
            self.diagnostics.append(Diagnostic(
                severity="error",
                stage="type",
                line=node.line,
                column=node.column,
                code="TYP005",
                message=f"Condition in 'while' loop must evaluate to 'bool', received '{cond_type}'",
                suggestion="Use relational or logical expressions resulting in boolean (e.g. count < 10)."
            ))
        if node.body:
            self.visit(node.body)

    def visit_FunctionDeclNode(self, node: FunctionDeclNode) -> None:
        param_types = [p.param_type for p in node.params]
        # Define in enclosing scope
        self.sym_manager.define(
            name=node.name,
            type_name=f"({', '.join(param_types)}) -> {node.return_type}",
            kind="function",
            line=node.line,
            column=node.column,
            param_types=param_types,
            return_type=node.return_type
        )

        # Enter function local scope
        self.sym_manager.enter_scope(f"func_{node.name}")
        old_ret = self.current_function_return_type
        self.current_function_return_type = node.return_type

        # Define parameters in local scope
        for p in node.params:
            self.sym_manager.define(
                name=p.name,
                type_name=p.param_type,
                kind="parameter",
                line=p.line,
                column=p.column
            )

        if node.body:
            self.visit(node.body)

        self.sym_manager.exit_scope()
        self.current_function_return_type = old_ret
        node.inferred_type = node.return_type

    def visit_ReturnNode(self, node: ReturnNode) -> None:
        if self.current_function_return_type is None:
            self.diagnostics.append(Diagnostic(
                severity="error",
                stage="semantic",
                line=node.line,
                column=node.column,
                code="SEM004",
                message="'return' statement outside of function definition",
                suggestion="Place 'return' inside a function body."
            ))
            return

        expr_type = "void"
        if node.expression:
            expr_type = self.visit(node.expression) or "unknown"

        if expr_type != "unknown" and self.current_function_return_type != "void":
            if expr_type != self.current_function_return_type:
                self.diagnostics.append(Diagnostic(
                    severity="error",
                    stage="type",
                    line=node.line,
                    column=node.column,
                    code="TYP003",
                    message=f"Return type mismatch: function declared with return type '{self.current_function_return_type}', returned '{expr_type}'",
                    suggestion=f"Return a value matching declared return type '{self.current_function_return_type}'."
                ))
        node.inferred_type = expr_type

    def visit_FunctionCallNode(self, node: FunctionCallNode) -> str:
        sym = self.sym_manager.lookup(node.name, line=node.line, column=node.column, report_missing=True)
        if not sym or sym.kind != "function":
            if sym and sym.kind != "function":
                self.diagnostics.append(Diagnostic(
                    severity="error",
                    stage="type",
                    line=node.line,
                    column=node.column,
                    code="TYP004",
                    message=f"Cannot call '{node.name}' as a function: it is a {sym.kind}",
                    suggestion=f"Check the name of the function being called."
                ))
            node.inferred_type = "unknown"
            return "unknown"

        # Check argument count
        expected_params = sym.param_types or []
        if len(node.arguments) != len(expected_params):
            self.diagnostics.append(Diagnostic(
                severity="error",
                stage="type",
                line=node.line,
                column=node.column,
                code="TYP004",
                message=f"Function '{node.name}' expects {len(expected_params)} arguments, got {len(node.arguments)}",
                suggestion=f"Provide exactly {len(expected_params)} arguments: ({', '.join(expected_params)})"
            ))

        # Check argument types
        for idx, (arg, exp_type) in enumerate(zip(node.arguments, expected_params)):
            arg_type = self.visit(arg)
            if arg_type and arg_type != "unknown" and arg_type != exp_type:
                self.diagnostics.append(Diagnostic(
                    severity="error",
                    stage="type",
                    line=arg.line,
                    column=arg.column,
                    code="TYP004",
                    message=f"Argument {idx + 1} of function '{node.name}' expects type '{exp_type}', received '{arg_type}'",
                    suggestion=f"Pass value of type '{exp_type}' for parameter {idx + 1}."
                ))

        ret_type = sym.return_type or "void"
        node.inferred_type = ret_type
        return ret_type

    def visit_PrintNode(self, node: PrintNode) -> None:
        if node.expression:
            self.visit(node.expression)

    def visit_TypeCastNode(self, node: TypeCastNode) -> str:
        expr_type = self.visit(node.expression)
        node.inferred_type = node.target_type
        return node.target_type
