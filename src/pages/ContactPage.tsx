
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

const ContactPage = () => {
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-card border border-border">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Construction className="w-16 h-16 text-primary" />
              </div>
              <CardTitle className="text-3xl font-playfair font-bold text-foreground">
                Under Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground mb-6">
                We're currently updating our contact page to serve you better. Please check back soon!
              </p>
              <p className="text-muted-foreground">
                In the meantime, you can continue browsing our latest news articles.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
