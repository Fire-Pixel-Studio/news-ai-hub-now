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
    // Technology (Working feeds only)
    'https://techcrunch.com/feed/',
    'https://www.theverge.com/rss/index.xml',
    'https://www.wired.com/feed/rss',
    'https://www.engadget.com/rss.xml',
    
    // Business (Reduced to working feeds)
    'https://www.cnbc.com/id/10001147/device/rss/rss.html',
    'https://www.businessinsider.com/rss',
    'https://www.marketwatch.com/rss/topstories',
    'https://finance.yahoo.com/news/rssindex',
    'https://www.npr.org/rss/rss.php?id=1006',
    
    // Sports (Reduced to working feeds)
    'https://www.espn.com/espn/rss/news',
    'https://www.si.com/rss/si_topstories.rss',
    'https://www.cbssports.com/xml/rss',
    'https://sports.yahoo.com/rss/',
    'https://rssfeeds.usatoday.com/UsatodaycomSports-TopStories',
    'https://www.npr.org/rss/rss.php?id=1055',
    
    // Health (Reduced to working feeds)
    'https://www.medicalnewstoday.com/rss',
    'https://www.webmd.com/rss/news_breaking.xml',
    'https://www.npr.org/rss/rss.php?id=1128',
    'https://www.health.com/feed',
    'https://www.sciencedaily.com/rss/health_medicine.xml',
    'https://newsnetwork.mayoclinic.org/feed/',
    
    // Games (Reduced to working feeds)  
    'https://www.polygon.com/rss/index.xml',
    'https://www.gamespot.com/feeds/news/',
    'https://www.pcgamer.com/rss/',
    'https://www.nintendolife.com/feeds/news',
    'https://gamerant.com/feed/',
    
    // World News (Reduced to working feeds)
    'https://www.theguardian.com/world/rss',
    'https://www.npr.org/rss/rss.php?id=1004',
    'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    'https://www.france24.com/en/rss',
    'https://time.com/feed/'
  ];
  
  private articles: NewsArticle[] = [];
  private lastFetched: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_ARTICLES = 1999;

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
          
          const feedArticles = await Promise.all(Array.from(items).map(async (item, index) => {
            const title = item.querySelector('title')?.textContent || 'Untitled';
            const description = item.querySelector('description')?.textContent || '';
            const link = item.querySelector('link')?.textContent || '';
            const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
            
            let image = this.extractImageFromDescription(description);
            if (!image) {
              // Use a more diverse set of high-quality images
              const newsImages = [
                'photo-1504711434969-e33886168f5c', // newspaper
                'photo-1586953208448-b95a79798f07', // business meeting
                'photo-1495020689067-958852a7765e', // newspaper stack
                'photo-1594736797933-d0e501ba2fe6', // typing
                'photo-1507003211169-0a1dd7228f2d', // laptop news
                'photo-1518709268805-4e9042af2176', // technology
                'photo-1569163139394-de4e5f43e4e3', // breaking news
                'photo-1559757148-5c350d0d3c56', // medical
                'photo-1571019613454-1cb2f99b2d8b', // sports stadium
                'photo-1560472355-536de3962603', // business chart
                'photo-1581833971358-2c8b550f87b3', // world globe
                'photo-1522202176988-66273c2fd55f', // gaming setup
                'photo-1551434678-e076c223a692', // business team
                'photo-1519389950473-47ba0277781c', // technology workspace
                'photo-1434030216411-0b793f4b4173', // conference
                'photo-1563013544-824ae1b704d3', // health and wellness
                'photo-1552664730-d307ca884978', // sports action
                'photo-1590935216405-65082d4c0f05', // gaming controller
                'photo-1444653389962-8149286c578a', // world news
                'photo-1573164713714-d95e436ab8d6' // technology innovation
              ];
              const randomImage = newsImages[(allArticles.length + index) % newsImages.length];
              image = `https://images.unsplash.com/${randomImage}?w=800&h=400&fit=crop`;
            }
            
            const category = this.inferCategory(title + ' ' + description);
            
            const baseContent = this.stripHtml(description);
            
            return {
              id: `article-${allArticles.length + index}-${Date.now()}`,
              title,
              description: baseContent,
              link,
              pubDate,
              image,
              category
            };
          }));
          
          allArticles.push(...feedArticles);
        } catch (error) {
          console.error(`Error fetching feed ${feedUrl}:`, error);
        }
      }
      
      // Merge with existing articles to maintain history
      const existingArticles = this.articles.filter(article => 
        !allArticles.some(newArticle => newArticle.link === article.link)
      );
      
      const mergedArticles = [...allArticles, ...existingArticles];
      
      // Sort by publication date (newest first)
      mergedArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
      
      // Keep only the latest 1999 articles
      this.articles = mergedArticles.slice(0, this.MAX_ARTICLES);
      this.lastFetched = now;
      
      console.log(`Successfully managed ${this.articles.length} articles (max: ${this.MAX_ARTICLES})`);
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
    
    if (lowerText.includes('game') || lowerText.includes('gaming') || lowerText.includes('xbox') || lowerText.includes('playstation') || lowerText.includes('nintendo') || lowerText.includes('esports') || lowerText.includes('video game') || lowerText.includes('pc gaming') || lowerText.includes('steam')) {
      return 'Games';
    } else if (lowerText.includes('world') || lowerText.includes('international') || lowerText.includes('global') || lowerText.includes('country') || lowerText.includes('nation') || lowerText.includes('war') || lowerText.includes('conflict') || lowerText.includes('diplomacy') || lowerText.includes('politics')) {
      return 'World News';
    } else if (lowerText.includes('tech') || lowerText.includes('ai') || lowerText.includes('software') || lowerText.includes('digital') || lowerText.includes('computer') || lowerText.includes('internet') || lowerText.includes('cyber') || lowerText.includes('innovation') || lowerText.includes('startup')) {
      return 'Technology';
    } else if (lowerText.includes('sport') || lowerText.includes('football') || lowerText.includes('basketball') || lowerText.includes('soccer') || lowerText.includes('team') || lowerText.includes('player') || lowerText.includes('match') || lowerText.includes('championship') || lowerText.includes('league')) {
      return 'Sports';
    } else if (lowerText.includes('business') || lowerText.includes('economy') || lowerText.includes('market') || lowerText.includes('finance') || lowerText.includes('company') || lowerText.includes('stock') || lowerText.includes('trade') || lowerText.includes('investment') || lowerText.includes('revenue') || lowerText.includes('profit')) {
      return 'Business';
    } else if (lowerText.includes('health') || lowerText.includes('medical') || lowerText.includes('wellness') || lowerText.includes('hospital') || lowerText.includes('doctor') || lowerText.includes('medicine') || lowerText.includes('fitness') || lowerText.includes('treatment') || lowerText.includes('disease') || lowerText.includes('vaccine')) {
      return 'Health';
    }
    
    return 'Home';
  }

  private getDemoArticles(): NewsArticle[] {
    return [
      {
        id: 'demo-1',
        title: 'Breaking: Major Technology Breakthrough Announced',
        description: 'Scientists have announced a revolutionary breakthrough in quantum computing that could transform the technology industry. This groundbreaking development represents years of research and collaboration between leading institutions worldwide. The implications for computing power, cryptography, and data processing are expected to be transformative across multiple industries.',
        link: '#',
        pubDate: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
        category: 'Technology'
      },
      {
        id: 'demo-2',
        title: 'Global Business Markets Show Strong Growth',
        description: 'International markets have shown unprecedented growth this quarter, with technology stocks leading the surge. Economic indicators suggest sustained momentum as investor confidence reaches new highs. The robust performance spans multiple sectors and geographic regions, indicating broad-based economic strength.',
        link: '#',
        pubDate: new Date(Date.now() - 3600000).toISOString(),
        image: 'https://images.unsplash.com/photo-1569163139394-de4e5f43e4e3?w=800&h=400&fit=crop',
        category: 'Business'
      },
      {
        id: 'demo-3',
        title: 'New Medical Research Shows Promising Results',
        description: 'Latest medical research reveals breakthrough treatments for various conditions, offering hope to millions of patients worldwide. The clinical trials have demonstrated remarkable efficacy and safety profiles, positioning these treatments for accelerated regulatory review and potential approval.',
        link: '#',
        pubDate: new Date(Date.now() - 7200000).toISOString(),
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
        category: 'Health'
      }
    ];
  }

  getCategories(): string[] {
    return ['Home', 'Technology', 'Business', 'Sports', 'Health', 'Games', 'World News'];
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
