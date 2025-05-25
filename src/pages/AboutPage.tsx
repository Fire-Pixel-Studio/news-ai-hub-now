
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const AboutPage = () => {
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
              About NewsHub
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Your go-to source for the latest news, automatically curated from trusted sources.
            </p>
          </div>

          {/* Mission Section */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-playfair font-bold mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                At NewsHub, we believe that staying informed should be simple, fast, and reliable. 
                Our mission is to provide you with the most important news stories from around the world, 
                automatically curated and presented in a clean, easy-to-read format.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We leverage advanced RSS feed technology to bring you real-time updates from trusted news sources, 
                ensuring you never miss the stories that matter most.
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-playfair font-semibold mb-3">Real-time Updates</h3>
                <p className="text-gray-600">
                  Our platform automatically refreshes content to bring you the latest news as it happens.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-playfair font-semibold mb-3">Smart Categorization</h3>
                <p className="text-gray-600">
                  Articles are intelligently categorized to help you find the topics you care about most.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-playfair font-semibold mb-3">Mobile Responsive</h3>
                <p className="text-gray-600">
                  Read news seamlessly across all your devices with our fully responsive design.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-playfair font-semibold mb-3">Easy Sharing</h3>
                <p className="text-gray-600">
                  Share important stories with your network through integrated social media buttons.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Technology Section */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-playfair font-bold mb-4">Technology</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                NewsHub is built using cutting-edge web technologies to ensure fast loading times, 
                excellent user experience, and reliable performance. Our platform is powered by:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• React and TypeScript for a robust frontend</li>
                <li>• Tailwind CSS for responsive design</li>
                <li>• RSS feed integration for real-time content</li>
                <li>• Advanced caching for optimal performance</li>
                <li>• Progressive web app capabilities</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact CTA */}
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-playfair font-bold mb-4">Get in Touch</h2>
              <p className="text-gray-700 mb-6">
                Have questions, suggestions, or feedback? We'd love to hear from you.
              </p>
              <a
                href="/contact"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Contact Us
              </a>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
