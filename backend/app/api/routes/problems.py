from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import math

from app.db.models import get_db, Problem, Category, UserProblemProgress, ProgressStatus
from app.api.routes.auth import get_current_user

router = APIRouter()

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).order_by(Category.display_order).all()
    return [{"id": c.id, "slug": c.slug, "name": c.name, "description": c.description} for c in categories]

@router.get("/problems")
def get_problems(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    query = db.query(Problem)
    if category and category != "All":
        query = query.filter(Problem.category.has(name=category))
    if difficulty and difficulty != "All":
        query = query.filter(Problem.difficulty == difficulty.lower())
    
    problems = query.order_by(Problem.display_order).all()
    
    # Get user progress for these problems
    problem_ids = [p.id for p in problems]
    progress_records = db.query(UserProblemProgress).filter(
        UserProblemProgress.user_id == user.id,
        UserProblemProgress.problem_id.in_(problem_ids)
    ).all()
    progress_map = {p.problem_id: p.status for p in progress_records}
    
    result = []
    for p in problems:
        status = progress_map.get(p.id, ProgressStatus.NOT_STARTED)
        result.append({
            "id": p.id,
            "slug": p.slug,
            "title": p.title,
            "difficulty": p.difficulty,
            "category": p.category.name,
            "status": status
        })
    return result

@router.get("/problems/{slug}")
def get_problem(slug: str, db: Session = Depends(get_db), user = Depends(get_current_user)):
    problem = db.query(Problem).filter(Problem.slug == slug).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
        
    progress = db.query(UserProblemProgress).filter(
        UserProblemProgress.user_id == user.id,
        UserProblemProgress.problem_id == problem.id
    ).first()
    
    return {
        "id": problem.id,
        "slug": problem.slug,
        "title": problem.title,
        "difficulty": problem.difficulty,
        "category": problem.category.name,
        "description": problem.description,
        "constraints": problem.constraints,
        "examples": problem.examples,
        "testCases": problem.test_cases,
        "starterCode": {"python": problem.starter_code_python},
        "visualizationType": problem.visualization_type,
        "status": progress.status if progress else ProgressStatus.NOT_STARTED
    }

@router.post("/problems/{slug}/submit")
def submit_problem_progress(slug: str, status: str, db: Session = Depends(get_db), user = Depends(get_current_user)):
    problem = db.query(Problem).filter(Problem.slug == slug).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
        
    progress = db.query(UserProblemProgress).filter(
        UserProblemProgress.user_id == user.id,
        UserProblemProgress.problem_id == problem.id
    ).first()
    
    from datetime import datetime
    
    if not progress:
        progress = UserProblemProgress(
            user_id=user.id,
            problem_id=problem.id,
            status=status,
            attempts=1,
            last_attempted_at=datetime.utcnow()
        )
        if status == ProgressStatus.SOLVED:
            progress.completed_at = datetime.utcnow()
        db.add(progress)
    else:
        progress.attempts += 1
        progress.last_attempted_at = datetime.utcnow()
        if status == ProgressStatus.SOLVED and progress.status != ProgressStatus.SOLVED:
            progress.status = ProgressStatus.SOLVED
            progress.completed_at = datetime.utcnow()
            
    db.commit()
    return {"status": "success"}
