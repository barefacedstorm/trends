from flask import Flask, render_template
from newsapi.newsapi_client import NewsApiClient
import re
import os
import json
import time
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
newsapi = NewsApiClient(api_key=os.getenv('NEWS_API_KEY'))

# Cache configuration
CACHE_DURATION = 12 * 60 * 60  # 12 hours in seconds
CACHE_FILE = os.path.join(app.instance_path, 'news_cache.json')

def clean_text(text):
    """Handle None input and clean text"""
    if text is None:
        return ""
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def get_cached_news():
    """Retrieve cached news if valid"""
    try:
        if os.path.exists(CACHE_FILE):
            file_age = time.time() - os.path.getmtime(CACHE_FILE)
            if file_age < CACHE_DURATION:
                with open(CACHE_FILE, 'r') as f:
                    cache_data = json.load(f)
                    return cache_data['articles']
    except (json.JSONDecodeError, KeyError, FileNotFoundError) as e:
        print(f"Cache error: {e}")
    return None

def save_news_cache(articles):
    """Store news data with timestamp"""
    try:
        os.makedirs(os.path.dirname(CACHE_FILE), exist_ok=True)
        cache_data = {
            'timestamp': time.time(),
            'articles': articles
        }
        with open(CACHE_FILE, 'w') as f:
            json.dump(cache_data, f)
    except IOError as e:
        print(f"Failed to save cache: {e}")

@app.route('/')
def index():
    try:
        # Check cache first
        cached_articles = get_cached_news()
        if cached_articles:
            return render_template('index.html', articles=cached_articles)

        # Cache miss - fetch fresh data
        categories = ['business', 'technology', 'entertainment', 'science', 'health']
        all_articles = []

        for category in categories:
            news = newsapi.get_top_headlines(
                category=category,
                language='en',
                country='us',
                page_size=100,
                page=1
            )
            all_articles.extend(news.get('articles', []))

        processed = []
        for article in all_articles[:100]:
            content = clean_text(article.get('content') or article.get('description'))
            if content:
                processed.append({
                    'title': article['title'],
                    'url': article['url'],
                    'content': content,
                })

        # Save to cache
        if processed:
            save_news_cache(processed)

        return render_template('index.html', articles=processed)

    except Exception as e:
        print(f"Error fetching news: {e}")
        return render_template('error.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
