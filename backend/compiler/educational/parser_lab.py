from typing import List, Dict, Any


class ParserLabSimulators:
    @staticmethod
    def simulate_shift_reduce(input_expr: str = "id + id * id") -> Dict[str, Any]:
        """
        Simulates Shift-Reduce parsing for grammar:
        E -> E + T | T
        T -> T * F | F
        F -> ( E ) | id
        """
        tokens = input_expr.strip().split()
        tokens.append("$")
        
        stack = ["$"]
        steps = []
        step_num = 1
        pos = 0

        while pos < len(tokens):
            curr_input = " ".join(tokens[pos:])
            stack_str = " ".join(stack)

            # Check reduction conditions
            # 1. Reduce 'id' to F
            if stack and stack[-1] == "id":
                action = "REDUCE F -> id"
                steps.append({"step": step_num, "stack": stack_str, "input": curr_input, "action": action})
                stack[-1] = "F"
                step_num += 1
                continue

            # 2. Reduce 'T * F' to T
            if len(stack) >= 3 and stack[-3:] == ["T", "*", "F"]:
                action = "REDUCE T -> T * F"
                steps.append({"step": step_num, "stack": stack_str, "input": curr_input, "action": action})
                stack = stack[:-3] + ["T"]
                step_num += 1
                continue

            # 3. Reduce 'F' to T (only if next token is not '*')
            if stack and stack[-1] == "F" and (pos >= len(tokens) or tokens[pos] != "*"):
                action = "REDUCE T -> F"
                steps.append({"step": step_num, "stack": stack_str, "input": curr_input, "action": action})
                stack[-1] = "T"
                step_num += 1
                continue

            # 4. Reduce 'E + T' to E (only if next token is not '*')
            if len(stack) >= 3 and stack[-3:] == ["E", "+", "T"] and (pos >= len(tokens) or tokens[pos] != "*"):
                action = "REDUCE E -> E + T"
                steps.append({"step": step_num, "stack": stack_str, "input": curr_input, "action": action})
                stack = stack[:-3] + ["E"]
                step_num += 1
                continue

            # 5. Reduce 'T' to E (only if next token is '+' or '$')
            if stack and stack[-1] == "T" and len(stack) == 2 and (pos >= len(tokens) or tokens[pos] in ("+", "$")):
                action = "REDUCE E -> T"
                steps.append({"step": step_num, "stack": stack_str, "input": curr_input, "action": action})
                stack[-1] = "E"
                step_num += 1
                continue

            # 6. Accept condition
            if stack == ["$", "E"] and tokens[pos] == "$":
                steps.append({"step": step_num, "stack": "$ E", "input": "$", "action": "ACCEPT (Successful Parse)"})
                break

            # 7. Shift next token
            if pos < len(tokens):
                tok = tokens[pos]
                if tok == "$":
                    action = "ERROR: Unexpected end of input"
                    steps.append({"step": step_num, "stack": stack_str, "input": curr_input, "action": action})
                    break
                action = f"SHIFT '{tok}'"
                steps.append({"step": step_num, "stack": stack_str, "input": curr_input, "action": action})
                stack.append(tok)
                pos += 1
                step_num += 1
            else:
                break

        return {
            "strategy": "Shift-Reduce Bottom-Up Parser",
            "grammar": [
                "E -> E + T | T",
                "T -> T * F | F",
                "F -> ( E ) | id"
            ],
            "input": input_expr,
            "steps": steps
        }

    @staticmethod
    def simulate_ll1_predictive(input_expr: str = "id + id") -> Dict[str, Any]:
        """
        Simulates LL(1) Predictive Parsing for non-left-recursive grammar:
        E  -> T E'
        E' -> + T E' | ε
        T  -> F T'
        T' -> * F T' | ε
        F  -> ( E ) | id
        """
        table = {
            ("E", "id"): "T E'",
            ("E", "("): "T E'",
            ("E'", "+"): "+ T E'",
            ("E'", ")"): "ε",
            ("E'", "$"): "ε",
            ("T", "id"): "F T'",
            ("T", "("): "F T'",
            ("T'", "+"): "ε",
            ("T'", "*"): "* F T'",
            ("T'", ")"): "ε",
            ("T'", "$"): "ε",
            ("F", "id"): "id",
            ("F", "("): "( E )"
        }

        tokens = input_expr.strip().split() + ["$"]
        stack = ["$", "E"]
        steps = []
        step_num = 1
        pos = 0

        while len(stack) > 0 and pos < len(tokens):
            top = stack[-1]
            curr_tok = tokens[pos]
            stack_str = " ".join(stack)
            input_str = " ".join(tokens[pos:])

            if top == "$" and curr_tok == "$":
                steps.append({"step": step_num, "stack": stack_str, "input": input_str, "action": "ACCEPT"})
                break

            if top == curr_tok:
                # Terminal match
                steps.append({"step": step_num, "stack": stack_str, "input": input_str, "action": f"MATCH '{curr_tok}'"})
                stack.pop()
                pos += 1
                step_num += 1
                continue

            # Non-terminal expansion from table
            key = (top, curr_tok)
            if key in table:
                prod = table[key]
                action = f"OUTPUT {top} -> {prod}"
                steps.append({"step": step_num, "stack": stack_str, "input": input_str, "action": action})
                stack.pop()
                if prod != "ε":
                    symbols = prod.split()
                    for sym in reversed(symbols):
                        stack.append(sym)
                step_num += 1
            else:
                steps.append({"step": step_num, "stack": stack_str, "input": input_str, "action": f"SYNTAX ERROR at '{curr_tok}'"})
                break

        return {
            "strategy": "LL(1) Predictive Top-Down Parser",
            "parsing_table": [
                {"non_terminal": "E", "id": "T E'", "+": "", "*": "", "(": "T E'", ")": "", "$": ""},
                {"non_terminal": "E'", "id": "", "+": "+ T E'", "*": "", "(": "", ")": "ε", "$": "ε"},
                {"non_terminal": "T", "id": "F T'", "+": "", "*": "", "(": "F T'", ")": "", "$": ""},
                {"non_terminal": "T'", "id": "", "+": "ε", "*": "* F T'", "(": "", ")": "ε", "$": "ε"},
                {"non_terminal": "F", "id": "id", "+": "", "*": "", "(": "( E )", ")": "", "$": ""},
            ],
            "input": input_expr,
            "steps": steps
        }

    @staticmethod
    def simulate_slr1(input_expr: str = "id + id") -> Dict[str, Any]:
        """
        Simulates SLR(1) LR-parsing with states:
        0: I0, 1: I1, etc.
        """
        slr_table = [
            {"state": 0, "id": "s5", "+": "", "*": "", "(": "s4", ")": "", "$": "", "E": "1", "T": "2", "F": "3"},
            {"state": 1, "id": "", "+": "s6", "*": "", "(": "", ")": "", "$": "acc", "E": "", "T": "", "F": ""},
            {"state": 2, "id": "", "+": "r2", "*": "s7", "(": "", ")": "r2", "$": "r2", "E": "", "T": "", "F": ""},
            {"state": 3, "id": "", "+": "r4", "*": "r4", "(": "", ")": "r4", "$": "r4", "E": "", "T": "", "F": ""},
            {"state": 4, "id": "s5", "+": "", "*": "", "(": "s4", ")": "", "$": "", "E": "8", "T": "2", "F": "3"},
            {"state": 5, "id": "", "+": "r6", "*": "r6", "(": "", ")": "r6", "$": "r6", "E": "", "T": "", "F": ""},
            {"state": 6, "id": "s5", "+": "", "*": "", "(": "s4", ")": "", "$": "", "E": "", "T": "9", "F": "3"},
            {"state": 7, "id": "s5", "+": "", "*": "", "(": "s4", ")": "", "$": "", "E": "", "T": "", "F": "10"},
            {"state": 8, "id": "", "+": "s6", "*": "", "(": "", ")": "s11", "$": "", "E": "", "T": "", "F": ""},
            {"state": 9, "id": "", "+": "r1", "*": "s7", "(": "", ")": "r1", "$": "r1", "E": "", "T": "", "F": ""},
            {"state": 10, "id": "", "+": "r3", "*": "r3", "(": "", ")": "r3", "$": "r3", "E": "", "T": "", "F": ""},
            {"state": 11, "id": "", "+": "r5", "*": "r5", "(": "", ")": "r5", "$": "r5", "E": "", "T": "", "F": ""},
        ]
        
        # Simple trace demonstration
        tokens = input_expr.strip().split() + ["$"]
        state_stack = [0]
        symbol_stack = ["$"]
        steps = []
        step_num = 1
        pos = 0

        rules = {
            1: ("E", 3, "E -> E + T"),
            2: ("E", 1, "E -> T"),
            3: ("T", 3, "T -> T * F"),
            4: ("T", 1, "T -> F"),
            5: ("F", 3, "F -> ( E )"),
            6: ("F", 1, "F -> id")
        }

        while pos < len(tokens):
            curr_state = state_stack[-1]
            curr_tok = tokens[pos]
            input_str = " ".join(tokens[pos:])
            stack_repr = " ".join(f"{s}{sym}" for s, sym in zip(state_stack, symbol_stack))

            state_row = next((r for r in slr_table if r["state"] == curr_state), None)
            if not state_row:
                break

            action = state_row.get(curr_tok, "")
            if not action:
                steps.append({"step": step_num, "stack": stack_repr, "input": input_str, "action": f"ERROR at token '{curr_tok}'"})
                break

            if action == "acc":
                steps.append({"step": step_num, "stack": stack_repr, "input": input_str, "action": "ACCEPT"})
                break
            elif action.startswith("s"):
                next_st = int(action[1:])
                steps.append({"step": step_num, "stack": stack_repr, "input": input_str, "action": f"SHIFT {curr_tok} to State {next_st}"})
                symbol_stack.append(curr_tok)
                state_stack.append(next_st)
                pos += 1
                step_num += 1
            elif action.startswith("r"):
                rule_idx = int(action[1:])
                lhs, pop_count, rule_str = rules[rule_idx]
                steps.append({"step": step_num, "stack": stack_repr, "input": input_str, "action": f"REDUCE by {rule_str}"})
                
                # Pop state and symbols
                for _ in range(pop_count):
                    if len(state_stack) > 1:
                        state_stack.pop()
                    if len(symbol_stack) > 1:
                        symbol_stack.pop()

                top_st = state_stack[-1]
                goto_row = next((r for r in slr_table if r["state"] == top_st), None)
                next_goto = int(goto_row.get(lhs, "0"))
                symbol_stack.append(lhs)
                state_stack.append(next_goto)
                step_num += 1

        return {
            "strategy": "SLR(1) Bottom-Up LR Parser",
            "slr_table": slr_table,
            "input": input_expr,
            "steps": steps
        }
