from openai import OpenAI
from ..config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def generate_prompt_from_idea(idea: str) -> str:
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": """You are an expert prompt engineer. Given a user's idea, generate a professional, comprehensive prompt that includes:

1. **Role Definition**: Define the AI's role/persona
2. **Clear Task**: Specify exactly what needs to be done
3. **Constraints**: List limitations, requirements, and boundaries
4. **Output Format**: Describe the expected output structure
5. **Evaluation Criteria**: How success will be measured
6. **Optimization Instructions**: Guidelines for best performance

Create a well-structured, detailed prompt that maximizes the chance of getting high-quality AI output."""
                },
                {
                    "role": "user",
                    "content": f"Generate a professional prompt for this idea: {idea}"
                }
            ],
            temperature=0.7,
            max_tokens=800
        )
        
        generated_prompt = response.choices[0].message.content.strip()
        return generated_prompt
        
    except Exception as e:
        raise Exception(f"Prompt generation error: {str(e)}")
