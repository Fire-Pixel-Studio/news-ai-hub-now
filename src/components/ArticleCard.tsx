
import { Link } from 'react-router-dom';
import { NewsArticle } from '@/services/rssService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ArticleCardProps {
  article: NewsArticle;
  featured?: boolean;
}

const ArticleCard = ({ article, featured = false }: ArticleCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '...';
  };

  if (featured) {
    return (
      <Link to={`/article/${encodeURIComponent(article.id)}`}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              {article.category && (
                <Badge variant="secondary" className="mb-2 bg-primary text-white">
                  {article.category}
                </Badge>
              )}
              <h1 className="text-2xl md:text-3xl font-playfair font-bold mb-2 line-clamp-2">
                {article.title}
              </h1>
              <p className="text-gray-200 mb-2 line-clamp-2">
                {truncateText(article.description, 150)}
              </p>
              <p className="text-sm text-gray-300">
                {formatDate(article.pubDate)} • {article.source}
              </p>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/article/${encodeURIComponent(article.id)}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group h-full">
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop';
            }}
          />
          {article.category && (
            <Badge variant="secondary" className="absolute top-2 left-2 bg-primary text-white">
              {article.category}
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-playfair font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {truncateText(article.description, 120)}
          </p>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{formatDate(article.pubDate)}</span>
            <span>{article.source}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ArticleCard;
