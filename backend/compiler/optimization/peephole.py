from typing import List
from ..ir.tac import TACInstruction
from ..models import OptimizationPassModel


class PeepholeOptimizer:
    @staticmethod
    def optimize_window(instructions: List[TACInstruction], passes_log: List[OptimizationPassModel]) -> List[TACInstruction]:
        if not instructions:
            return []

        result = []
        i = 0
        while i < len(instructions):
            curr = instructions[i]
            
            # Pattern: goto L_next followed immediately by L_next:
            if curr.op == "goto" and i + 1 < len(instructions):
                nxt = instructions[i + 1]
                if nxt.op == "label" and nxt.result == curr.result:
                    passes_log.append(OptimizationPassModel(
                        pass_type="Peephole",
                        description=f"Eliminated redundant jump to immediately following label '{curr.result}'",
                        line_affected=curr.index,
                        before=curr.to_raw(),
                        after="[REMOVED]"
                    ))
                    i += 1  # Skip the redundant goto
                    continue

            result.append(curr)
            i += 1

        return result
