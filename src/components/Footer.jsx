import React from 'react';
import { Sprout, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-green-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Sprout className="h-8 w-8 text-green-300" />
              <span className="text-xl font-bold">AgriMart</span>
            </div>
            <p className="text-green-200 mb-4">
              Your trusted partner for all agricultural needs. Quality products, 
              competitive prices, and reliable service
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-green-200 hover:text-white transition-colors">Home</a></li>
              <li><a href="/category/seeds-fertilizers" className="text-green-200 hover:text-white transition-colors">Seeds & Fertilizers</a></li>
              <li><a href="/category/fresh-produce" className="text-green-200 hover:text-white transition-colors">Vegetables</a></li>
              <li><a href="/category/machinery" className="text-green-200 hover:text-white transition-colors">Fruits</a></li>
              <li><a href="/category/livestock" className="text-green-200 hover:text-white transition-colors">Dairy </a></li>
              <li><a href="/category/machinery" className="text-green-200 hover:text-white transition-colors">Machinery</a></li>
              

            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><a href="/contact" className="text-green-200 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/shipping" className="text-green-200 hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="/returns" className="text-green-200 hover:text-white transition-colors">Returns Policy</a></li>
              <li><a href="/faq" className="text-green-200 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-300" />
                <span className="text-green-200">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-green-300" />
                <span className="text-green-200">support@agrimart.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-green-300" />
                <span className="text-green-200">AgriMart HQ
                123 Green Lane, Coimbatore, Tamil Nadu, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-green-800 mt-8 pt-8 text-center">
          <p className="text-green-200">
            © 2024 AgriMart. All rights reserved. | Built for agricultural excellence.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;