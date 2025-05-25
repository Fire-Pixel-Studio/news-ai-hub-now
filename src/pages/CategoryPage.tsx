
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NewsArticle, rssService } from '@/services/rssService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import TrendingNews from '@/components/TrendingNews';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [displayedArticles, setDisplayedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [articlesPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    loadCategoryArticles();
  }, [category]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDisplayedArticles(filtered.slice(0, articlesPerPage));
      setCurrentPage(1);
    } else {
      setDisplayedArticles(articles.slice(0, articlesPerPage));
      setCurrentPage(1);
    }
  }, [searchQuery, articles, articlesPerPage]);

  const loadCategoryArticles = async () => {
    if (!category) return;

    try {
      setLoading(true);
      
      // Fetch all articles first
      await rssService.fetchArticles();
      
      // Filter by category
      const categoryArticles = rssService.getArticlesByCategory(category);
      setArticles(categoryArticles);
      setDisplayedArticles(categoryArticles.slice(0, articlesPerPage));
      
      if (categoryArticles.length === 0) {
        toast({
          title: "No Articles Found",
          description: `No articles found in the ${category} category.`,
        });
      }
    } catch (error) {
      console.error('Error loading category articles:', error);
      toast({
        title: "Error",
        description: "Failed to load articles. Please try again.",
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
      const filteredArticles = searchQuery 
        ? articles.filter(article =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : articles;
      
      const newDisplayedArticles = filteredArticles.slice(startIndex, endIndex);
      
      setDisplayedArticles(newDisplayedArticles);
      setCurrentPage(nextPage);
      setLoadingMore(false);
    }, 500);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const hasMoreArticles = () => {
    const filteredArticles = searchQuery 
      ? articles.filter(article =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : articles;
    
    return displayedArticles.length < filteredArticles.length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={handleSearch} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading {category} articles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <Badge variant="secondary" className="text-lg px-4 py-2 bg-primary text-white">
                  {category}
                </Badge>
                <span className="text-gray-600">
                  {articles.length} article{articles.length !== 1 ? 's' : ''}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-playfair font-bold">
                {category} News
              </h1>
              {searchQuery && (
                <p className="text-gray-600 mt-2">
                  Search results for "{searchQuery}" in {category}
                </p>
              )}
            </div>

            {/* Articles Grid */}
            {displayedArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  {searchQuery 
                    ? `No articles found for "${searchQuery}" in ${category}.`
                    : `No articles available in the ${category} category at the moment.`
                  }
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {displayedArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMoreArticles() && (
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
              </>
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

export default CategoryPage;
