from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.models import get_db, Problem, Category, UserProblemProgress, ProgressStatus
from app.api.routes.auth import get_current_user

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_data(db: Session = Depends(get_db), user = Depends(get_current_user)):
    # 1. Total problems and solved count
    total_problems = db.query(func.count(Problem.id)).scalar() or 0
    solved_problems = db.query(func.count(UserProblemProgress.id)).filter(
        UserProblemProgress.user_id == user.id,
        UserProblemProgress.status == ProgressStatus.SOLVED
    ).scalar() or 0
    
    # Calculate streak (simplified for now based on last login)
    streak = 1 # Logic for actual streak calculation based on user.last_login_at
    
    progress_pct = round((solved_problems / total_problems * 100) if total_problems > 0 else 0)
    
    # 2. Get total problems per category (grouped)
    category_totals = db.query(
        Category.id, 
        Category.name, 
        func.count(Problem.id).label('total')
    ).outerjoin(Problem, Category.id == Problem.category_id).group_by(Category.id).all()
    
    # 3. Get solved problems per category for the user (grouped)
    solved_by_category = db.query(
        Problem.category_id, 
        func.count(UserProblemProgress.id).label('solved')
    ).join(UserProblemProgress, Problem.id == UserProblemProgress.problem_id).filter(
        UserProblemProgress.user_id == user.id,
        UserProblemProgress.status == ProgressStatus.SOLVED
    ).group_by(Problem.category_id).all()
    
    # Map solved counts for O(1) lookup
    solved_map = {cat_id: solved for cat_id, solved in solved_by_category}
    
    cat_stats = []
    for cat_id, name, total in category_totals:
        if total > 0:
            cat_stats.append({
                "name": name,
                "solved": solved_map.get(cat_id, 0),
                "total": total,
                "path": f"/problems?category={name.replace(' ', '+').replace('&', '%26')}"
            })
            
    return {
        "solved": solved_problems,
        "total": total_problems,
        "streak": streak,
        "progress": progress_pct,
        "categories": cat_stats
    }
