import requests
import random
from ..config import settings

def fetch_real_world_problem():
    problems = [
        {
            "problem_text": "E-commerce platforms struggle with high cart abandonment rates (70%+). Customers add items but don't complete purchases. Design an AI system to reduce cart abandonment by understanding user behavior, sending personalized reminders, and optimizing the checkout experience.",
            "source": "E-commerce Industry Report"
        },
        {
            "problem_text": "Healthcare providers face challenges in early disease detection from medical imaging. Radiologists review thousands of scans daily, risking missed diagnoses. Create an AI solution for automated medical image analysis that assists doctors in detecting anomalies with high accuracy.",
            "source": "Healthcare Technology"
        },
        {
            "problem_text": "Educational institutions need personalized learning experiences for diverse student needs. Traditional one-size-fits-all approaches fail to engage students effectively. Build an AI system that adapts content difficulty, pace, and teaching style based on individual student performance and learning patterns.",
            "source": "Education Technology"
        },
        {
            "problem_text": "Supply chain disruptions cost companies billions annually. Unpredictable delays in manufacturing, shipping, and logistics create inventory issues. Develop an AI monitoring system that predicts supply chain disruptions using real-time data from multiple sources and recommends proactive solutions.",
            "source": "Supply Chain Management"
        },
        {
            "problem_text": "Customer support teams are overwhelmed with repetitive queries, leading to long wait times and frustrated customers. Create an intelligent chatbot system that handles common questions, escalates complex issues to humans, and continuously learns from interactions to improve response quality.",
            "source": "Customer Service Industry"
        },
        {
            "problem_text": "Financial institutions struggle to detect fraudulent transactions in real-time among millions of daily transactions. Traditional rule-based systems generate too many false positives. Design an AI fraud detection system that accurately identifies suspicious patterns while minimizing false alarms.",
            "source": "Financial Technology"
        },
        {
            "problem_text": "Urban areas face severe traffic congestion, wasting time and fuel while increasing emissions. Current traffic light systems use fixed timings that don't adapt to real-time conditions. Build an AI traffic management system that optimizes signal timings based on live traffic data and predicted patterns.",
            "source": "Smart Cities Initiative"
        },
        {
            "problem_text": "Content creators spend hours writing social media posts, email newsletters, and blog articles. Maintaining consistent quality and brand voice across platforms is challenging. Create an AI content generation assistant that produces platform-specific content while maintaining brand consistency and engaging audiences.",
            "source": "Digital Marketing"
        }
    ]
    
    try:
        if settings.NEWS_API_KEY:
            news_url = f"https://newsapi.org/v2/top-headlines?category=technology&apiKey={settings.NEWS_API_KEY}"
            response = requests.get(news_url, timeout=5)
            
            if response.status_code == 200:
                articles = response.json().get("articles", [])
                if articles:
                    article = random.choice(articles[:5])
                    return {
                        "problem_text": f"Based on recent news: {article['title']}. {article.get('description', '')} Design an AI solution to address challenges or opportunities related to this development.",
                        "source": f"News API - {article['source']['name']}"
                    }
    except:
        pass
    
    return random.choice(problems)
