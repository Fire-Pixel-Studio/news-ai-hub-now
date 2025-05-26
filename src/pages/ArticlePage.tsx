import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { NewsArticle, rssService } from '@/services/rssService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { theme } = useTheme();

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      await rssService.fetchArticles();
      
      const decodedId = decodeURIComponent(id);
      const foundArticle = rssService.getArticleById(decodedId);
      
      if (foundArticle) {
        setArticle(foundArticle);
        
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getThemeAnimations = () => {
    if (theme === 'night-sky' || theme === 'dark' || theme.includes('dark')) {
      return (
        <>
          <div className="stars"></div>
          <div className="stars2"></div>
          <div className="stars3"></div>
        </>
      );
    }
    
    if (theme === 'day-sky') {
      return <div className="clouds"></div>;
    }
    
    if (theme === 'solar-system') {
      return <div className="planets"></div>;
    }
    
    if (theme === 'galaxy') {
      return (
        <>
          <div className="stars"></div>
          <div className="stars2"></div>
          <div className="stars3"></div>
          <div className="galaxy-spiral"></div>
        </>
      );
    }
    
    return (
      <>
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          {getThemeAnimations()}
        </div>
        <Header onSearch={handleSearch} />
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          {getThemeAnimations()}
        </div>
        <Header onSearch={handleSearch} />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="text-center">
            <h1 className="text-2xl font-playfair font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-4">The requested article could not be found.</p>
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        {getThemeAnimations()}
      </div>
      
      <Header onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <article className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" className="hover:bg-accent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to News
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            {article.category && (
              <Badge variant="secondary" className="mb-4 bg-primary text-primary-foreground">
                {article.category}
              </Badge>
            )}
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <time>{formatDate(article.pubDate)}</time>
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
            <div className="text-foreground leading-relaxed whitespace-pre-line text-lg">
              {article.description}
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-playfair font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard 
                  key={relatedArticle.id} 
                  article={relatedArticle} 
                  onRelatedClick={scrollToTop}
                />
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
