from __future__ import annotations
from dataclasses import dataclass, field
from typing import Dict, Optional, List, Any
from ..models import SymbolModel, ScopeTreeModel, Diagnostic


@dataclass
class Symbol:
    name: str
    type_name: str
    scope: str
    scope_level: int
    kind: str  # variable, function, parameter
    line: int
    column: int
    is_constant: bool = False
    is_used: bool = False
    value: Optional[Any] = None
    param_types: Optional[List[str]] = None
    return_type: Optional[str] = None

    def to_model(self) -> SymbolModel:
        return SymbolModel(
            name=self.name,
            type_name=self.type_name,
            scope=self.scope,
            scope_level=self.scope_level,
            kind=self.kind,
            line=self.line,
            column=self.column,
            is_constant=self.is_constant,
            is_used=self.is_used,
            value=self.value,
            param_types=self.param_types,
            return_type=self.return_type
        )


class Scope:
    def __init__(self, name: str, level: int, parent: Optional[Scope] = None):
        self.name = name
        self.level = level
        self.parent = parent
        self.symbols: Dict[str, Symbol] = {}
        self.children: List[Scope] = []

    def define(self, symbol: Symbol) -> bool:
        """Returns False if symbol is already defined in this exact scope (duplicate declaration)."""
        if symbol.name in self.symbols:
            return False
        self.symbols[symbol.name] = symbol
        return True

    def lookup_local(self, name: str) -> Optional[Symbol]:
        return self.symbols.get(name)

    def lookup(self, name: str) -> Optional[Symbol]:
        curr: Optional[Scope] = self
        while curr is not None:
            if name in curr.symbols:
                return curr.symbols[name]
            curr = curr.parent
        return None

    def to_tree_model(self) -> ScopeTreeModel:
        return ScopeTreeModel(
            name=self.name,
            level=self.level,
            parent=self.parent.name if self.parent else None,
            symbols=[sym.to_model() for sym in self.symbols.values()],
            children=[child.to_tree_model() for child in self.children]
        )


class SymbolTableManager:
    def __init__(self):
        self.global_scope = Scope("global", 0, None)
        self.current_scope = self.global_scope
        self.all_symbols: List[Symbol] = []
        self.diagnostics: List[Diagnostic] = []

    def enter_scope(self, name: str) -> Scope:
        new_scope = Scope(name, self.current_scope.level + 1, self.current_scope)
        self.current_scope.children.append(new_scope)
        self.current_scope = new_scope
        return new_scope

    def exit_scope(self) -> Scope:
        if self.current_scope.parent:
            self.current_scope = self.current_scope.parent
        return self.current_scope

    def define(self, name: str, type_name: str, kind: str, line: int, column: int,
               param_types: Optional[List[str]] = None, return_type: Optional[str] = None,
               value: Optional[Any] = None) -> Optional[Symbol]:
        symbol = Symbol(
            name=name,
            type_name=type_name,
            scope=self.current_scope.name,
            scope_level=self.current_scope.level,
            kind=kind,
            line=line,
            column=column,
            param_types=param_types,
            return_type=return_type,
            value=value
        )
        
        success = self.current_scope.define(symbol)
        if not success:
            self.diagnostics.append(Diagnostic(
                severity="error",
                stage="semantic",
                line=line,
                column=column,
                code="SEM002",
                message=f"Duplicate identifier declaration '{name}' in scope '{self.current_scope.name}'",
                suggestion=f"Rename '{name}' or remove the duplicate declaration."
            ))
            return None
        
        self.all_symbols.append(symbol)
        return symbol

    def lookup(self, name: str, line: int = 1, column: int = 1, report_missing: bool = True) -> Optional[Symbol]:
        sym = self.current_scope.lookup(name)
        if sym is None and report_missing:
            self.diagnostics.append(Diagnostic(
                severity="error",
                stage="semantic",
                line=line,
                column=column,
                code="SEM001",
                message=f"Undeclared identifier '{name}' in scope '{self.current_scope.name}'",
                suggestion=f"Declare '{name}' with 'let {name} : type = ...;' before using it."
            ))
        elif sym is not None:
            sym.is_used = True
        return sym

    def get_symbol_models(self) -> List[SymbolModel]:
        return [s.to_model() for s in self.all_symbols]

    def get_scope_tree(self) -> ScopeTreeModel:
        return self.global_scope.to_tree_model()
