from __future__ import annotations
from dataclasses import dataclass, field
from typing import List, Optional, Any, Dict
from ..models import TACInstructionModel
from ..parser.ast_nodes import (
    ASTNode, ProgramNode, VarDeclNode, AssignNode, BinaryOpNode,
    UnaryOpNode, LiteralNode, IdentifierNode, BlockNode, IfNode,
    WhileNode, FunctionDeclNode, ReturnNode, FunctionCallNode,
    PrintNode, TypeCastNode
)


@dataclass
class TACInstruction:
    index: int
    op: str  # '+', '-', '*', '/', '%', '=', '==', '!=', '<', '<=', '>', '>=', '&&', '||', '!', 'goto', 'if_goto', 'if_false_goto', 'label', 'call', 'param', 'return', 'print', 'cast'
    arg1: Optional[str] = None
    arg2: Optional[str] = None
    result: Optional[str] = None
    is_leader: bool = False
    block_id: Optional[str] = None

    def to_raw(self) -> str:
        if self.op == "label":
            return f"{self.result}:"
        elif self.op == "=":
            return f"{self.result} = {self.arg1}"
        elif self.op in ("+", "-", "*", "/", "%", "==", "!=", "<", "<=", ">", ">=", "&&", "||"):
            return f"{self.result} = {self.arg1} {self.op} {self.arg2}"
        elif self.op in ("!", "neg"):
            return f"{self.result} = {self.op} {self.arg1}"
        elif self.op == "goto":
            return f"goto {self.result}"
        elif self.op == "if_goto":
            return f"if {self.arg1} goto {self.result}"
        elif self.op == "if_false_goto":
            return f"ifFalse {self.arg1} goto {self.result}"
        elif self.op == "param":
            return f"param {self.arg1}"
        elif self.op == "call":
            if self.result:
                return f"{self.result} = call {self.arg1}, {self.arg2 or 0}"
            return f"call {self.arg1}, {self.arg2 or 0}"
        elif self.op == "return":
            if self.arg1:
                return f"return {self.arg1}"
            return "return"
        elif self.op == "print":
            return f"print {self.arg1}"
        elif self.op == "cast":
            return f"{self.result} = {self.arg1}({self.arg2})"
        return f"{self.op} {self.arg1 or ''} {self.arg2 or ''} -> {self.result or ''}".strip()

    def to_model(self) -> TACInstructionModel:
        return TACInstructionModel(
            index=self.index,
            op=self.op,
            arg1=self.arg1,
            arg2=self.arg2,
            result=self.result,
            raw=self.to_raw(),
            is_leader=self.is_leader,
            block_id=self.block_id
        )


