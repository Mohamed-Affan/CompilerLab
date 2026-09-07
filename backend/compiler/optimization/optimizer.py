import copy
from typing import List, Tuple, Dict, Any, Optional
from ..ir.tac import TACInstruction
from ..models import OptimizationPassModel, OptimizationReportModel, TACInstructionModel


class Optimizer:
    def __init__(self, instructions: List[TACInstruction]):
        self.original_instructions = instructions
        self.current_instructions = copy.deepcopy(instructions)
        self.passes_applied: List[OptimizationPassModel] = []
        self.counts_by_type: Dict[str, int] = {
            "Constant Folding": 0,
            "Algebraic Simplification": 0,
            "Constant Propagation": 0,
            "Dead Code Elimination": 0,
            "Peephole": 0,
        }

    def is_number(self, s: Optional[str]) -> bool:
        if s is None:
            return False
        try:
            float(s)
            return True
        except ValueError:
            return False

    def parse_number(self, s: str) -> Tuple[bool, Any]:
        try:
            if '.' in s:
                return True, float(s)
            return True, int(s)
        except ValueError:
            return False, None

    def optimize(self) -> OptimizationReportModel:
        # Multi-pass optimization until convergence or max iterations
        max_iterations = 5
        for _ in range(max_iterations):
            changed = False
            
            # Pass 1: Constant Folding
            cf_changed = self.pass_constant_folding()
            if cf_changed:
                changed = True

            # Pass 2: Algebraic Simplification
            as_changed = self.pass_algebraic_simplification()
            if as_changed:
                changed = True

            # Pass 3: Constant Propagation
            cp_changed = self.pass_constant_propagation()
            if cp_changed:
                changed = True

            # Pass 4: Dead Code Elimination
            dce_changed = self.pass_dead_code_elimination()
            if dce_changed:
                changed = True

            if not changed:
                break

        # Re-index remaining instructions
        for idx, instr in enumerate(self.current_instructions):
            instr.index = idx + 1

        before_count = len(self.original_instructions)
        after_count = len(self.current_instructions)
        reduction_pct = 0.0
        if before_count > 0:
            reduction_pct = round(((before_count - after_count) / before_count) * 100.0, 2)

        return OptimizationReportModel(
            passes_applied=self.passes_applied,
            counts_by_type=self.counts_by_type,
            instructions_before=before_count,
            instructions_after=after_count,
            reduction_percentage=reduction_pct,
            optimized_tac=[i.to_model() for i in self.current_instructions]
        )

    def pass_constant_folding(self) -> bool:
        changed = False
        new_instrs = []

        for instr in self.current_instructions:
            if instr.op in ("+", "-", "*", "/", "%") and instr.arg1 and instr.arg2 and self.is_number(instr.arg1) and self.is_number(instr.arg2):
                ok1, v1 = self.parse_number(instr.arg1)
                ok2, v2 = self.parse_number(instr.arg2)
                if ok1 and ok2:
                    val = None
                    try:
                        if instr.op == "+":
                            val = v1 + v2
                        elif instr.op == "-":
                            val = v1 - v2
                        elif instr.op == "*":
                            val = v1 * v2
                        elif instr.op == "/":
                            if v2 != 0:
                                val = v1 / v2 if isinstance(v1, float) or isinstance(v2, float) else v1 // v2
                        elif instr.op == "%":
                            if v2 != 0:
                                val = v1 % v2
                    except ZeroDivisionError:
                        val = None

                    if val is not None:
                        before_str = instr.to_raw()
                        # Replace with assignment of folded constant
                        instr.op = "="
                        instr.arg1 = str(val)
                        instr.arg2 = None
                        after_str = instr.to_raw()
                        
                        self.passes_applied.append(OptimizationPassModel(
                            pass_type="Constant Folding",
                            description=f"Folded constant expression '{v1} {instr.op} {v2}' into '{val}'",
                            line_affected=instr.index,
                            before=before_str,
                            after=after_str
                        ))
                        self.counts_by_type["Constant Folding"] += 1
                        changed = True

            new_instrs.append(instr)

        self.current_instructions = new_instrs
        return changed

    def pass_algebraic_simplification(self) -> bool:
        changed = False
        new_instrs = []

        for instr in self.current_instructions:
            before_str = instr.to_raw()
            applied = False

            # x + 0 -> x
            if instr.op == "+" and instr.arg2 in ("0", "0.0"):
                instr.op = "="
                instr.arg2 = None
                applied = True
            # 0 + x -> x
            elif instr.op == "+" and instr.arg1 in ("0", "0.0"):
                instr.op = "="
                instr.arg1 = instr.arg2
                instr.arg2 = None
                applied = True
            # x - 0 -> x
            elif instr.op == "-" and instr.arg2 in ("0", "0.0"):
                instr.op = "="
                instr.arg2 = None
                applied = True
            # x * 1 -> x
            elif instr.op == "*" and instr.arg2 in ("1", "1.0"):
                instr.op = "="
                instr.arg2 = None
                applied = True
            # 1 * x -> x
            elif instr.op == "*" and instr.arg1 in ("1", "1.0"):
                instr.op = "="
                instr.arg1 = instr.arg2
                instr.arg2 = None
                applied = True
            # x / 1 -> x
            elif instr.op == "/" and instr.arg2 in ("1", "1.0"):
                instr.op = "="
                instr.arg2 = None
                applied = True
            # x * 0 -> 0
            elif instr.op == "*" and (instr.arg1 in ("0", "0.0") or instr.arg2 in ("0", "0.0")):
                instr.op = "="
                instr.arg1 = "0"
                instr.arg2 = None
                applied = True

            if applied:
                after_str = instr.to_raw()
                self.passes_applied.append(OptimizationPassModel(
                    pass_type="Algebraic Simplification",
                    description=f"Simplified algebraic identity: '{before_str}' -> '{after_str}'",
                    line_affected=instr.index,
                    before=before_str,
                    after=after_str
                ))
                self.counts_by_type["Algebraic Simplification"] += 1
                changed = True

            new_instrs.append(instr)

        self.current_instructions = new_instrs
        return changed

    def pass_constant_propagation(self) -> bool:
        changed = False
        const_map: Dict[str, str] = {}
        new_instrs = []

        for instr in self.current_instructions:
            # If target of branch / label / call, invalidate map
            if instr.op in ("label", "call", "goto", "if_goto", "if_false_goto"):
                const_map.clear()
                new_instrs.append(instr)
                continue

            before_str = instr.to_raw()
            modified = False

            # Replace arg1 if known constant
            if instr.arg1 and instr.arg1 in const_map and instr.op not in ("call", "cast"):
                instr.arg1 = const_map[instr.arg1]
                modified = True

            # Replace arg2 if known constant
            if instr.arg2 and instr.arg2 in const_map:
                instr.arg2 = const_map[instr.arg2]
                modified = True

            # If this is a constant assignment (e.g. x = 10 or t1 = 20), record it
            if instr.op == "=" and instr.arg1 and (self.is_number(instr.arg1) or instr.arg1 in ("true", "false", '""')):
                if instr.result:
                    const_map[instr.result] = instr.arg1
            elif instr.result and instr.result in const_map:
                # Variable was reassigned to a non-constant
                del const_map[instr.result]

            if modified:
                after_str = instr.to_raw()
                self.passes_applied.append(OptimizationPassModel(
                    pass_type="Constant Propagation",
                    description=f"Propagated constant value into instruction: '{before_str}' -> '{after_str}'",
                    line_affected=instr.index,
                    before=before_str,
                    after=after_str
                ))
                self.counts_by_type["Constant Propagation"] += 1
                changed = True

            new_instrs.append(instr)

        self.current_instructions = new_instrs
        return changed

    def pass_dead_code_elimination(self) -> bool:
        changed = False
        # Find which temps are actually read
        used_symbols = set()
        for instr in self.current_instructions:
            if instr.arg1:
                used_symbols.add(instr.arg1)
            if instr.arg2:
                used_symbols.add(instr.arg2)

        new_instrs = []
        for instr in self.current_instructions:
            # If instruction defines a temporary 'tX' that is never used later and has no side-effects
            if instr.result and instr.result.startswith("t") and instr.result not in used_symbols and instr.op not in ("call", "print"):
                before_str = instr.to_raw()
                self.passes_applied.append(OptimizationPassModel(
                    pass_type="Dead Code Elimination",
                    description=f"Eliminated unused temporary variable assignment: '{before_str}'",
                    line_affected=instr.index,
                    before=before_str,
                    after="[REMOVED]"
                ))
                self.counts_by_type["Dead Code Elimination"] += 1
                changed = True
            else:
                new_instrs.append(instr)

        self.current_instructions = new_instrs
        return changed
