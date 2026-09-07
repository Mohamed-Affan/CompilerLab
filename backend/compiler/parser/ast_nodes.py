from __future__ import annotations
from dataclasses import dataclass, field
from typing import List, Optional, Any, Dict
import uuid
from ..models import ASTNodeModel


@dataclass
class ASTNode:
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    line: int = 1
    column: int = 1
    inferred_type: Optional[str] = None

    def to_model(self) -> ASTNodeModel:
        raise NotImplementedError


@dataclass
class ProgramNode(ASTNode):
    statements: List[ASTNode] = field(default_factory=list)

    def to_model(self) -> ASTNodeModel:
        return ASTNodeModel(
            id=self.id,
            type="Program",
            label="Program",
            line=self.line,
            column=self.column,
            inferred_type=None,
            details={"statement_count": len(self.statements)},
            children=[stmt.to_model() for stmt in self.statements]
        )


@dataclass
class VarDeclNode(ASTNode):
    name: str = ""
    declared_type: str = ""
    initializer: Optional[ASTNode] = None

    def to_model(self) -> ASTNodeModel:
        children = []
        if self.initializer:
            children.append(self.initializer.to_model())
        return ASTNodeModel(
            id=self.id,
            type="VarDecl",
            label=f"let {self.name} : {self.declared_type}",
            line=self.line,
            column=self.column,
            inferred_type=self.declared_type,
            details={"name": self.name, "declared_type": self.declared_type},
            children=children
        )


@dataclass
class AssignNode(ASTNode):
    name: str = ""
    expression: Optional[ASTNode] = None

    def to_model(self) -> ASTNodeModel:
        children = []
        if self.expression:
            children.append(self.expression.to_model())
        return ASTNodeModel(
            id=self.id,
            type="Assign",
            label=f"{self.name} =",
            line=self.line,
            column=self.column,
            inferred_type=self.inferred_type,
            details={"variable": self.name},
            children=children
        )


@dataclass
class BinaryOpNode(ASTNode):
    left: Optional[ASTNode] = None
    op: str = ""
    right: Optional[ASTNode] = None

    def to_model(self) -> ASTNodeModel:
        children = []
        if self.left:
            children.append(self.left.to_model())
        if self.right:
            children.append(self.right.to_model())
        return ASTNodeModel(
            id=self.id,
            type="BinaryExpression",
            label=f"BinaryOp ({self.op})",
            line=self.line,
            column=self.column,
            inferred_type=self.inferred_type,
            details={"operator": self.op},
            children=children
        )


@dataclass
class UnaryOpNode(ASTNode):
    op: str = ""
    operand: Optional[ASTNode] = None

    def to_model(self) -> ASTNodeModel:
        children = []
        if self.operand:
            children.append(self.operand.to_model())
        return ASTNodeModel(
            id=self.id,
            type="UnaryExpression",
            label=f"UnaryOp ({self.op})",
            line=self.line,
            column=self.column,
            inferred_type=self.inferred_type,
            details={"operator": self.op},
            children=children
        )


@dataclass
class LiteralNode(ASTNode):
    value: Any = None
    literal_type: str = ""  # int, float, string, bool

    def to_model(self) -> ASTNodeModel:
        return ASTNodeModel(
            id=self.id,
            type="Literal",
            label=f"Literal ({self.value}) : {self.literal_type}",
            line=self.line,
            column=self.column,
            inferred_type=self.literal_type,
            details={"value": str(self.value), "type": self.literal_type},
            children=[]
        )


@dataclass
class IdentifierNode(ASTNode):
    name: str = ""

    def to_model(self) -> ASTNodeModel:
        return ASTNodeModel(
            id=self.id,
            type="Identifier",
            label=f"Identifier ({self.name})",
            line=self.line,
            column=self.column,
            inferred_type=self.inferred_type,
            details={"name": self.name},
            children=[]
        )


@dataclass
class BlockNode(ASTNode):
    statements: List[ASTNode] = field(default_factory=list)

    def to_model(self) -> ASTNodeModel:
        return ASTNodeModel(
            id=self.id,
            type="Block",
            label="Block { ... }",
            line=self.line,
            column=self.column,
            inferred_type=None,
            details={"count": len(self.statements)},
            children=[s.to_model() for s in self.statements]
        )


