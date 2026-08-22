import json
from sqlalchemy.orm import Session
from app.db.models import SessionLocal, Category, Problem, engine, Base

CATEGORIES = [
    {"slug": "arrays-hashing", "name": "Arrays & Hashing", "desc": "Fundamentals of arrays and hash maps."},
    {"slug": "two-pointers", "name": "Two Pointers", "desc": "Solving problems with two moving indices."},
    {"slug": "sliding-window", "name": "Sliding Window", "desc": "Fixed and variable window techniques."},
    {"slug": "stack", "name": "Stack", "desc": "LIFO structures and monotonic stacks."},
    {"slug": "binary-search", "name": "Binary Search", "desc": "Logarithmic time search algorithms."},
    {"slug": "linked-list", "name": "Linked List", "desc": "Node-based sequential data structures."},
    {"slug": "trees", "name": "Trees / Binary Trees", "desc": "Hierarchical structures and traversals."},
    {"slug": "trie", "name": "Tries", "desc": "Prefix trees for string matching."},
    {"slug": "backtracking", "name": "Backtracking", "desc": "Exhaustive search and pruning."},
    {"slug": "graphs", "name": "Graphs", "desc": "Nodes, edges, and basic traversals (BFS/DFS)."},
    {"slug": "advanced-graphs", "name": "Advanced Graphs", "desc": "Shortest paths and spanning trees."},
    {"slug": "heap", "name": "Heap / Priority Queue", "desc": "Maintaining order dynamically."},
    {"slug": "intervals", "name": "Intervals", "desc": "Overlapping ranges and scheduling."},
    {"slug": "greedy", "name": "Greedy", "desc": "Locally optimal choices."},
    {"slug": "dp", "name": "Dynamic Programming", "desc": "Overlapping subproblems and memoization."},
    {"slug": "bit-manipulation", "name": "Bit Manipulation", "desc": "Bitwise operations and binary logic."}
]

def generate_problems_for_category(cat, count=5):
    problems = []
    base_id = cat["slug"].replace("-", "")
    for i in range(1, count + 1):
        diff = "easy" if i <= 2 else "medium" if i <= 4 else "hard"
        problems.append({
            "id": f"{base_id}_{i}",
            "slug": f"{cat['slug']}-problem-{i}",
            "title": f"{cat['name']} Problem {i}",
            "difficulty": diff,
            "category_id": cat["slug"],
            "description": f"This is an original problem focusing on {cat['name']}. You must implement a solution that adheres to the provided constraints.",
            "constraints": ["1 <= n <= 10^5"],
            "examples": [{"input": "n = 5", "output": "120", "explanation": "Example explanation."}],
            "test_cases": [{"input": "5", "expectedOutput": "120"}],
            "starter_code_python": "def solve(n):\n    # Write your code here\n    pass\n",
            "visualization_type": cat["slug"],
            "display_order": i
        })
    return problems

def seed_db():
    db = SessionLocal()
    try:
        print("Seeding categories...")
        for i, cat_data in enumerate(CATEGORIES):
            cat = db.query(Category).filter_by(id=cat_data["slug"]).first()
            if not cat:
                cat = Category(
                    id=cat_data["slug"],
                    slug=cat_data["slug"],
                    name=cat_data["name"],
                    description=cat_data["desc"],
                    display_order=i
                )
                db.add(cat)
                
            problems_data = generate_problems_for_category(cat_data, 5)
            for p_data in problems_data:
                prob = db.query(Problem).filter_by(id=p_data["id"]).first()
                if not prob:
                    prob = Problem(**p_data)
                    db.add(prob)
                    
        db.commit()
        print("Seeding complete.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
