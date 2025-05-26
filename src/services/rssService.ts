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
    // Technology
    'https://techcrunch.com/feed/',
    'https://www.theverge.com/rss/index.xml',
    'https://www.wired.com/feed/rss',
    'https://www.engadget.com/rss.xml',
    
    // Business (20 Feeds)
    'https://www.cnbc.com/id/10001147/device/rss/rss.html',
    'https://www.forbes.com/business/feed/',
    'http://feeds.reuters.com/reuters/businessNews',
    'https://www.ft.com/?format=rss',
    'https://www.bloomberg.com/feed/podcast/etf-report.xml',
    'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',
    'https://www.businessinsider.com/rss',
    'https://www.marketwatch.com/rss/topstories',
    'https://hbr.org/rss',
    'https://www.economist.com/latest/rss.xml',
    'https://www.inc.com/rss',
    'https://www.entrepreneur.com/rss',
    'https://www.fastcompany.com/rss',
    'https://smallbiztrends.com/feed',
    'https://www.investopedia.com/feedbuilder/feed',
    'https://finance.yahoo.com/news/rssindex',
    'https://seekingalpha.com/feed.xml',
    'https://www.morningstar.com/rss',
    'https://www.kiplinger.com/rss',
    'https://www.npr.org/rss/rss.php?id=1006',
    
    // Sports (20 Feeds)
    'https://www.espn.com/espn/rss/news',
    'http://feeds.bbci.co.uk/sport/rss.xml?edition=uk',
    'https://www.si.com/rss/si_topstories.rss',
    'https://www.skysports.com/rss/12040',
    'https://www.cbssports.com/xml/rss',
    'https://www.foxsports.com/rss-feeds',
    'https://bleacherreport.com/articles/feed',
    'https://scores.nbcsports.com/rss/headlines.asp',
    'https://sports.yahoo.com/rss/',
    'https://theathletic.com/rss',
    'https://deadspin.com/rss',
    'https://www.sportingnews.com/us/rss',
    'https://rssfeeds.usatoday.com/UsatodaycomSports-TopStories',
    'https://www.npr.org/rss/rss.php?id=1055',
    'https://www.sbnation.com/rss/index.xml',
    'https://www.goal.com/en-us/feeds/news?fmt=rss',
    'https://www.mlb.com/feeds/news/rss.xml',
    'https://www.nba.com/rss/nba_rss.xml',
    'https://www.nfl.com/rss/rsslanding?searchString=home',
    'https://www.nhl.com/rss/news.xml',
    
    // Health (20 Feeds)
    'https://www.medicalnewstoday.com/rss',
    'https://www.webmd.com/rss/news_breaking.xml',
    'https://www.npr.org/rss/rss.php?id=1128',
    'https://www.health.com/feed',
    'https://www.medicinenet.com/rss_feeds_and_news_syndication/info.htm',
    'https://www.sciencedaily.com/rss/health_medicine.xml',
    'https://newsnetwork.mayoclinic.org/feed/',
    'https://tools.cdc.gov/api/v2/resources/media/403372.rss',
    'https://www.who.int/feeds/entity/mediacentre/news/en/rss.xml',
    'https://www.nih.gov/news-events/news-releases/rss.xml',
    'https://www.health.harvard.edu/blog/feed',
    'https://www.hopkinsmedicine.org/news/rss',
    'https://health.clevelandclinic.org/feed/',
    'https://www.everydayhealth.com/rss.xml',
    'https://www.psychologytoday.com/us/rss',
    'https://medicalxpress.com/rss-feed/',
    'https://www.healthline.com/rss',
    'https://pubmed.ncbi.nlm.nih.gov/rss/',
    'https://www.medscape.com/rss/public',
    'https://khn.org/rss/',
    
    // Games (20 Feeds)
    'https://kotaku.com/rss',
    'https://www.polygon.com/rss/index.xml',
    'https://feeds.feedburner.com/IGNAll',
    'https://www.gamespot.com/feeds/news/',
    'https://www.pcgamer.com/rss/',
    'https://www.eurogamer.net/?format=rss',
    'https://www.rockpapershotgun.com/feed',
    'https://www.destructoid.com/rss.xml',
    'https://www.gameinformer.com/rss.xml',
    'https://www.nintendolife.com/feeds/news',
    'https://blog.us.playstation.com/feed/',
    'https://news.xbox.com/en-us/feed/',
    'https://store.steampowered.com/feeds/news.xml',
    'https://www.gamasutra.com/rss/',
    'https://www.metacritic.com/rss/games',
    'https://gamerant.com/feed/',
    'https://www.vg247.com/feed/',
    'https://www.gamerevolution.com/feed',
    'https://www.gamezone.com/feed/',
    'https://www.hardcoregamer.com/feed/',
    
    // World News (20 Feeds)
    'http://feeds.bbci.co.uk/news/world/rss.xml',
    'http://rss.cnn.com/rss/edition_world.rss',
    'https://www.theguardian.com/world/rss',
    'https://www.aljazeera.com/xml/rss/all.xml',
    'http://feeds.reuters.com/Reuters/worldNews',
    'https://www.npr.org/rss/rss.php?id=1004',
    'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    'http://feeds.washingtonpost.com/rss/world',
    'https://rss.dw.com/rdf/rss-en-all',
    'https://www.france24.com/en/rss',
    'https://www.voanews.com/rss',
    'https://abcnews.go.com/abcnews/internationalheadlines',
    'https://www.cbc.ca/cmlink/rss-world',
    'https://feeds.skynews.com/feeds/rss/world.xml',
    'https://www.thetimes.co.uk/world/rss',
    'https://www.telegraph.co.uk/news/worldnews/rss.xml',
    'https://time.com/feed/',
    'https://www.bloomberg.com/feed/podcast/world-news.xml',
    'https://www.ft.com/world?format=rss',
    'https://www.economist.com/international/rss.xml'
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
              const newsImages = [
                'photo-1504711434969-e33886168f5c',
                'photo-1586953208448-b95a79798f07',
                'photo-1495020689067-958852a7765e',
                'photo-1594736797933-d0e501ba2fe6',
                'photo-1507003211169-0a1dd7228f2d',
                'photo-1518709268805-4e9042af2176',
                'photo-1569163139394-de4e5f43e4e3',
                'photo-1559757148-5c350d0d3c56'
              ];
              const randomImage = newsImages[(index + allArticles.length) % newsImages.length];
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
