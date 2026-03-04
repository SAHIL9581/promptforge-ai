from openai import OpenAI
from ..config import settings
import json
import re
import time
import logging

logger = logging.getLogger(__name__)

client = OpenAI(api_key=settings.OPENAI_API_KEY)

# ──────────────────────────────────────────────
# MODEL FALLBACK CHAIN
# ──────────────────────────────────────────────
EVAL_MODEL_CHAIN = ["gpt-4o-mini"]
PROBLEM_MODEL_CHAIN = ["gpt-4o-mini"]

# ──────────────────────────────────────────────
# PROMPTS
# ──────────────────────────────────────────────

COMPREHENSIVE_EVALUATION_PROMPT = """You are a world-class prompt engineering expert and NLP evaluator with deep expertise in LLM behavior, cognitive load theory, and instruction following.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Perform a rigorous, multi-dimensional evaluation of the user's prompt relative to the given problem. Then rewrite an optimal version.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INPUTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROBLEM:
{problem}

USER PROMPT:
{user_prompt}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVALUATION DIMENSIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Score each dimension 0–100 using nuanced judgment — avoid clustering around 70–80.
Push scores to extremes when warranted (e.g., 20 for very poor, 95 for near-perfect).

1. CLARITY & STRUCTURE (0–100)
   Consider: grammatical correctness, sentence complexity, reading ease (Flesch-Kincaid estimate),
   logical flow, use of formatting/structure, absence of ambiguous pronouns or vague references.

2. SPECIFICITY & DETAIL (0–100)
   Consider: how precisely the task is defined, whether context is provided, whether
   constraints, scope, audience, and edge cases are addressed. Penalize generic prompts heavily.

3. EFFECTIVENESS (0–100)
   Predict: how reliably this prompt would produce a high-quality, complete, correct output
   from an LLM. Consider alignment between prompt intent and problem requirements.

4. BEST PRACTICES ADHERENCE (0–100)
   Check for use of: persona/role priming, chain-of-thought triggers, few-shot examples,
   output format specification, task decomposition, negative constraints ("do not…"),
   explicit success criteria.

5. EFFICIENCY (0–100)
   Consider: information density, absence of filler phrases, no unnecessary repetition,
   good token-to-value ratio. A verbose but high-value prompt can still score well.

6. SAFETY & ROBUSTNESS (0–100)
   Consider: risk of hallucination induction, prompt injection vulnerability,
   potential for biased outputs, ambiguity that could lead to harmful completions,
   presence of grounding constraints.

7. COGNITIVE LOAD ON THE MODEL (0–100, higher = lower load = better)
   Consider: whether instructions are ordered logically, whether the model must infer
   too much, whether competing instructions exist, and whether scope is well-bounded.

8. ALIGNMENT WITH PROBLEM (0–100)
   Consider: how well the prompt actually addresses the stated problem. A well-written
   prompt that answers the wrong question should score low here.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPONENT DETECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Detect the presence of each structural component (true/false):
- has_role_definition: prompt assigns an expert persona to the model
- has_clear_task: the core task/objective is unambiguous
- has_output_format: desired output structure is specified
- has_constraints: limitations or boundaries are defined
- has_examples: at least one input/output example is given
- has_step_by_step: chain-of-thought or sequential reasoning is prompted
- has_negative_constraints: what the model should NOT do is stated
- has_audience_definition: the target audience or context is stated
- has_success_criteria: clear definition of what a good answer looks like

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOKEN ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- estimated_tokens: rough token count (words × 1.35)
- useful_tokens_percentage: percentage contributing meaningful signal
- redundant_tokens_percentage: percentage that is filler or repetitive
- information_density_score: bits of instruction per token (0–100 scale)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUALITATIVE ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- strengths: 3–5 specific, evidence-based strengths (quote the prompt)
- weaknesses: 3–5 specific, evidence-based weaknesses (be precise, not generic)
- issues_detected: concrete problems that would cause LLM failure or degraded output
- suggestions: actionable, prioritized rewrites or additions
- missing_elements: critical elements absent from the prompt
- hallucination_risk: LOW / MEDIUM / HIGH with one-line rationale
- prompt_pattern: identify the closest prompt pattern (e.g., "Zero-shot directive",
  "Few-shot exemplar", "Chain-of-thought", "Role-play", "Structured template", "Hybrid")

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPROVED PROMPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rewrite the prompt from scratch, incorporating all best practices.
The improved prompt must:
  • Open with a role definition
  • State the task clearly and completely
  • Specify the output format explicitly
  • Include at least one constraint
  • Use chain-of-thought or structured reasoning where appropriate
  • Be no longer than necessary (efficient)
  • Directly address the stated problem

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCORING FORMULA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
overall_score = round(
  (0.20 × clarity_score) +
  (0.18 × specificity_score) +
  (0.18 × effectiveness_score) +
  (0.12 × best_practices_score) +
  (0.10 × efficiency_score) +
  (0.10 × safety_score) +
  (0.07 × cognitive_load_score) +
  (0.05 × alignment_score)
, 1)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Return ONLY a valid JSON object — no markdown, no explanation, no preamble.
Use this EXACT schema:

{{
  "clarity_score": <0-100>,
  "specificity_score": <0-100>,
  "effectiveness_score": <0-100>,
  "best_practices_score": <0-100>,
  "efficiency_score": <0-100>,
  "safety_score": <0-100>,
  "cognitive_load_score": <0-100>,
  "alignment_score": <0-100>,
  "overall_score": <weighted average per formula above>,
  "grammar_score": <0-100>,
  "readability_score": <0-100>,
  "ambiguity_score": <0-100, lower = more ambiguous>,
  "information_density_score": <0-100>,
  "has_role_definition": <true/false>,
  "has_clear_task": <true/false>,
  "has_output_format": <true/false>,
  "has_constraints": <true/false>,
  "has_examples": <true/false>,
  "has_step_by_step": <true/false>,
  "has_negative_constraints": <true/false>,
  "has_audience_definition": <true/false>,
  "has_success_criteria": <true/false>,
  "estimated_tokens": <number>,
  "useful_tokens_percentage": <0-100>,
  "redundant_tokens_percentage": <0-100>,
  "strengths": ["<specific strength with quote or evidence>", ...],
  "weaknesses": ["<specific weakness with explanation>", ...],
  "issues_detected": ["<concrete issue that would degrade LLM output>", ...],
  "suggestions": ["<prioritized, actionable suggestion>", ...],
  "missing_elements": ["<element>", ...],
  "hallucination_risk": "<LOW|MEDIUM|HIGH>",
  "hallucination_risk_reason": "<one-line rationale>",
  "prompt_pattern": "<identified pattern>",
  "ai_improved_prompt": "<complete, production-ready rewrite>",
  "improvement_potential_score": <0-100>
}}
"""

