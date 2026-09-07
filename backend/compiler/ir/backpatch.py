from typing import List, Dict, Any
from ..models import BackpatchRecordModel
from .tac import TACInstruction


class BackpatchAnalyzer:
    @staticmethod
    def analyze(instructions: List[TACInstruction]) -> List[BackpatchRecordModel]:
        records: List[BackpatchRecordModel] = []
        
        # Analyze jump instructions
        for idx, instr in enumerate(instructions):
            if instr.op == "if_false_goto":
                rec_id = f"BP_{idx + 1}"
                target_label = instr.result
                
                # Find instruction line corresponding to label target
                target_line = None
                for tidx, tinstr in enumerate(instructions):
                    if tinstr.op == "label" and tinstr.result == target_label:
                        target_line = tidx + 1
                        break
                
                records.append(BackpatchRecordModel(
                    id=rec_id,
                    condition_expr=f"ifFalse {instr.arg1}",
                    true_list=[idx + 2],  # fallthrough line
                    false_list=[target_line or (idx + 1)],
                    next_list=[target_line or (idx + 1)],
                    resolved_true=f"Line {idx + 2} (Fallthrough)",
                    resolved_false=f"{target_label} (Line {target_line})" if target_line else target_label
                ))
            elif instr.op == "goto":
                rec_id = f"BP_GOTO_{idx + 1}"
                target_label = instr.result
                target_line = None
                for tidx, tinstr in enumerate(instructions):
                    if tinstr.op == "label" and tinstr.result == target_label:
                        target_line = tidx + 1
                        break
                
                records.append(BackpatchRecordModel(
                    id=rec_id,
                    condition_expr=f"Unconditional jump to {target_label}",
                    true_list=[],
                    false_list=[],
                    next_list=[target_line or (idx + 1)],
                    resolved_true=None,
                    resolved_false=None
                ))

        return records
