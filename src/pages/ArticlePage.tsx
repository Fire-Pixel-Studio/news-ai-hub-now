
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Facebook, X, Linkedin } from 'lucide-react';
import { NewsArticle, rssService } from '@/services/rssService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      // First, ensure articles are loaded
      await rssService.fetchArticles();
      
      // Get the specific article
      const decodedId = decodeURIComponent(id);
      const foundArticle = rssService.getArticleById(decodedId);
      
      if (foundArticle) {
        setArticle(foundArticle);
        
        // Get related articles
        const related = rssService.getRelatedArticles(foundArticle, 3);
        setRelatedArticles(related);
      } else {
        toast({
          title: "Article Not Found",
          description: "The requested article could not be found.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading article:', error);
      toast({
        title: "Error",
        description: "Failed to load the article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    // Handle search from header
    console.log('Search query:', query);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const shareArticle = (platform: string) => {
    if (!article) return;
    
    const url = window.location.href;
    const title = article.title;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={handleSearch} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={handleSearch} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-playfair font-bold mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-4">The requested article could not be found.</p>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" className="hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to News
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            {article.category && (
              <Badge variant="secondary" className="mb-4 bg-primary text-white">
                {article.category}
              </Badge>
            )}
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              <span className="font-medium">{article.source}</span>
              <span>•</span>
              <time>{formatDate(article.pubDate)}</time>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center space-x-4 mb-8">
              <span className="text-sm font-medium text-gray-600">Share:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareArticle('facebook')}
                className="hover:bg-blue-50 hover:border-blue-200"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareArticle('twitter')}
                className="hover:bg-gray-50 hover:border-gray-300"
              >
                <X className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareArticle('linkedin')}
                className="hover:bg-blue-50 hover:border-blue-200"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
            </div>
          </header>

          {/* Featured Image */}
          {article.image && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop';
                }}
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {article.description}
            </div>
            
            {article.link && article.link !== '#' && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-2">Read the full article at the source:</p>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  {article.link}
                </a>
              </div>
            )}
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-playfair font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard key={relatedArticle.id} article={relatedArticle} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ArticlePage;