PROBLEM_GENERATION_PROMPT_SYSTEM = """You are a senior AI/ML curriculum designer with expertise across NLP, computer vision, reinforcement learning, MLOps, and applied AI ethics.

Generate a realistic, nuanced, and industry-relevant AI/ML problem. Problems must reflect current technology trends (2024–2025).

Return ONLY a valid JSON object with EXACTLY this schema — no markdown, no preamble:
{
  "title": "<concise problem title>",
  "context": "<industry context, 1–2 sentences>",
  "scenario": "<detailed scenario with stakeholders and business impact, 3–4 sentences>",
  "requirements": ["<specific, measurable requirement>", ...],
  "constraints": ["<hard technical or ethical constraint>", ...],
  "evaluation_criteria": ["<how success is measured>", ...],
  "example_input": "<realistic sample input>",
  "example_output": "<specific expected output>",
  "difficulty": "<Easy|Medium|Hard|Expert>",
  "domain": "<NLP|CV|RL|MLOps|Ethics|Multimodal|RecSys|TimeSeries|Other>",
  "skills_tested": ["<skill>", ...]
}"""

PROBLEM_GENERATION_PROMPT_USER = """Generate a unique, challenging AI/ML problem relevant to current industry trends.
Vary the domain — avoid recommendation systems if possible. Make the scenario realistic, the constraints hard, and the evaluation criteria measurable.
Problems should be solvable with a well-engineered prompt to an LLM."""

# ──────────────────────────────────────────────
# UTILITIES
# ──────────────────────────────────────────────

def _extract_json(text: str) -> str:
    """Robustly extract a JSON object from raw LLM output."""
    # Strip markdown fences
    text = re.sub(r"^```(?:json)?\s*", "", text.strip(), flags=re.IGNORECASE)
    text = re.sub(r"\s*```$", "", text.strip())
    text = text.strip()

    # If it starts with '{' we're probably fine
    if text.startswith("{"):
        return text

    # Otherwise find the first { ... } block
    match = re.search(r"\{[\s\S]+\}", text)
    if match:
        return match.group(0)

    raise ValueError("No JSON object found in LLM response")


