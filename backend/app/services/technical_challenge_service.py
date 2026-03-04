from openai import OpenAI
from ..config import settings
import json
import random

client = OpenAI(api_key=settings.OPENAI_API_KEY)

CHALLENGE_CATEGORIES = {
    "dsa": "Data Structures & Algorithms",
    "dbms": "Database Management Systems",
    "daa": "Design & Analysis of Algorithms"
}

DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"]

DSA_PROBLEM_GENERATOR_PROMPT = """Generate a LeetCode-style DSA problem with the following structure:

**Title**: A clear, concise problem title
**Difficulty**: {difficulty}
**Category**: {category}
**Description**: A detailed problem description (2-3 paragraphs)
**Constraints**: List of constraints (e.g., array size, value ranges)
**Examples**: Provide 3 examples with:
  - Input
  - Output
  - Explanation

**Test Cases**: Include edge cases to consider

Return as JSON with this exact structure:
{{
  "title": "Problem Title",
  "difficulty": "Easy/Medium/Hard",
  "category": "Array/String/Tree/Graph/DP/etc",
  "description": "Detailed problem description",
  "constraints": ["constraint1", "constraint2", "constraint3"],
  "examples": [
    {{
      "input": "input description",
      "output": "output description",
      "explanation": "why this output"
    }}
  ],
  "edge_cases": ["edge case 1", "edge case 2"],
  "optimal_time_complexity": "O(n)",
  "optimal_space_complexity": "O(1)"
}}

Make it realistic and challenging like real LeetCode problems.
"""

DBMS_PROBLEM_GENERATOR_PROMPT = """Generate a database design or query optimization problem:

**Title**: Clear problem title
**Difficulty**: {difficulty}
**Type**: Schema Design / Query Optimization / Transaction Management / Indexing
**Scenario**: Real-world database scenario (2-3 paragraphs)
**Requirements**: List what needs to be achieved
**Sample Data**: Example tables and data
**Expected Output**: What the solution should produce

Return as JSON:
{{
  "title": "Problem Title",
  "difficulty": "Easy/Medium/Hard",
  "type": "Schema Design/Query/etc",
  "scenario": "detailed scenario",
  "requirements": ["req1", "req2"],
  "sample_tables": [
    {{"table_name": "users", "columns": ["id", "name", "email"]}}
  ],
  "sample_data": "example data",
  "expected_output": "what solution should achieve",
  "considerations": ["consideration1", "consideration2"]
}}
"""

DAA_PROBLEM_GENERATOR_PROMPT = """Generate an algorithm design problem:

**Title**: Clear problem title
**Difficulty**: {difficulty}
**Topic**: Greedy / Dynamic Programming / Divide & Conquer / Backtracking / Graph Algorithms
**Problem Statement**: Detailed problem (2-3 paragraphs)
**Input Format**: How input is provided
**Output Format**: Expected output format
**Examples**: 3 examples with explanations
**Constraints**: Time/space constraints

Return as JSON:
{{
  "title": "Problem Title",
  "difficulty": "Easy/Medium/Hard",
  "topic": "DP/Greedy/etc",
  "problem_statement": "detailed problem",
  "input_format": "input description",
  "output_format": "output description",
  "examples": [
    {{
      "input": "input",
      "output": "output",
      "explanation": "explanation"
    }}
  ],
  "constraints": ["constraint1", "constraint2"],
  "hints": ["hint1", "hint2"]
}}
"""

def generate_technical_challenge(category: str, difficulty: str = None):
    if difficulty is None:
        difficulty = random.choice(DIFFICULTY_LEVELS)
    
    if category == "dsa":
        prompt = DSA_PROBLEM_GENERATOR_PROMPT.format(difficulty=difficulty, category="DSA")
    elif category == "dbms":
        prompt = DBMS_PROBLEM_GENERATOR_PROMPT.format(difficulty=difficulty)
    elif category == "daa":
        prompt = DAA_PROBLEM_GENERATOR_PROMPT.format(difficulty=difficulty)
    else:
        raise ValueError(f"Invalid category: {category}")
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert technical problem creator. Generate challenging, realistic problems. Always return valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        content = response.choices[0].message.content.strip()
        
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        
        problem_data = json.loads(content)
        problem_data["category"] = category
        problem_data["category_name"] = CHALLENGE_CATEGORIES[category]
        
        return problem_data
        
    except Exception as e:
        print(f"Error generating challenge: {str(e)}")
        return get_default_problem(category, difficulty)

