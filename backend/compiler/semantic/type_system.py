from typing import Dict, Tuple, Optional, Any, List


class TypeSystem:
    PRIMITIVES = {"int", "float", "string", "bool", "void"}

    # Binary operations compatibility: (type_left, op, type_right) -> result_type
    BIN_OP_RULES: Dict[Tuple[str, str, str], str] = {
        # Arithmetic: int
        ("int", "+", "int"): "int",
        ("int", "-", "int"): "int",
        ("int", "*", "int"): "int",
        ("int", "/", "int"): "int",
        ("int", "%", "int"): "int",

        # Arithmetic: float
        ("float", "+", "float"): "float",
        ("float", "-", "float"): "float",
        ("float", "*", "float"): "float",
        ("float", "/", "float"): "float",
        
        # String concatenation
        ("string", "+", "string"): "string",

        # Relational: int
        ("int", "==", "int"): "bool",
        ("int", "!=", "int"): "bool",
        ("int", "<", "int"): "bool",
        ("int", "<=", "int"): "bool",
        ("int", ">", "int"): "bool",
        ("int", ">=", "int"): "bool",

        # Relational: float
        ("float", "==", "float"): "bool",
        ("float", "!=", "float"): "bool",
        ("float", "<", "float"): "bool",
        ("float", "<=", "float"): "bool",
        ("float", ">", "float"): "bool",
        ("float", ">=", "float"): "bool",

        # Relational: string
        ("string", "==", "string"): "bool",
        ("string", "!=", "string"): "bool",

        # Relational: bool
        ("bool", "==", "bool"): "bool",
        ("bool", "!=", "bool"): "bool",

        # Logical
        ("bool", "&&", "bool"): "bool",
        ("bool", "||", "bool"): "bool",
    }

    UNARY_OP_RULES: Dict[Tuple[str, str], str] = {
        ("!", "bool"): "bool",
        ("-", "int"): "int",
        ("-", "float"): "float",
    }

    # Compatibility matrix for the Type System Explorer UI
    @classmethod
    def get_compatibility_matrix(cls) -> Dict[str, Any]:
        types = ["int", "float", "string", "bool"]
        matrix = []
        for t1 in types:
            row = {"type": t1}
            for t2 in types:
                plus_res = cls.check_binary_op(t1, "+", t2)
                eq_res = cls.check_binary_op(t1, "==", t2)
                and_res = cls.check_binary_op(t1, "&&", t2)
                row[t2] = {
                    "can_add": plus_res is not None,
                    "add_type": plus_res,
                    "can_compare": eq_res is not None,
                    "can_logical": and_res is not None,
                    "assignable": t1 == t2
                }
            matrix.append(row)
        return {
            "types": types,
            "matrix": matrix,
            "explicit_conversions": [
                {"from": "int", "to": "float", "function": "intToFloat(val)", "description": "Converts integer value to single-precision float."},
                {"from": "float", "to": "int", "function": "floatToInt(val)", "description": "Truncates floating-point value to integer."}
            ]
        }

    @classmethod
    def is_valid_type(cls, type_name: str) -> bool:
        return type_name in cls.PRIMITIVES

    @classmethod
    def check_binary_op(cls, left: str, op: str, right: str) -> Optional[str]:
        return cls.BIN_OP_RULES.get((left, op, right))

    @classmethod
    def check_unary_op(cls, op: str, operand: str) -> Optional[str]:
        return cls.UNARY_OP_RULES.get((op, operand))

    @classmethod
    def is_assignable(cls, target_type: str, source_type: str) -> bool:
        """Strict assignment compatibility in SimpleLang."""
        return target_type == source_type