@dataclass
class IfNode(ASTNode):
    condition: Optional[ASTNode] = None
    then_branch: Optional[BlockNode] = None
    else_branch: Optional[BlockNode] = None

    def to_model(self) -> ASTNodeModel:
        children = []
        if self.condition:
            children.append(self.condition.to_model())
        if self.then_branch:
            children.append(self.then_branch.to_model())
        if self.else_branch:
            children.append(self.else_branch.to_model())
        return ASTNodeModel(
            id=self.id,
            type="IfStatement",
            label="if (...) { }",
            line=self.line,
            column=self.column,
            inferred_type=None,
            details={"has_else": self.else_branch is not None},
            children=children
        )


@dataclass
class WhileNode(ASTNode):
    condition: Optional[ASTNode] = None
    body: Optional[BlockNode] = None

    def to_model(self) -> ASTNodeModel:
        children = []
        if self.condition:
            children.append(self.condition.to_model())
        if self.body:
            children.append(self.body.to_model())
        return ASTNodeModel(
            id=self.id,
            type="WhileStatement",
            label="while (...) { }",
            line=self.line,
            column=self.column,
            inferred_type=None,
            details={},
            children=children
        )


@dataclass
class ParamNode:
    name: str
    param_type: str
    line: int = 1
    column: int = 1


@dataclass
class FunctionDeclNode(ASTNode):
    name: str = ""
    params: List[ParamNode] = field(default_factory=list)
    return_type: str = "void"
    body: Optional[BlockNode] = None

    def to_model(self) -> ASTNodeModel:
        param_str = ", ".join(f"{p.name}: {p.param_type}" for p in self.params)
        children = []
        if self.body:
            children.append(self.body.to_model())
        return ASTNodeModel(
            id=self.id,
            type="FunctionDecl",
            label=f"function {self.name}({param_str}) : {self.return_type}",
            line=self.line,
            column=self.column,
            inferred_type=self.return_type,
            details={
                "name": self.name,
                "params": [{"name": p.name, "type": p.param_type} for p in self.params],
                "return_type": self.return_type
            },
            children=children
        )


@dataclass
class ReturnNode(ASTNode):
    expression: Optional[ASTNode] = None

    def to_model(self) -> ASTNodeModel:
        children = []
        if self.expression:
            children.append(self.expression.to_model())
        return ASTNodeModel(
            id=self.id,
            type="ReturnStatement",
            label="return",
            line=self.line,
            column=self.column,
            inferred_type=self.inferred_type,
            details={},
            children=children
        )


@dataclass
class FunctionCallNode(ASTNode):
    name: str = ""
    arguments: List[ASTNode] = field(default_factory=list)

    def to_model(self) -> ASTNodeModel:
        return ASTNodeModel(
            id=self.id,
            type="FunctionCall",
            label=f"Call {self.name}(...)",
            line=self.line,
            column=self.column,
            inferred_type=self.inferred_type,
            details={"function": self.name, "arg_count": len(self.arguments)},
            children=[arg.to_model() for arg in self.arguments]
        )


@dataclass
class PrintNode(ASTNode):
    expression: Optional[ASTNode] = None

    def to_model(self) -> ASTNodeModel:
        children = []
        if self.expression:
            children.append(self.expression.to_model())
        return ASTNodeModel(
            id=self.id,
            type="PrintStatement",
            label="print(...)",
            line=self.line,
            column=self.column,
            inferred_type=None,
            details={},
            children=children
        )


@dataclass
class TypeCastNode(ASTNode):
    target_type: str = ""
    expression: Optional[ASTNode] = None

    def to_model(self) -> ASTNodeModel:
        children = []
        if self.expression:
            children.append(self.expression.to_model())
        return ASTNodeModel(
            id=self.id,
            type="TypeCast",
            label=f"Cast to {self.target_type}",
            line=self.line,
            column=self.column,
            inferred_type=self.target_type,
            details={"target_type": self.target_type},
            children=children
        )