class TACGenerator:
    def __init__(self):
        self.instructions: List[TACInstruction] = []
        self.temp_counter = 1
        self.label_counter = 1

    def new_temp(self) -> str:
        t = f"t{self.temp_counter}"
        self.temp_counter += 1
        return t

    def new_label(self, prefix: str = "L") -> str:
        lbl = f"{prefix}{self.label_counter}"
        self.label_counter += 1
        return lbl

    def emit(self, op: str, arg1: Optional[str] = None, arg2: Optional[str] = None, result: Optional[str] = None) -> TACInstruction:
        idx = len(self.instructions) + 1
        instr = TACInstruction(index=idx, op=op, arg1=arg1, arg2=arg2, result=result)
        self.instructions.append(instr)
        return instr

    def emit_label(self, label_name: str) -> TACInstruction:
        return self.emit(op="label", result=label_name)

    def generate(self, root: ProgramNode) -> List[TACInstruction]:
        self.instructions.clear()
        self.temp_counter = 1
        self.label_counter = 1
        self.visit(root)
        return self.instructions

    def visit(self, node: ASTNode) -> Optional[str]:
        if node is None:
            return None
        method = f"visit_{node.__class__.__name__}"
        visitor = getattr(self, method, self.generic_visit)
        return visitor(node)

    def generic_visit(self, node: ASTNode) -> Optional[str]:
        return None

    def visit_ProgramNode(self, node: ProgramNode) -> None:
        for stmt in node.statements:
            self.visit(stmt)

    def visit_VarDeclNode(self, node: VarDeclNode) -> None:
        if node.initializer:
            rhs = self.visit(node.initializer)
            self.emit("=", arg1=str(rhs), result=node.name)

    def visit_AssignNode(self, node: AssignNode) -> None:
        rhs = self.visit(node.expression)
        self.emit("=", arg1=str(rhs), result=node.name)

    def visit_BinaryOpNode(self, node: BinaryOpNode) -> str:
        left = self.visit(node.left)
        right = self.visit(node.right)
        temp = self.new_temp()
        self.emit(node.op, arg1=str(left), arg2=str(right), result=temp)
        return temp

    def visit_UnaryOpNode(self, node: UnaryOpNode) -> str:
        operand = self.visit(node.operand)
        temp = self.new_temp()
        op_code = "neg" if node.op == "-" else "!"
        self.emit(op_code, arg1=str(operand), result=temp)
        return temp

    def visit_LiteralNode(self, node: LiteralNode) -> str:
        if node.literal_type == "string":
            return f'"{node.value}"'
        elif node.literal_type == "bool":
            return "true" if node.value else "false"
        return str(node.value)

    def visit_IdentifierNode(self, node: IdentifierNode) -> str:
        return node.name

    def visit_BlockNode(self, node: BlockNode) -> None:
        for stmt in node.statements:
            self.visit(stmt)

    def visit_IfNode(self, node: IfNode) -> None:
        cond_val = self.visit(node.condition)
        label_then = self.new_label("L_then_")
        label_else = self.new_label("L_else_") if node.else_branch else None
        label_end = self.new_label("L_endif_")

        false_target = label_else if label_else else label_end
        self.emit("if_false_goto", arg1=str(cond_val), result=false_target)

        # Then branch
        if node.then_branch:
            self.visit(node.then_branch)
        
        if node.else_branch:
            self.emit("goto", result=label_end)
            self.emit_label(label_else)
            self.visit(node.else_branch)

        self.emit_label(label_end)

    def visit_WhileNode(self, node: WhileNode) -> None:
        label_start = self.new_label("L_while_start_")
        label_body = self.new_label("L_while_body_")
        label_end = self.new_label("L_while_end_")

        self.emit_label(label_start)
        cond_val = self.visit(node.condition)
        self.emit("if_false_goto", arg1=str(cond_val), result=label_end)

        if node.body:
            self.visit(node.body)

        self.emit("goto", result=label_start)
        self.emit_label(label_end)

    def visit_FunctionDeclNode(self, node: FunctionDeclNode) -> None:
        fn_label = f"func_{node.name}"
        self.emit_label(fn_label)
        if node.body:
            self.visit(node.body)
        # Default return if void
        if node.return_type == "void":
            self.emit("return")

    def visit_ReturnNode(self, node: ReturnNode) -> None:
        if node.expression:
            val = self.visit(node.expression)
            self.emit("return", arg1=str(val))
        else:
            self.emit("return")

    def visit_FunctionCallNode(self, node: FunctionCallNode) -> str:
        arg_values = [self.visit(arg) for arg in node.arguments]
        for arg_val in arg_values:
            self.emit("param", arg1=str(arg_val))
        temp = self.new_temp()
        self.emit("call", arg1=f"func_{node.name}", arg2=str(len(arg_values)), result=temp)
        return temp

    def visit_PrintNode(self, node: PrintNode) -> None:
        if node.expression:
            val = self.visit(node.expression)
            self.emit("print", arg1=str(val))

    def visit_TypeCastNode(self, node: TypeCastNode) -> str:
        val = self.visit(node.expression)
        temp = self.new_temp()
        cast_func = f"intToFloat" if node.target_type == "float" else "floatToInt"
        self.emit("cast", arg1=cast_func, arg2=str(val), result=temp)
        return temp
