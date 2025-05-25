import { useState, useEffect } from 'react';
import { NewsArticle, rssService } from '@/services/rssService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import TrendingNews from '@/components/TrendingNews';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bot } from 'lucide-react';

const Index = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [displayedArticles, setDisplayedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [articlesPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = rssService.searchArticles(searchQuery);
      setFilteredArticles(filtered);
      setDisplayedArticles(filtered.slice(0, articlesPerPage));
      setCurrentPage(1);
    } else {
      setFilteredArticles(articles);
      setDisplayedArticles(articles.slice(0, articlesPerPage));
      setCurrentPage(1);
    }
  }, [searchQuery, articles, articlesPerPage]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const fetchedArticles = await rssService.fetchArticles();
      setArticles(fetchedArticles);
      setFilteredArticles(fetchedArticles);
      setDisplayedArticles(fetchedArticles.slice(0, articlesPerPage));
      
      toast({
        title: "News Updated",
        description: `Loaded ${fetchedArticles.length} articles successfully.`,
      });
    } catch (error) {
      console.error('Error loading articles:', error);
      toast({
        title: "Error",
        description: "Failed to load news articles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMoreArticles = () => {
    setLoadingMore(true);
    
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = 0;
      const endIndex = nextPage * articlesPerPage;
      const newDisplayedArticles = filteredArticles.slice(startIndex, endIndex);
      
      setDisplayedArticles(newDisplayedArticles);
      setCurrentPage(nextPage);
      setLoadingMore(false);
    }, 500);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const featuredArticle = filteredArticles[0];
  const regularArticles = displayedArticles.slice(1);
  const hasMoreArticles = displayedArticles.length < filteredArticles.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Starry background */}
        <div className="absolute inset-0 opacity-30">
          <div className="stars"></div>
          <div className="stars2"></div>
          <div className="stars3"></div>
        </div>
        
        <Header onSearch={handleSearch} />
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading latest news...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Starry background */}
      <div className="absolute inset-0 opacity-30">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>
      
      <Header onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* AI Disclaimer */}
        <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <Bot className="w-4 h-4" />
            <p className="text-sm opacity-80">
              Articles are automatically categorized by AI. Mistakes can happen - please verify important information.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Article Count */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Total articles: <span className="font-semibold text-foreground">{filteredArticles.length}</span>
                {searchQuery && ` (filtered for "${searchQuery}")`}
              </p>
            </div>

            {/* Search Results Header */}
            {searchQuery && (
              <div className="mb-6">
                <h2 className="text-2xl font-playfair font-bold mb-2 text-foreground">
                  Search Results for "{searchQuery}"
                </h2>
                <p className="text-muted-foreground">
                  Found {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Featured Article */}
            {featuredArticle && !searchQuery && (
              <div className="mb-8">
                <h2 className="text-2xl font-playfair font-bold mb-4 text-foreground">Featured Story</h2>
                <ArticleCard article={featuredArticle} featured={true} />
              </div>
            )}

            {/* Articles Grid */}
            <div className="mb-8">
              <h2 className="text-2xl font-playfair font-bold mb-6 text-foreground">
                {searchQuery ? 'Search Results' : 'Latest News'}
              </h2>
              
              {displayedArticles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    {searchQuery ? 'No articles found for your search.' : 'No articles available at the moment.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {(searchQuery ? displayedArticles : regularArticles).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </div>

            {/* Load More Button */}
            {hasMoreArticles && (
              <div className="text-center">
                <Button
                  onClick={loadMoreArticles}
                  disabled={loadingMore}
                  size="lg"
                  className="px-8"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    'Load More Articles'
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <TrendingNews />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
