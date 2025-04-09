from flask import Flask, render_template
from newsapi.newsapi_client import NewsApiClient  # Correct import
import re

app = Flask(__name__)
newsapi = NewsApiClient(api_key='6d1d6e73a1134ce59ba497f77e632236')

def clean_text(text):
    """Handle None input and clean text"""
    if text is None:
        return ""
    text = re.sub(r'<.*?>', '', text)  # Fix regex pattern
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


@app.route('/')
def index():
    try:
        # Get news from multiple categories
        categories = ['business', 'technology', 'entertainment', 'science', 'health']
        all_articles = []

        for category in categories:
            news = newsapi.get_top_headlines(
                category=category,
                language='en',
                country='us',
                page_size=100,  # Max per category
                page=1
            )
            all_articles.extend(news.get('articles', []))

        # Process articles
        processed = []
        for article in all_articles[:100]:  # Limit to 100 articles
            content = clean_text(article.get('content') or article.get('description'))
            if content:
                processed.append({
                    'title': article['title'],
                    'url': article['url'],
                    'content': content,
                })

        return render_template('index.html', articles=processed)

    except Exception as e:
        print(f"Error fetching news: {e}")
        return render_template('error.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
