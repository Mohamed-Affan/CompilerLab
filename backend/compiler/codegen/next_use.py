from typing import List, Dict, Optional
from ..ir.tac import TACInstruction
from ..models import NextUseEntryModel


class NextUseAnalyzer:
    @staticmethod
    def analyze(instructions: List[TACInstruction]) -> List[NextUseEntryModel]:
        """
        Analyzes variable next-use information backwards through the instruction sequence.
        Produces next-use and liveness entries for variables referenced in each TAC instruction.
        """
        table: List[NextUseEntryModel] = []
        
        # Track next use line for each variable/temp
        next_use_map: Dict[str, int] = {}

        def is_variable_name(name: Optional[str]) -> bool:
            if not name:
                return False
            if name.startswith('"') or name.startswith("'"):
                return False
            if name in ("true", "false", "void"):
                return False
            try:
                float(name)
                return False
            except ValueError:
                pass
            return name.isidentifier()

        # Scan backwards to compute live ranges and next-use line
        for idx in range(len(instructions) - 1, -1, -1):
            instr = instructions[idx]
            line_no = idx + 1
            raw_text = instr.to_raw()

            # Record for variables defined in this instruction
            if is_variable_name(instr.result) and instr.op not in ("label", "goto", "if_goto", "if_false_goto"):
                var = instr.result
                next_line = next_use_map.get(var)
                table.append(NextUseEntryModel(
                    instruction_index=line_no,
                    instruction_raw=raw_text,
                    variable=var,
                    next_use_line=next_line,
                    is_live=next_line is not None
                ))
                # Variable defined here: prior uses before this def are dead across redefinition
                if var in next_use_map:
                    del next_use_map[var]

            # Record for variables read in this instruction
            if is_variable_name(instr.arg1) and instr.op != "cast":
                var = instr.arg1
                next_line = next_use_map.get(var)
                table.append(NextUseEntryModel(
                    instruction_index=line_no,
                    instruction_raw=raw_text,
                    variable=var,
                    next_use_line=next_line,
                    is_live=next_line is not None
                ))
                next_use_map[var] = line_no

            if is_variable_name(instr.arg2):
                var = instr.arg2
                next_line = next_use_map.get(var)
                table.append(NextUseEntryModel(
                    instruction_index=line_no,
                    instruction_raw=raw_text,
                    variable=var,
                    next_use_line=next_line,
                    is_live=next_line is not None
                ))
                next_use_map[var] = line_no

        # Reverse to return in forward instruction order
        table.reverse()
        return table