def get_default_problem(category: str, difficulty: str):
    if category == "dsa":
        return {
            "title": "Two Sum",
            "difficulty": difficulty,
            "category": "dsa",
            "category_name": "Data Structures & Algorithms",
            "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
            "constraints": ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Only one valid answer exists"],
            "examples": [
                {"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "Because nums[0] + nums[1] == 9, we return [0,1]"},
                {"input": "nums = [3,2,4], target = 6", "output": "[1,2]", "explanation": "Because nums[1] + nums[2] == 6, we return [1,2]"}
            ],
            "edge_cases": ["Negative numbers", "Large arrays", "Target not found"],
            "optimal_time_complexity": "O(n)",
            "optimal_space_complexity": "O(n)"
        }
    elif category == "dbms":
        return {
            "title": "Design User Database Schema",
            "difficulty": difficulty,
            "category": "dbms",
            "category_name": "Database Management Systems",
            "scenario": "You need to design a database schema for a social media application that stores user profiles, posts, comments, and likes. The system should support efficient queries for user feeds and engagement metrics.",
            "requirements": ["Store user profiles with authentication", "Track posts with timestamps", "Allow comments on posts", "Track likes on posts and comments"],
            "sample_tables": [
                {"table_name": "users", "columns": ["id", "username", "email", "created_at"]},
                {"table_name": "posts", "columns": ["id", "user_id", "content", "created_at"]},
                {"table_name": "comments", "columns": ["id", "post_id", "user_id", "content", "created_at"]},
                {"table_name": "likes", "columns": ["id", "user_id", "post_id", "created_at"]}
            ],
            "sample_data": "Users post content, other users can comment and like",
            "expected_output": "Normalized schema with proper foreign keys and indexes",
            "considerations": ["Data normalization", "Query optimization", "Indexing strategy"],
            "examples": [{"input": "Design schema for user posts", "output": "Tables with relationships", "explanation": "Normalized design with foreign keys"}]
        }
    elif category == "daa":
        return {
            "title": "Coin Change Problem",
            "difficulty": difficulty,
            "category": "daa",
            "category_name": "Design & Analysis of Algorithms",
            "topic": "Dynamic Programming",
            "problem_statement": "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount cannot be made up by any combination of the coins, return -1.",
            "input_format": "coins: List[int], amount: int",
            "output_format": "int (minimum number of coins or -1)",
            "examples": [
                {"input": "coins = [1,2,5], amount = 11", "output": "3", "explanation": "11 = 5 + 5 + 1"},
                {"input": "coins = [2], amount = 3", "output": "-1", "explanation": "Cannot make amount 3 with only coin 2"}
            ],
            "constraints": ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
            "hints": ["Use dynamic programming", "Build solution bottom-up"]
        }
    return {}

def evaluate_technical_prompt(problem: dict, user_prompt: str, constraints: dict):
    evaluation_prompt = f"""You are evaluating a prompt written to solve a technical problem.

**Original Problem:**
{json.dumps(problem, indent=2)}

**User's Prompt:**
{user_prompt}

**Constraints Given:**
- Word Limit: {constraints.get('word_limit', 'None')}
- Token Limit: {constraints.get('token_limit', 'None')}

**Actual Stats:**
- Words Used: {len(user_prompt.split())}
- Estimated Tokens: {int(len(user_prompt.split()) * 1.3)}

Evaluate the prompt on these criteria (0-100 each):

1. **Problem Understanding**: Does the prompt show clear understanding of the problem?
2. **Approach Clarity**: Is the algorithmic approach clearly explained?
3. **Implementation Details**: Are implementation details specific enough?
4. **Edge Case Handling**: Does it address edge cases and constraints?
5. **Complexity Analysis**: Does it mention time/space complexity?
6. **Code Structure**: Is there clear structure for the solution?
7. **Constraint Adherence**: Did they follow word/token limits?
8. **Correctness**: Would this prompt produce correct code?

Also simulate execution:
- Would this prompt generate working code? (Yes/No)
- Test case pass rate: X/Y
- Issues found: List specific issues

IMPORTANT: You MUST provide an "improved_prompt" that is a COMPLETE, BETTER VERSION of the user's prompt with:
- Clearer problem understanding
- Better structured approach
- Specific implementation details
- Edge case handling
- Complexity analysis
- All improvements incorporated

Return JSON:
{{
  "overall_score": <0-100>,
  "problem_understanding": <0-100>,
  "approach_clarity": <0-100>,
  "implementation_details": <0-100>,
  "edge_case_handling": <0-100>,
  "complexity_analysis": <0-100>,
  "code_structure": <0-100>,
  "constraint_adherence": <0-100>,
  "correctness": <0-100>,
  "would_generate_working_code": <true/false>,
  "estimated_test_pass_rate": <0-100>,
  "passed_test_cases": <number>,
  "total_test_cases": <number>,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "issues_found": ["issue1", "issue2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "improved_prompt": "COMPLETE improved version with all enhancements (minimum 100 words)",
  "code_generation_quality": "Poor/Fair/Good/Excellent",
  "readability_score": <0-100>,
  "completeness_score": <0-100>
}}
"""
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert code reviewer and prompt evaluator. Evaluate technical prompts critically and ALWAYS provide a complete improved version."},
                {"role": "user", "content": evaluation_prompt}
            ],
            temperature=0.3,
            max_tokens=2500  # Increased for longer improved_prompt
        )
        
        content = response.choices[0].message.content.strip()
        
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        
        evaluation = json.loads(content)
        
        # Calculate word/token counts
        word_count = len(user_prompt.split())
        token_count = int(word_count * 1.3)
        
        # Check constraints
        evaluation["constraints_met"] = True
        evaluation["constraint_violations"] = []
        
        if constraints.get('word_limit') and word_count > constraints['word_limit']:
            evaluation["constraints_met"] = False
            evaluation["constraint_violations"].append(f"Exceeded word limit by {word_count - constraints['word_limit']} words")
        
        if constraints.get('token_limit') and token_count > constraints['token_limit']:
            evaluation["constraints_met"] = False
            evaluation["constraint_violations"].append(f"Exceeded token limit by {token_count - constraints['token_limit']} tokens")
        
        evaluation["word_count"] = word_count
        evaluation["token_count"] = token_count
        
        # ✅ ENSURE improved_prompt exists with fallback
        if not evaluation.get("improved_prompt") or len(evaluation.get("improved_prompt", "")) < 50:
            # Generate a detailed improved prompt if missing
            evaluation["improved_prompt"] = f"""Problem: {problem.get('title', 'Technical Challenge')}

Approach:
1. Understand the problem requirements and constraints
2. Identify the optimal data structure and algorithm
3. Consider edge cases: {', '.join(problem.get('edge_cases', ['empty input', 'large inputs', 'edge values'])[:3])}
4. Analyze time complexity: Target {problem.get('optimal_time_complexity', 'O(n)')}
5. Analyze space complexity: Target {problem.get('optimal_space_complexity', 'O(1)')}

Implementation Strategy:
- Initialize necessary data structures
- Implement main algorithm logic
- Handle boundary conditions
- Validate input constraints
- Return expected output format

Testing:
- Test with provided examples
- Test edge cases
- Verify complexity requirements

This improved approach provides clear structure, addresses all requirements, and ensures correctness."""
        
        # Ensure default values for all fields
        default_fields = {
            "overall_score": 75.0,
            "problem_understanding": 75.0,
            "approach_clarity": 70.0,
            "implementation_details": 70.0,
            "edge_case_handling": 65.0,
            "complexity_analysis": 60.0,
            "code_structure": 70.0,
            "constraint_adherence": 100.0,
            "correctness": 75.0,
            "would_generate_working_code": True,
            "estimated_test_pass_rate": 70.0,
            "passed_test_cases": 7,
            "total_test_cases": 10,
            "strengths": ["Clear understanding", "Good structure"],
            "weaknesses": ["Could add more edge cases"],
            "issues_found": ["Minor improvements needed"],
            "suggestions": ["Consider more test cases", "Add complexity analysis"],
            "code_generation_quality": "Good",
            "readability_score": 75.0,
            "completeness_score": 70.0,
            "xp_earned": 50,
            "new_level": 1,
            "badges_earned": []
        }
        
        for key, default_value in default_fields.items():
            if key not in evaluation:
                evaluation[key] = default_value
        
        # Calculate XP based on score
        evaluation["xp_earned"] = int(evaluation["overall_score"] * 0.5)
        if evaluation["constraints_met"]:
            evaluation["xp_earned"] += 10
        
        return evaluation
        
    except Exception as e:
        print(f"Error in technical evaluation: {str(e)}")
        raise
