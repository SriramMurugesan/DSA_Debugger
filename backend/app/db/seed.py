import json
import os
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

def validate_problem(p_data, valid_categories):
    required = ["id", "slug", "title", "difficulty", "category_id", "description", 
                "constraints", "examples", "test_cases", "starter_code_python", 
                "visualization_type", "display_order"]
    
    for req in required:
        if req not in p_data:
            raise ValueError(f"Problem {p_data.get('id', 'UNKNOWN')} missing required field: {req}")
            
    if p_data["category_id"] not in valid_categories:
        raise ValueError(f"Problem {p_data['id']} uses invalid category_id: {p_data['category_id']}")
        
    if p_data["difficulty"] not in ["easy", "medium", "hard"]:
        raise ValueError(f"Problem {p_data['id']} has invalid difficulty: {p_data['difficulty']}")
        
    if len(p_data["examples"]) < 1:
        raise ValueError(f"Problem {p_data['id']} must have at least 1 example.")
        
    if "def solve(n):" in p_data["starter_code_python"]:
        raise ValueError(f"Problem {p_data['id']} uses a generic starter code.")
        
    for tc in p_data["test_cases"]:
        if "input" not in tc or "expectedOutput" not in tc:
            raise ValueError(f"Problem {p_data['id']} has invalid test case format.")

def seed_db():
    db = SessionLocal()
    try:
        print("Seeding categories...")
        valid_categories = set()
        for i, cat_data in enumerate(CATEGORIES):
            valid_categories.add(cat_data["slug"])
            cat = db.query(Category).filter_by(id=cat_data["slug"]).first()
            if cat:
                # Upsert
                cat.name = cat_data["name"]
                cat.description = cat_data["desc"]
                cat.display_order = i
            else:
                cat = Category(
                    id=cat_data["slug"],
                    slug=cat_data["slug"],
                    name=cat_data["name"],
                    description=cat_data["desc"],
                    display_order=i
                )
                db.add(cat)
        
        # Ensure categories flush to DB
        db.commit()
        
        # Load Problems JSON
        problems_path = os.path.join(os.path.dirname(__file__), "problems.json")
        if not os.path.exists(problems_path):
            print(f"File {problems_path} not found! Cannot seed problems.")
            return
            
        with open(problems_path, "r") as f:
            problems_data = json.load(f)
            
        # Global uniqueness tracking
        seen_ids = set()
        seen_slugs = set()
        
        print(f"Validating and seeding {len(problems_data)} problems...")
        for p_data in problems_data:
            validate_problem(p_data, valid_categories)
            
            if p_data["id"] in seen_ids:
                raise ValueError(f"Duplicate problem ID found: {p_data['id']}")
            seen_ids.add(p_data["id"])
            
            if p_data["slug"] in seen_slugs:
                raise ValueError(f"Duplicate problem slug found: {p_data['slug']}")
            seen_slugs.add(p_data["slug"])
            
            prob = db.query(Problem).filter_by(id=p_data["id"]).first()
            if prob:
                # Upsert
                for k, v in p_data.items():
                    setattr(prob, k, v)
            else:
                prob = Problem(**p_data)
                db.add(prob)
                
        db.commit()
        print(f"Successfully seeded {len(problems_data)} problems!")
        
    except Exception as e:
        db.rollback()
        print(f"Seeding failed: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
