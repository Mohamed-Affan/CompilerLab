from typing import List
from ..ir.tac import TACInstruction
from ..models import TargetInstructionModel
from .target_machine import TargetInstruction


class TargetCodeGenerator:
    def __init__(self):
        self.instructions: List[TargetInstruction] = []

    def emit(self, opcode: str, operands: List[str], comment: str = None) -> TargetInstruction:
        idx = len(self.instructions) + 1
        instr = TargetInstruction(index=idx, opcode=opcode, operands=operands, comment=comment)
        self.instructions.append(instr)
        return instr

    def generate(self, tac_instructions: List[TACInstruction]) -> List[TargetInstructionModel]:
        self.instructions.clear()

        for instr in tac_instructions:
            if instr.op == "label":
                self.emit("LABEL", [instr.result or ""])
            elif instr.op == "=":
                # x = y or x = 10
                self.emit("LOAD", ["R1", str(instr.arg1)], comment=f"load value of {instr.arg1}")
                self.emit("STORE", [str(instr.result), "R1"], comment=f"store to {instr.result}")
            elif instr.op in ("+", "-", "*", "/", "%"):
                self.emit("LOAD", ["R1", str(instr.arg1)], comment=f"load left operand")
                op_map = {"+": "ADD", "-": "SUB", "*": "MUL", "/": "DIV", "%": "MOD"}
                opcode = op_map.get(instr.op, "ADD")
                self.emit(opcode, ["R1", str(instr.arg2)], comment=f"compute {instr.arg1} {instr.op} {instr.arg2}")
                self.emit("STORE", [str(instr.result), "R1"], comment=f"store result in {instr.result}")
            elif instr.op in ("==", "!=", "<", "<=", ">", ">="):
                self.emit("LOAD", ["R1", str(instr.arg1)])
                self.emit("CMP", ["R1", str(instr.arg2)], comment=f"compare {instr.arg1} with {instr.arg2}")
                self.emit("STORE", [str(instr.result), "R1"])
            elif instr.op == "goto":
                self.emit("JMP", [str(instr.result)], comment="unconditional jump")
            elif instr.op == "if_false_goto":
                self.emit("LOAD", ["R1", str(instr.arg1)], comment=f"check condition {instr.arg1}")
                self.emit("JMPZ", ["R1", str(instr.result)], comment=f"jump if zero/false to {instr.result}")
            elif instr.op == "if_goto":
                self.emit("LOAD", ["R1", str(instr.arg1)])
                self.emit("JMPNZ", ["R1", str(instr.result)])
            elif instr.op == "param":
                self.emit("PUSH", [str(instr.arg1)], comment="push argument")
            elif instr.op == "call":
                self.emit("CALL", [str(instr.arg1)], comment=f"call subroutine with {instr.arg2} args")
                if instr.result:
                    self.emit("STORE", [str(instr.result), "R0"], comment="store return value from R0")
            elif instr.op == "return":
                if instr.arg1:
                    self.emit("LOAD", ["R0", str(instr.arg1)], comment="set return register R0")
                self.emit("RET", [], comment="return from function")
            elif instr.op == "print":
                self.emit("LOAD", ["R1", str(instr.arg1)])
                self.emit("PRINT", ["R1"], comment="output value")
            elif instr.op == "cast":
                self.emit("LOAD", ["R1", str(instr.arg2)])
                self.emit("CAST", ["R1", str(instr.arg1)], comment=f"convert to {instr.arg1}")
                self.emit("STORE", [str(instr.result), "R1"])

        # Append final HALT
        self.emit("HALT", [], comment="end of program")

        return [instr.to_model() for instr in self.instructions]
