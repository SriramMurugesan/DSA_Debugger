import ast
from typing import List

class ASTValidator(ast.NodeVisitor):
    """Parses AST to reject malicious or unsupported operations."""
    def __init__(self):
        self.errors = []
        
    def visit_Import(self, node):
        self.errors.append(f"Line {node.lineno}: import statements are not allowed for security reasons.")
        self.generic_visit(node)
        
    def visit_ImportFrom(self, node):
        self.errors.append(f"Line {node.lineno}: import statements are not allowed for security reasons.")
        self.generic_visit(node)
        
    def visit_Call(self, node):
        if isinstance(node.func, ast.Name):
            if node.func.id in ['eval', 'exec', 'compile', 'open', '__import__']:
                self.errors.append(f"Line {node.lineno}: function '{node.func.id}' is blocked for security reasons.")
        self.generic_visit(node)

def validate_code(code: str) -> List[str]:
    """Returns a list of validation errors, or empty list if valid."""
    try:
        tree = ast.parse(code)
    except SyntaxError as e:
        return [f"SyntaxError at line {e.lineno}: {e.msg}"]
        
    validator = ASTValidator()
    validator.visit(tree)
    return validator.errors
