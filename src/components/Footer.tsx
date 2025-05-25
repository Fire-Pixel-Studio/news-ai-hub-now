
import { Link } from 'react-router-dom';
import { Facebook, X, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-playfair font-bold">NewsHub</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Articles are automatically categorized by AI. Mistakes can happen - please verify important information.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <X className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/Technology" className="text-gray-300 hover:text-primary transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/category/Business" className="text-gray-300 hover:text-primary transition-colors">
                  Business
                </Link>
              </li>
              <li>
                <Link to="/category/Sports" className="text-gray-300 hover:text-primary transition-colors">
                  Sports
                </Link>
              </li>
              <li>
                <Link to="/category/Health" className="text-gray-300 hover:text-primary transition-colors">
                  Health
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 NewsHub. All rights reserved. Built with ❤️ by Lovable AI.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
