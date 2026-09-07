"""
SimpleLang Context-Free Grammar (CFG) Specification
Course: CSA1405 Compiler Design (Unit II)
"""

GRAMMAR_SPEC = {
    "name": "SimpleLang Context-Free Grammar",
    "version": "1.0",
    "terminals": [
        "LET", "FUNCTION", "RETURN", "IF", "ELSE", "WHILE", "PRINT",
        "INT_TO_FLOAT", "FLOAT_TO_INT", "TYPE_INT", "TYPE_FLOAT", "TYPE_STRING", "TYPE_BOOL",
        "LITERAL_INT", "LITERAL_FLOAT", "LITERAL_STRING", "LITERAL_BOOL", "IDENTIFIER",
        "+", "-", "*", "/", "%", "==", "!=", "<", "<=", ">", ">=", "&&", "||", "!",
        "=", ";", ":", ",", "(", ")", "{", "}"
    ],
    "non_terminals": [
        "Program", "StatementList", "Statement", "Declaration", "Assignment",
        "IfStatement", "WhileStatement", "FunctionDeclaration", "ParamList", "Param",
        "ReturnStatement", "PrintStatement", "Expression", "LogicalOr", "LogicalAnd",
        "Equality", "Relational", "Additive", "Multiplicative", "Unary", "Primary", "Type"
    ],
    "start_symbol": "Program",
    "productions": [
        {"lhs": "Program", "rhs": ["StatementList"]},
        {"lhs": "StatementList", "rhs": ["Statement StatementList", "ε"]},
        {"lhs": "Statement", "rhs": [
            "Declaration", "Assignment", "IfStatement", "WhileStatement",
            "FunctionDeclaration", "ReturnStatement", "PrintStatement", "ExpressionStatement"
        ]},
        {"lhs": "Declaration", "rhs": ["let Identifier : Type = Expression ;"]},
        {"lhs": "Assignment", "rhs": ["Identifier = Expression ;"]},
        {"lhs": "IfStatement", "rhs": ["if ( Expression ) Block [ else Block ]"]},
        {"lhs": "WhileStatement", "rhs": ["while ( Expression ) Block"]},
        {"lhs": "Block", "rhs": ["{ StatementList }"]},
        {"lhs": "FunctionDeclaration", "rhs": ["function Identifier ( [ ParamList ] ) : Type Block"]},
        {"lhs": "ParamList", "rhs": ["Param [ , ParamList ]"]},
        {"lhs": "Param", "rhs": ["Identifier : Type"]},
        {"lhs": "ReturnStatement", "rhs": ["return [ Expression ] ;"]},
        {"lhs": "PrintStatement", "rhs": ["print ( Expression ) ;"]},
        {"lhs": "Expression", "rhs": ["LogicalOr"]},
        {"lhs": "LogicalOr", "rhs": ["LogicalAnd { '||' LogicalAnd }"]},
        {"lhs": "LogicalAnd", "rhs": ["Equality { '&&' Equality }"]},
        {"lhs": "Equality", "rhs": ["Relational { ('==' | '!=') Relational }"]},
        {"lhs": "Relational", "rhs": ["Additive { ('<' | '<=' | '>' | '>=') Additive }"]},
        {"lhs": "Additive", "rhs": ["Multiplicative { ('+' | '-') Multiplicative }"]},
        {"lhs": "Multiplicative", "rhs": ["Unary { ('*' | '/' | '%') Unary }"]},
        {"lhs": "Unary", "rhs": ["('!' | '-') Unary", "Primary"]},
        {"lhs": "Primary", "rhs": [
            "Literal", "Identifier", "FunctionCall", "TypeConversion", "( Expression )"
        ]},
        {"lhs": "Type", "rhs": ["int", "float", "string", "bool"]}
    ]
}
