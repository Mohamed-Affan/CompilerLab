from dataclasses import dataclass
from typing import List, Optional
from ..models import TargetInstructionModel


@dataclass
class TargetInstruction:
    index: int
    opcode: str  # LOAD, STORE, ADD, SUB, MUL, DIV, CMP, JMP, JMPZ, CALL, RET, PRINT, HALT, LABEL
    operands: List[str]
    comment: Optional[str] = None

    def to_raw(self) -> str:
        if self.opcode == "LABEL":
            return f"{self.operands[0]}:"
        ops_str = ", ".join(self.operands)
        line = f"{self.opcode:<6} {ops_str}"
        if self.comment:
            line = f"{line:<25} ; {self.comment}"
        return line

    def to_model(self) -> TargetInstructionModel:
        return TargetInstructionModel(
            index=self.index,
            opcode=self.opcode,
            operands=self.operands,
            raw=self.to_raw(),
            comment=self.comment
        )
