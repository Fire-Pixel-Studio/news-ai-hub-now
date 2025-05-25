
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NewsArticle, rssService } from '@/services/rssService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TrendingNews = () => {
  const [trendingArticles, setTrendingArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    const loadTrendingNews = async () => {
      try {
        const articles = await rssService.fetchArticles();
        setTrendingArticles(articles.slice(0, 3));
      } catch (error) {
        console.error('Error loading trending news:', error);
      }
    };

    loadTrendingNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="text-lg font-playfair">Trending News</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {trendingArticles.map((article, index) => (
          <Link
            key={article.id}
            to={`/article/${encodeURIComponent(article.id)}`}
            className="flex space-x-3 group"
          >
            <div className="flex-shrink-0">
              <img
                src={article.image}
                alt={article.title}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&h=100&fit=crop';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="bg-primary text-white text-xs px-2 py-1 rounded font-bold">
                  {index + 1}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(article.pubDate)}
                </span>
              </div>
              <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                {article.title}
              </h4>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

export default TrendingNews;