def _call_with_fallback(model_chain: list, messages: list, temperature: float, max_tokens: int) -> str:
    """Try each model in the chain; return the content string of the first success."""
    last_error = None
    for model in model_chain:
        try:
            logger.info(f"Trying model: {model}")
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                response_format={"type": "json_object"} if "gpt-4o" in model or "gpt-3.5-turbo" in model else None,
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.warning(f"Model {model} failed: {e}")
            last_error = e
            time.sleep(0.5)  # brief pause before retry
    raise Exception(f"All models in chain failed. Last error: {last_error}")


def _validate_and_fill_eval(evaluation: dict, user_prompt: str) -> dict:
    """Ensure all expected fields exist with sensible defaults."""
    word_count = len(user_prompt.split())
    defaults = {
        "clarity_score": 70.0,
        "specificity_score": 65.0,
        "effectiveness_score": 70.0,
        "best_practices_score": 60.0,
        "efficiency_score": 70.0,
        "safety_score": 85.0,
        "cognitive_load_score": 65.0,
        "alignment_score": 70.0,
        "overall_score": 68.0,
        "grammar_score": 80.0,
        "readability_score": 72.0,
        "ambiguity_score": 40.0,
        "information_density_score": 60.0,
        "has_role_definition": False,
        "has_clear_task": True,
        "has_output_format": False,
        "has_constraints": False,
        "has_examples": False,
        "has_step_by_step": False,
        "has_negative_constraints": False,
        "has_audience_definition": False,
        "has_success_criteria": False,
        "estimated_tokens": round(word_count * 1.35),
        "useful_tokens_percentage": 68.0,
        "redundant_tokens_percentage": 32.0,
        "strengths": ["Addresses the core topic", "Readable language"],
        "weaknesses": ["Lacks specific output format", "No role definition"],
        "issues_detected": ["Output format not specified", "No constraints provided"],
        "suggestions": [
            "Add a role definition (e.g., 'Act as an expert in...')",
            "Specify the exact output format",
            "Add explicit constraints",
        ],
        "missing_elements": ["Role definition", "Output format", "Constraints"],
        "hallucination_risk": "MEDIUM",
        "hallucination_risk_reason": "No grounding constraints or output boundaries defined.",
        "prompt_pattern": "Zero-shot directive",
        "ai_improved_prompt": user_prompt,
        "improvement_potential_score": 80.0,
    }

    for key, default in defaults.items():
        if key not in evaluation or evaluation[key] is None:
            evaluation[key] = default

    # Clamp all numeric scores to [0, 100]
    score_keys = [k for k in evaluation if k.endswith("_score") or k.endswith("_percentage")]
    for k in score_keys:
        if isinstance(evaluation[k], (int, float)):
            evaluation[k] = max(0.0, min(100.0, float(evaluation[k])))

    # Recompute overall_score server-side to guarantee formula correctness
    try:
        evaluation["overall_score"] = round(
            0.20 * evaluation["clarity_score"]
            + 0.18 * evaluation["specificity_score"]
            + 0.18 * evaluation["effectiveness_score"]
            + 0.12 * evaluation["best_practices_score"]
            + 0.10 * evaluation["efficiency_score"]
            + 0.10 * evaluation["safety_score"]
            + 0.07 * evaluation["cognitive_load_score"]
            + 0.05 * evaluation["alignment_score"],
            1,
        )
    except Exception:
        pass  # keep whatever the model returned

    # Ensure list fields are actually lists
    for list_key in ["strengths", "weaknesses", "issues_detected", "suggestions", "missing_elements"]:
        if not isinstance(evaluation.get(list_key), list):
            evaluation[list_key] = [str(evaluation[list_key])] if evaluation.get(list_key) else defaults[list_key]

    return evaluation


