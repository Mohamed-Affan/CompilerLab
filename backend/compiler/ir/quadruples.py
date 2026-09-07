from typing import List
from ..models import QuadrupleModel, TripleModel
from .tac import TACInstruction


class QuadrupleBuilder:
    @staticmethod
    def build(instructions: List[TACInstruction]) -> List[QuadrupleModel]:
        quads: List[QuadrupleModel] = []
        for idx, instr in enumerate(instructions):
            quads.append(QuadrupleModel(
                index=idx + 1,
                op=instr.op,
                arg1=str(instr.arg1) if instr.arg1 is not None else "-",
                arg2=str(instr.arg2) if instr.arg2 is not None else "-",
                result=str(instr.result) if instr.result is not None else "-"
            ))
        return quads


class TripleBuilder:
    @staticmethod
    def build(instructions: List[TACInstruction]) -> List[TripleModel]:
        triples: List[TripleModel] = []
        # Mapping from temporary variable names (e.g. t1, t2) to previous triple indices (e.g. (1), (2))
        temp_to_triple: dict[str, str] = {}

        for idx, instr in enumerate(instructions):
            triple_idx = f"({idx + 1})"

            # Resolve args if they reference earlier temps
            arg1 = str(instr.arg1) if instr.arg1 is not None else "-"
            if arg1 in temp_to_triple:
                arg1 = temp_to_triple[arg1]

            arg2 = str(instr.arg2) if instr.arg2 is not None else "-"
            if arg2 in temp_to_triple:
                arg2 = temp_to_triple[arg2]

            triples.append(TripleModel(
                index=idx + 1,
                op=instr.op,
                arg1=arg1,
                arg2=arg2
            ))

            if instr.result and instr.result.startswith("t"):
                temp_to_triple[instr.result] = triple_idx

        return triples
