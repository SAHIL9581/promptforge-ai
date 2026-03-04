import requests
import random
from ..config import settings


def fetch_real_world_problem():
    """Fetches REAL problems from internet sources"""
    
    # Try News API first (Technology news)
    try:
        if settings.NEWS_API_KEY:
            news_url = f"https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=20&apiKey={settings.NEWS_API_KEY}"
            response = requests.get(news_url, timeout=10)
            
            if response.status_code == 200:
                articles = response.json().get("articles", [])
                
                if articles:
                    # Filter for quality articles
                    quality_articles = [
                        a for a in articles 
                        if a.get('description') and len(a.get('description', '')) > 50
                    ]
                    
                    if quality_articles:
                        article = random.choice(quality_articles[:10])
                        
                        # Extract problem from article
                        title = article.get('title', 'Technology Challenge')
                        description = article.get('description', '')
                        content = article.get('content', '')[:200] if article.get('content') else description
                        source_name = article.get('source', {}).get('name', 'News Source')
                        url = article.get('url', '')
                        
                        # Generate structured problem from news
                        return {
                            "title": f"Real-World Challenge: {title[:60]}",
                            "context": f"Based on recent {source_name} technology news",
                            "scenario": f"{title}. {description} {content}. Design an AI-powered system to address the challenges, opportunities, or implications mentioned in this development.",
                            "requirements": [
                                "Analyze the problem domain from the news context",
                                "Propose an AI/ML solution approach",
                                "Define key features and capabilities needed",
                                "Consider real-world scalability and deployment",
                                "Address potential ethical or societal implications"
                            ],
                            "constraints": [
                                "Use currently available technology and methods",
                                "Solution must be implementable within 6-12 months",
                                "Consider data privacy and security requirements",
                                "Budget-conscious and resource-efficient approach"
                            ],
                            "example_input": f"Current situation: {description[:100]}",
                            "example_output": "Proposed AI solution with architecture, key components, expected benefits, and implementation roadmap",
                            "difficulty": "Medium",
                            "source": f"{source_name} ({url})"
                        }
    except Exception as e:
        print(f"News API error: {str(e)}")
    
    # Try HackerNews API as backup
    try:
        hn_url = "https://hacker-news.firebaseio.com/v0/topstories.json"
        response = requests.get(hn_url, timeout=10)
        
        if response.status_code == 200:
            story_ids = response.json()[:30]  # Get top 30 stories
            
            # Pick a random story
            story_id = random.choice(story_ids)
            story_url = f"https://hacker-news.firebaseio.com/v0/item/{story_id}.json"
            story_response = requests.get(story_url, timeout=5)
            
            if story_response.status_code == 200:
                story = story_response.json()
                
                if story.get('title'):
                    title = story.get('title', 'Tech Challenge')
                    story_link = story.get('url', f"https://news.ycombinator.com/item?id={story_id}")
                    
                    return {
                        "title": f"HackerNews Challenge: {title[:60]}",
                        "context": "From HackerNews trending technology discussions",
                        "scenario": f"{title}. This is a real problem being discussed in the tech community. Design an innovative AI solution to address this challenge or opportunity.",
                        "requirements": [
                            "Research and understand the problem domain",
                            "Design an AI/ML-powered solution",
                            "Define technical architecture and components",
                            "Plan for scalability and performance",
                            "Consider user experience and adoption"
                        ],
                        "constraints": [
                            "Must be technically feasible with current AI/ML tools",
                            "Cost-effective implementation",
                            "Address privacy and security concerns",
                            "Scalable to production-level usage"
                        ],
                        "example_input": f"Problem context from tech community discussion",
                        "example_output": "Complete AI solution design with implementation plan",
                        "difficulty": "Hard",
                        "source": f"HackerNews ({story_link})"
                    }
    except Exception as e:
        print(f"HackerNews API error: {str(e)}")
    
    # Try Reddit Technology as third option
    try:
        reddit_url = "https://www.reddit.com/r/technology/hot.json?limit=20"
        headers = {'User-Agent': 'PromptForge-AI/1.0'}
        response = requests.get(reddit_url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            posts = response.json().get('data', {}).get('children', [])
            
            if posts:
                # Filter quality posts
                quality_posts = [
                    p for p in posts 
                    if p.get('data', {}).get('selftext') or p.get('data', {}).get('title')
                ]
                
                if quality_posts:
                    post_data = random.choice(quality_posts).get('data', {})
                    title = post_data.get('title', 'Technology Challenge')
                    selftext = post_data.get('selftext', '')[:300]
                    post_url = f"https://reddit.com{post_data.get('permalink', '')}"
                    
                    return {
                        "title": f"Reddit Tech Challenge: {title[:60]}",
                        "context": "From r/Technology community discussions",
                        "scenario": f"{title}. {selftext if selftext else 'This real-world technology challenge is being discussed by the tech community. Design an AI-powered solution to address it.'}",
                        "requirements": [
                            "Understand the real-world problem context",
                            "Propose an innovative AI solution",
                            "Define system architecture and components",
                            "Consider practical deployment challenges",
                            "Address community concerns and feedback"
                        ],
                        "constraints": [
                            "Use proven AI/ML technologies",
                            "Implementable with reasonable resources",
                            "Privacy-preserving and ethical approach",
                            "Scalable and maintainable solution"
                        ],
                        "example_input": "Real-world problem scenario",
                        "example_output": "AI solution design with technical details and benefits",
                        "difficulty": "Medium",
                        "source": f"Reddit r/Technology ({post_url})"
                    }
    except Exception as e:
        print(f"Reddit API error: {str(e)}")
    
    # If ALL APIs fail, raise exception
    raise Exception(
        "Unable to fetch real-world problems from internet sources. "
        "Please check: 1) NEWS_API_KEY is set correctly, "
        "2) Internet connection is working, "
        "3) API services are accessible."
    )