def _validate_and_fill_problem(problem_data: dict) -> dict:
    """Ensure all expected problem fields exist."""
    required_fields = {
        "title": "AI Challenge",
        "context": "Modern AI application",
        "scenario": "Design an AI solution for a real-world problem requiring careful engineering.",
        "requirements": ["Define the problem scope", "Propose a scalable solution", "Address edge cases"],
        "constraints": ["Use production-ready technology", "Apply ethical AI principles"],
        "evaluation_criteria": ["Accuracy of output", "Clarity of approach", "Coverage of constraints"],
        "example_input": "Sample data or query",
        "example_output": "Expected structured result",
        "difficulty": "Medium",
        "domain": "Other",
        "skills_tested": ["Prompt Engineering", "Problem Decomposition"],
        "source": "AI Generated",
    }
    for key, default in required_fields.items():
        if key not in problem_data or not problem_data[key]:
            problem_data[key] = default
    return problem_data


# ──────────────────────────────────────────────
# PUBLIC API
# ──────────────────────────────────────────────

def generate_ai_problem() -> dict:
    """Generate a structured AI/ML problem using the best available model."""
    messages = [
        {"role": "system", "content": PROBLEM_GENERATION_PROMPT_SYSTEM},
        {"role": "user", "content": PROBLEM_GENERATION_PROMPT_USER},
    ]

    try:
        content = _call_with_fallback(PROBLEM_MODEL_CHAIN, messages, temperature=0.85, max_tokens=700)
        raw_json = _extract_json(content)
        problem_data = json.loads(raw_json)
        problem_data["source"] = "AI Generated"
        return _validate_and_fill_problem(problem_data)

    except Exception as e:
        logger.error(f"Problem generation failed: {e}")
        # Rich fallback problem
        return _validate_and_fill_problem({
            "title": "Real-Time Anomaly Detection in Financial Transactions",
            "context": "FinTech platforms must detect fraud within milliseconds to prevent financial loss.",
            "scenario": (
                "A digital payment processor handles 50,000 transactions per second globally. "
                "Fraudulent transactions cost the company $2M/month. "
                "A traditional rules engine flags too many false positives, frustrating legitimate users. "
                "Design an LLM-assisted anomaly detection system that can explain its decisions to compliance officers."
            ),
            "requirements": [
                "Detect anomalies with >95% precision and >90% recall",
                "Provide a human-readable explanation for every flagged transaction",
                "Operate within a 50ms SLA per transaction",
                "Support continuous learning from fraud analyst feedback",
            ],
            "constraints": [
                "No storage of raw PII beyond 24 hours (GDPR)",
                "Model must be auditable and explainable (EU AI Act)",
                "System must degrade gracefully under 10× traffic spikes",
            ],
            "evaluation_criteria": [
                "Precision/Recall on held-out fraud dataset",
                "Latency percentiles (p50, p95, p99)",
                "Quality of natural-language explanations (human rating)",
            ],
            "example_input": "Transaction: $4,200 at 3:14 AM, merchant=Electronics Store, location=Lagos, user_avg_tx=$120, last_tx=2 min ago in New York",
            "example_output": "FLAGGED (confidence: 94%) — Reason: Geographic impossibility (NY→Lagos in 2 min), amount 35× user average, unusual hour.",
            "difficulty": "Hard",
            "domain": "MLOps",
            "skills_tested": ["Prompt Engineering", "Anomaly Detection", "Explainability", "Latency Optimization"],
            "source": "AI Generated (Fallback)",
        })


def evaluate_prompt_with_comprehensive_analysis(problem: str, user_prompt: str) -> dict:
    """
    Perform a comprehensive, multi-dimensional evaluation of a user's prompt
    against a given problem using the best available OpenAI model.
    """
    formatted_eval_prompt = COMPREHENSIVE_EVALUATION_PROMPT.format(
        problem=problem,
        user_prompt=user_prompt,
    )

    messages = [
        {
            "role": "system",
            "content": (
                "You are a world-class prompt engineering evaluator. "
                "You always return a single, valid JSON object with no surrounding text or markdown. "
                "You score with high variance — avoid clustering scores between 65–80. "
                "Use the full 0–100 range based on evidence."
            ),
        },
        {"role": "user", "content": formatted_eval_prompt},
    ]

    content = None
    try:
        content = _call_with_fallback(EVAL_MODEL_CHAIN, messages, temperature=0.2, max_tokens=2500)
        raw_json = _extract_json(content)
        evaluation = json.loads(raw_json)
        return _validate_and_fill_eval(evaluation, user_prompt)

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error: {e}\nRaw content:\n{content}")
        raise Exception(f"Failed to parse model response as JSON: {e}")
    except Exception as e:
        logger.error(f"Evaluation error: {e}")
        raise Exception(f"Evaluation pipeline error: {e}")