from openai import OpenAI
from ..config import settings
import json
import re

client = OpenAI(api_key=settings.OPENAI_API_KEY)

COMPREHENSIVE_EVALUATION_PROMPT = """You are an expert prompt engineering evaluator and instructor. Analyze the user's prompt comprehensively.

Given:
- Problem: {problem}
- User's Prompt: {user_prompt}

Provide a DETAILED evaluation covering ALL these aspects:

1. CLARITY & STRUCTURE (0-100):
   - Grammar correctness
   - Readability
   - Ambiguity level
   - Sentence complexity

2. SPECIFICITY & DETAIL (0-100):
   - Specific instruction quality
   - Context completeness
   - Constraint definition
   - Detail level

3. EFFECTIVENESS (0-100):
   - Expected output relevance
   - Completeness potential
   - Usefulness rating

4. BEST PRACTICES (0-100):
   Check for:
   - Role definition ("Act as...")
   - Clear task description
   - Output format specified
   - Constraints defined
   - Examples provided
   - Step-by-step structure

5. EFFICIENCY (0-100):
   - Token efficiency
   - Redundancy level
   - Conciseness

6. SAFETY (0-100):
   - Bias risk
   - Ethical concerns
   - Prompt injection risk

7. PROMPT COMPONENTS ANALYSIS:
   Identify which components are present:
   - has_role_definition (true/false)
   - has_clear_task (true/false)
   - has_output_format (true/false)
   - has_constraints (true/false)
   - has_examples (true/false)
   - has_step_by_step (true/false)

8. TOKEN ANALYSIS:
   - estimated_tokens (number)
   - useful_tokens_percentage (0-100)
   - redundant_tokens_percentage (0-100)

9. DETAILED FEEDBACK:
   - strengths (3-4 specific strengths)
   - weaknesses (3-4 specific areas for improvement)
   - issues_detected (list of specific problems)
   - suggestions (3-4 actionable improvements)

10. IMPROVED VERSION:
    - ai_improved_prompt (complete rewrite incorporating all suggestions)

Return ONLY a valid JSON object with this EXACT structure:
{{
  "clarity_score": <0-100>,
  "specificity_score": <0-100>,
  "effectiveness_score": <0-100>,
  "best_practices_score": <0-100>,
  "efficiency_score": <0-100>,
  "safety_score": <0-100>,
  "overall_score": <weighted average>,
  "grammar_score": <0-100>,
  "readability_score": <0-100>,
  "ambiguity_score": <0-100, lower is better>,
  "has_role_definition": <true/false>,
  "has_clear_task": <true/false>,
  "has_output_format": <true/false>,
  "has_constraints": <true/false>,
  "has_examples": <true/false>,
  "has_step_by_step": <true/false>,
  "estimated_tokens": <number>,
  "useful_tokens_percentage": <0-100>,
  "redundant_tokens_percentage": <0-100>,
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "issues_detected": ["issue1", "issue2", "issue3"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "ai_improved_prompt": "complete improved version here",
  "improvement_potential_score": <0-100, how much better it could be>
}}

Calculate overall_score using this formula:
overall_score = (0.25 × clarity) + (0.20 × specificity) + (0.20 × effectiveness) + (0.15 × best_practices) + (0.10 × efficiency) + (0.10 × safety)
"""

def generate_ai_problem():
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a creative problem generator. Generate realistic, practical problems that would benefit from AI solutions."
                },
                {
                    "role": "user",
                    "content": "Generate a real-world problem that could be solved with AI. Make it specific, practical, and relevant to current technology trends. Return only the problem description in 2-3 sentences."
                }
            ],
            temperature=0.8,
            max_tokens=200
        )
        
        problem_text = response.choices[0].message.content.strip()
        
        return {
            "problem_text": problem_text,
            "source": "AI Generated"
        }
    except Exception as e:
        raise Exception(f"OpenAI API error: {str(e)}")

def evaluate_prompt_with_comprehensive_analysis(problem: str, user_prompt: str):
    try:
        formatted_prompt = COMPREHENSIVE_EVALUATION_PROMPT.format(
            problem=problem,
            user_prompt=user_prompt
        )
        
        # Try GPT-4 first, fallback to GPT-3.5
        try:
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert prompt engineering evaluator. Always return valid JSON with all required fields."
                    },
                    {
                        "role": "user",
                        "content": formatted_prompt
                    }
                ],
                temperature=0.3,
                max_tokens=2000
            )
        except Exception as gpt4_error:
            print(f"GPT-4 failed, using GPT-3.5-turbo: {str(gpt4_error)}")
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert prompt engineering evaluator. Always return valid JSON."
                    },
                    {
                        "role": "user",
                        "content": formatted_prompt + "\n\nIMPORTANT: Return ONLY the JSON object, no additional text."
                    }
                ],
                temperature=0.3,
                max_tokens=2000
            )
        
        content = response.choices[0].message.content.strip()
        
        # Clean up response
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        
        # Parse JSON
        evaluation = json.loads(content)
        
        # Ensure all required fields exist
        required_fields = {
            "clarity_score": 75.0,
            "specificity_score": 75.0,
            "effectiveness_score": 75.0,
            "best_practices_score": 75.0,
            "efficiency_score": 75.0,
            "safety_score": 90.0,
            "overall_score": 75.0,
            "grammar_score": 80.0,
            "readability_score": 75.0,
            "ambiguity_score": 30.0,
            "has_role_definition": False,
            "has_clear_task": True,
            "has_output_format": False,
            "has_constraints": False,
            "has_examples": False,
            "has_step_by_step": False,
            "estimated_tokens": len(user_prompt.split()) * 1.3,
            "useful_tokens_percentage": 70.0,
            "redundant_tokens_percentage": 30.0,
            "strengths": ["Clear communication", "Relevant to problem"],
            "weaknesses": ["Could be more specific"],
            "issues_detected": ["Output format not specified"],
            "suggestions": ["Add role definition", "Specify output format"],
            "ai_improved_prompt": user_prompt,
            "improvement_potential_score": 85.0
        }
        
        for key, default_value in required_fields.items():
            if key not in evaluation:
                evaluation[key] = default_value
        
        return evaluation
        
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {str(e)}")
        print(f"Response content: {content}")
        raise Exception(f"Failed to parse OpenAI response as JSON: {str(e)}")
    except Exception as e:
        raise Exception(f"OpenAI evaluation error: {str(e)}")
