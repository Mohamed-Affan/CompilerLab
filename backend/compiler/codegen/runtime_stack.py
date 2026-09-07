from typing import List
from ..semantic.symbol_table import SymbolTableManager
from ..models import StackFrameModel, StackFrameSlotModel


class RuntimeStackVisualizer:
    @staticmethod
    def generate_frames(sym_manager: SymbolTableManager) -> List[StackFrameModel]:
        frames: List[StackFrameModel] = []

        # Generate frame for global scope
        global_slots: List[StackFrameSlotModel] = []
        offset = 0
        for sym in sym_manager.all_symbols:
            if sym.scope == "global" and sym.kind == "variable":
                global_slots.append(StackFrameSlotModel(
                    offset=offset,
                    name=sym.name,
                    type_name=sym.type_name,
                    role="global_variable",
                    value=sym.value
                ))
                offset += 4  # Standard 4 bytes per primitive

        frames.append(StackFrameModel(
            function_name="Global Data Segment",
            slots=global_slots,
            frame_size_bytes=offset
        ))

        # Generate frames for each defined function
        for sym in sym_manager.all_symbols:
            if sym.kind == "function":
                fn_name = sym.name
                fn_scope_name = f"func_{fn_name}"
                fn_slots: List[StackFrameSlotModel] = []
                fn_offset = 0

                # Standard activation record layout
                fn_slots.append(StackFrameSlotModel(offset=fn_offset, name="Return Address", type_name="address", role="return_address"))
                fn_offset += 4
                fn_slots.append(StackFrameSlotModel(offset=fn_offset, name="Saved Frame Pointer ($FP)", type_name="address", role="saved_fp"))
                fn_offset += 4

                # Parameters
                for l_sym in sym_manager.all_symbols:
                    if l_sym.scope == fn_scope_name and l_sym.kind == "parameter":
                        fn_slots.append(StackFrameSlotModel(
                            offset=fn_offset,
                            name=f"param: {l_sym.name}",
                            type_name=l_sym.type_name,
                            role="param"
                        ))
                        fn_offset += 4

                # Local variables
                for l_sym in sym_manager.all_symbols:
                    if l_sym.scope == fn_scope_name and l_sym.kind == "variable":
                        fn_slots.append(StackFrameSlotModel(
                            offset=fn_offset,
                            name=f"local: {l_sym.name}",
                            type_name=l_sym.type_name,
                            role="local"
                        ))
                        fn_offset += 4

                frames.append(StackFrameModel(
                    function_name=f"Activation Frame: {fn_name}()",
                    slots=fn_slots,
                    frame_size_bytes=fn_offset
                ))

        return frames
