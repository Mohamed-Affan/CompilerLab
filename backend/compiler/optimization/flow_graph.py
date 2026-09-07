from typing import List, Dict
from ..models import FlowGraphModel, FlowGraphEdgeModel, BasicBlockModel


class FlowGraphBuilder:
    @staticmethod
    def build(blocks: List[BasicBlockModel]) -> FlowGraphModel:
        if not blocks:
            return FlowGraphModel(nodes=[], edges=[])

        # Map label names to block id
        label_to_block: Dict[str, str] = {}
        for block in blocks:
            for instr in block.instructions:
                if instr.op == "label" and instr.result:
                    label_to_block[instr.result] = block.id

        edges: List[FlowGraphEdgeModel] = []

        for i, block in enumerate(blocks):
            if not block.instructions:
                continue

            last_instr = block.instructions[-1]

            if last_instr.op == "goto":
                target_label = last_instr.result
                if target_label in label_to_block:
                    target_id = label_to_block[target_label]
                    edges.append(FlowGraphEdgeModel(source=block.id, target=target_id, label="jump"))
                    block.successors.append(target_id)

            elif last_instr.op in ("if_goto", "if_false_goto"):
                target_label = last_instr.result
                if target_label in label_to_block:
                    target_id = label_to_block[target_label]
                    edge_lbl = "branch_false" if last_instr.op == "if_false_goto" else "branch_true"
                    edges.append(FlowGraphEdgeModel(source=block.id, target=target_id, label=edge_lbl))
                    block.successors.append(target_id)
                # Fallthrough to next block
                if i + 1 < len(blocks):
                    next_id = blocks[i + 1].id
                    edges.append(FlowGraphEdgeModel(source=block.id, target=next_id, label="fallthrough"))
                    block.successors.append(next_id)

            elif last_instr.op == "return":
                # Exit block, no successors
                pass

            else:
                # Normal fallthrough to next block
                if i + 1 < len(blocks):
                    next_id = blocks[i + 1].id
                    edges.append(FlowGraphEdgeModel(source=block.id, target=next_id, label="fallthrough"))
                    block.successors.append(next_id)

        # Update predecessors
        for edge in edges:
            for b in blocks:
                if b.id == edge.target and edge.source not in b.predecessors:
                    b.predecessors.append(edge.source)

        return FlowGraphModel(nodes=blocks, edges=edges)
