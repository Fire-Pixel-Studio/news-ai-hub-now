
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  image?: string;
  category?: string;
  source?: string;
}

class RSSService {
  private readonly RSS_URL = 'https://rss.app/feeds/nstitSYRKm5Tvcz6.xml';
  private articles: NewsArticle[] = [];
  private lastFetched: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async fetchArticles(): Promise<NewsArticle[]> {
    const now = Date.now();
    
    // Return cached articles if they're still fresh
    if (this.articles.length > 0 && (now - this.lastFetched) < this.CACHE_DURATION) {
      return this.articles;
    }

    try {
      console.log('Fetching RSS feed...');
      
      // Use a CORS proxy to fetch the RSS feed
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(this.RSS_URL)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const xmlText = data.contents;
      
      // Parse XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Check for parsing errors
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error('Failed to parse RSS XML');
      }
      
      // Extract articles from RSS items
      const items = xmlDoc.querySelectorAll('item');
      console.log(`Found ${items.length} articles in RSS feed`);
      
      this.articles = Array.from(items).map((item, index) => {
        const title = item.querySelector('title')?.textContent || 'Untitled';
        const description = item.querySelector('description')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
        
        // Try to extract image from description or use a placeholder
        let image = this.extractImageFromDescription(description);
        if (!image) {
          // Use Unsplash placeholder images for news
          const newsImages = [
            'photo-1504711434969-e33886168f5c', // newspaper
            'photo-1586953208448-b95a79798f07', // breaking news
            'photo-1495020689067-958852a7765e', // news stand
            'photo-1594736797933-d0e501ba2fe6', // newsletter
            'photo-1507003211169-0a1dd7228f2d' // news reading
          ];
          const randomImage = newsImages[index % newsImages.length];
          image = `https://images.unsplash.com/${randomImage}?w=800&h=400&fit=crop`;
        }
        
        // Try to infer category from title or description
        const category = this.inferCategory(title + ' ' + description);
        
        return {
          id: `article-${index}-${Date.now()}`,
          title,
          description: this.stripHtml(description),
          link,
          pubDate,
          image,
          category,
          source: 'RSS Feed'
        };
      });
      
      this.lastFetched = now;
      console.log(`Successfully parsed ${this.articles.length} articles`);
      return this.articles;
      
    } catch (error) {
      console.error('Error fetching RSS feed:', error);
      
      // Return demo articles if RSS fails
      if (this.articles.length === 0) {
        this.articles = this.getDemoArticles();
      }
      
      return this.articles;
    }
  }

  private extractImageFromDescription(description: string): string | null {
    // Try to find image URLs in the description
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = description.match(imgRegex);
    return match ? match[1] : null;
  }

  private stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  private inferCategory(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('tech') || lowerText.includes('ai') || lowerText.includes('software') || lowerText.includes('digital')) {
      return 'Technology';
    } else if (lowerText.includes('sport') || lowerText.includes('football') || lowerText.includes('game')) {
      return 'Sports';
    } else if (lowerText.includes('business') || lowerText.includes('economy') || lowerText.includes('market')) {
      return 'Business';
    } else if (lowerText.includes('health') || lowerText.includes('medical') || lowerText.includes('wellness')) {
      return 'Health';
    } else if (lowerText.includes('entertainment') || lowerText.includes('movie') || lowerText.includes('music')) {
      return 'Entertainment';
    } else if (lowerText.includes('politic') || lowerText.includes('government') || lowerText.includes('election')) {
      return 'Politics';
    }
    
    return 'General';
  }

  private getDemoArticles(): NewsArticle[] {
    return [
      {
        id: 'demo-1',
        title: 'Breaking: Major Technology Breakthrough Announced',
        description: 'Scientists have announced a revolutionary breakthrough in quantum computing that could transform the technology industry...',
        link: '#',
        pubDate: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
        category: 'Technology',
        source: 'Demo News'
      },
      {
        id: 'demo-2',
        title: 'Global Climate Summit Reaches Historic Agreement',
        description: 'World leaders have reached a historic agreement on climate action during the latest global summit...',
        link: '#',
        pubDate: new Date(Date.now() - 3600000).toISOString(),
        image: 'https://images.unsplash.com/photo-1569163139394-de4e5f43e4e3?w=800&h=400&fit=crop',
        category: 'Politics',
        source: 'Demo News'
      },
      {
        id: 'demo-3',
        title: 'New Medical Research Shows Promising Results',
        description: 'Latest medical research reveals breakthrough treatments for various conditions, offering hope to millions...',
        link: '#',
        pubDate: new Date(Date.now() - 7200000).toISOString(),
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
        category: 'Health',
        source: 'Demo News'
      }
    ];
  }

  getCategories(): string[] {
    const categories = [...new Set(this.articles.map(article => article.category))];
    return categories.filter(Boolean) as string[];
  }

  searchArticles(query: string): NewsArticle[] {
    const lowerQuery = query.toLowerCase();
    return this.articles.filter(article => 
      article.title.toLowerCase().includes(lowerQuery) ||
      article.description.toLowerCase().includes(lowerQuery)
    );
  }

  getArticlesByCategory(category: string): NewsArticle[] {
    return this.articles.filter(article => article.category === category);
  }

  getArticleById(id: string): NewsArticle | undefined {
    return this.articles.find(article => article.id === id);
  }

  getRelatedArticles(currentArticle: NewsArticle, limit: number = 3): NewsArticle[] {
    return this.articles
      .filter(article => 
        article.id !== currentArticle.id && 
        article.category === currentArticle.category
      )
      .slice(0, limit);
  }
}

export const rssService = new RSSService();
