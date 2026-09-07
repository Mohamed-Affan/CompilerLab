from typing import List, Set
from ..ir.tac import TACInstruction
from ..models import BasicBlockModel


class BasicBlockPartitioner:
    @staticmethod
    def partition(instructions: List[TACInstruction]) -> List[BasicBlockModel]:
        if not instructions:
            return []

        # Find leader indices (0-indexed)
        leaders: Set[int] = {0}

        # Find target labels
        label_to_index = {}
        for idx, instr in enumerate(instructions):
            if instr.op == "label":
                label_to_index[instr.result] = idx

        for idx, instr in enumerate(instructions):
            # Target of jump is a leader
            if instr.op in ("goto", "if_goto", "if_false_goto"):
                target_label = instr.result
                if target_label in label_to_index:
                    leaders.add(label_to_index[target_label])
                # Instruction immediately following a jump is a leader
                if idx + 1 < len(instructions):
                    leaders.add(idx + 1)
            elif instr.op == "return":
                if idx + 1 < len(instructions):
                    leaders.add(idx + 1)

        sorted_leaders = sorted(list(leaders))
        blocks: List[BasicBlockModel] = []

        for i, start_idx in enumerate(sorted_leaders):
            end_idx = sorted_leaders[i + 1] if i + 1 < len(sorted_leaders) else len(instructions)
            block_id = f"B{i + 1}"
            
            block_instrs = []
            for j in range(start_idx, end_idx):
                instr = instructions[j]
                instr.is_leader = (j == start_idx)
                instr.block_id = block_id
                block_instrs.append(instr.to_model())

            blocks.append(BasicBlockModel(
                id=block_id,
                label=f"Block {block_id} [lines {start_idx + 1}-{end_idx}]",
                start_index=start_idx + 1,
                end_index=end_idx,
                instructions=block_instrs
            ))

        return blocks
