from .openai_service import evaluate_prompt_with_comprehensive_analysis

def evaluate_prompt_with_ai(problem: str, user_prompt: str) -> dict:
    evaluation = evaluate_prompt_with_comprehensive_analysis(problem, user_prompt)
    
    # Ensure all scores are present
    if "overall_score" not in evaluation:
        # Calculate if missing
        evaluation["overall_score"] = (
            0.25 * evaluation.get("clarity_score", 75) +
            0.20 * evaluation.get("specificity_score", 75) +
            0.20 * evaluation.get("effectiveness_score", 75) +
            0.15 * evaluation.get("best_practices_score", 75) +
            0.10 * evaluation.get("efficiency_score", 75) +
            0.10 * evaluation.get("safety_score", 90)
        )
    
    return evaluation
