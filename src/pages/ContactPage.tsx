
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ContactPage = () => {
  const { theme } = useTheme();

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        {getThemeAnimations()}
      </div>
      
      <Header onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-card border border-border">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Construction className="w-16 h-16 text-primary" />
              </div>
              <CardTitle className="text-3xl font-playfair font-bold text-foreground">
                Page Under Update
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
