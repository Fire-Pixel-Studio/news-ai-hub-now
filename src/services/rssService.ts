
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  image?: string;
  category?: string;
}

class RSSService {
  private readonly RSS_FEEDS = [
    'https://rss.app/feeds/tYeOiikyGXfWqnbe.xml',
    'https://rss.app/feeds/ByNJXo54490NwHzf.xml',
    'https://rss.app/feeds/s0vj5G7s0NNCwizk.xml',
    'https://rss.app/feeds/tezEEccrbPGZzPY1.xml',
    'https://rss.app/feeds/tup0DiNf3fuWjeOx.xml',
    'https://rss.app/feeds/tjObKSnyEeJJulnM.xml'
  ];
  
  private articles: NewsArticle[] = [];
  private lastFetched: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async fetchArticles(): Promise<NewsArticle[]> {
    const now = Date.now();
    
    if (this.articles.length > 0 && (now - this.lastFetched) < this.CACHE_DURATION) {
      return this.articles;
    }

    try {
      console.log('Fetching RSS feeds...');
      
      const allArticles: NewsArticle[] = [];
      
      for (const feedUrl of this.RSS_FEEDS) {
        try {
          const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
          const response = await fetch(proxyUrl);
          
          if (!response.ok) {
            console.warn(`Failed to fetch feed: ${feedUrl}`);
            continue;
          }
          
          const data = await response.json();
          const xmlText = data.contents;
          
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
          
          const parseError = xmlDoc.querySelector('parsererror');
          if (parseError) {
            console.warn(`Failed to parse feed: ${feedUrl}`);
            continue;
          }
          
          const items = xmlDoc.querySelectorAll('item');
          
          const feedArticles = Array.from(items).map((item, index) => {
            const title = item.querySelector('title')?.textContent || 'Untitled';
            const description = item.querySelector('description')?.textContent || '';
            const link = item.querySelector('link')?.textContent || '';
            const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
            
            let image = this.extractImageFromDescription(description);
            if (!image) {
              const newsImages = [
                'photo-1504711434969-e33886168f5c',
                'photo-1586953208448-b95a79798f07',
                'photo-1495020689067-958852a7765e',
                'photo-1594736797933-d0e501ba2fe6',
                'photo-1507003211169-0a1dd7228f2d'
              ];
              const randomImage = newsImages[(index + allArticles.length) % newsImages.length];
              image = `https://images.unsplash.com/${randomImage}?w=800&h=400&fit=crop`;
            }
            
            const category = this.inferCategory(title + ' ' + description);
            
            return {
              id: `article-${allArticles.length + index}-${Date.now()}`,
              title,
              description: this.stripHtml(description),
              link,
              pubDate,
              image,
              category
            };
          });
          
          allArticles.push(...feedArticles);
        } catch (error) {
          console.error(`Error fetching feed ${feedUrl}:`, error);
        }
      }
      
      // Sort by publication date (newest first)
      allArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
      
      this.articles = allArticles;
      this.lastFetched = now;
      console.log(`Successfully fetched ${this.articles.length} articles from ${this.RSS_FEEDS.length} feeds`);
      return this.articles;
      
    } catch (error) {
      console.error('Error fetching RSS feeds:', error);
      
      if (this.articles.length === 0) {
        this.articles = this.getDemoArticles();
      }
      
      return this.articles;
    }
  }

  private extractImageFromDescription(description: string): string | null {
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
    
    if (lowerText.includes('tech') || lowerText.includes('ai') || lowerText.includes('software') || lowerText.includes('digital') || lowerText.includes('computer') || lowerText.includes('internet')) {
      return 'Technology';
    } else if (lowerText.includes('sport') || lowerText.includes('football') || lowerText.includes('basketball') || lowerText.includes('soccer') || lowerText.includes('game') || lowerText.includes('team') || lowerText.includes('player')) {
      return 'Sports';
    } else if (lowerText.includes('business') || lowerText.includes('economy') || lowerText.includes('market') || lowerText.includes('finance') || lowerText.includes('company') || lowerText.includes('stock') || lowerText.includes('trade')) {
      return 'Business';
    } else if (lowerText.includes('health') || lowerText.includes('medical') || lowerText.includes('wellness') || lowerText.includes('hospital') || lowerText.includes('doctor') || lowerText.includes('medicine') || lowerText.includes('fitness')) {
      return 'Health';
    }
    
    return 'Home';
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
        category: 'Technology'
      },
      {
        id: 'demo-2',
        title: 'Global Business Markets Show Strong Growth',
        description: 'International markets have shown unprecedented growth this quarter, with technology stocks leading the surge...',
        link: '#',
        pubDate: new Date(Date.now() - 3600000).toISOString(),
        image: 'https://images.unsplash.com/photo-1569163139394-de4e5f43e4e3?w=800&h=400&fit=crop',
        category: 'Business'
      },
      {
        id: 'demo-3',
        title: 'New Medical Research Shows Promising Results',
        description: 'Latest medical research reveals breakthrough treatments for various conditions, offering hope to millions...',
        link: '#',
        pubDate: new Date(Date.now() - 7200000).toISOString(),
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
        category: 'Health'
      }
    ];
  }

  getCategories(): string[] {
    return ['Home', 'Technology', 'Business', 'Sports', 'Health'];
  }

  searchArticles(query: string): NewsArticle[] {
    const lowerQuery = query.toLowerCase();
    return this.articles.filter(article => 
      article.title.toLowerCase().includes(lowerQuery) ||
      article.description.toLowerCase().includes(lowerQuery)
    );
  }

  getArticlesByCategory(category: string): NewsArticle[] {
    if (category === 'Home') {
      return this.articles;
    }
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
