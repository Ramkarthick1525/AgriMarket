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
              <span className="text-xl font-bold">Farm Produce Hub</span>
            </div>
            <p className="text-green-200 mb-4">
              Your trusted partner for all agricultural needs. Quality products, 
              competitive prices, and reliable service. <br />
              
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-green-200 hover:text-white">Home</a></li>
              <li><a href="/category/seeds" className="text-green-200 hover:text-white">Seeds</a></li>
              <li><a href="/category/vegetables" className="text-green-200 hover:text-white">Vegetables</a></li>
              <li><a href="/category/fertilizers" className="text-green-200 hover:text-white">Fertilizers</a></li>
              <li><a href="/category/machinery" className="text-green-200 hover:text-white">Machinery</a></li>
              <li><a href="/category/others" className="text-green-200 hover:text-white">Other Products</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><a href="/contact" className="text-green-200 hover:text-white">Contact Us</a></li>
              <li><a href="/shipping" className="text-green-200 hover:text-white">Shipping Info</a></li>
              <li><a href="/returns" className="text-green-200 hover:text-white">Returns Policy</a></li>
              <li><a href="/faq" className="text-green-200 hover:text-white">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-300" />
                <span className="text-green-200">+91 90423 94728</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-green-300" />
                <span className="text-green-200">farmproducehub05@gmail.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-6 w-6 text-green-300" />
                <span className="text-green-200">
                  JSA College of Agriculture and Technology,<br />
                  Avatti Tittakudi - Kanakkampadi Rd, Avatti, Tamil Nadu 606108
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-green-800 mt-8 pt-6 text-center">
          <p className="text-green-200">
            © 2024 Farm Produce Hub. All rights reserved. | Built for agricultural excellence.
          </p>

          {/* Team Credits */}
          <div className="mt-4 text-green-300 text-sm">
            <span className="font-semibold"> Authorized By:</span> <br />
            <br /> Dr.V.Lakshmanan |
Dr.S.Velprabakaran |
Mr.S.Senthil Murugan.
<br />
<br />


Tamilvaanan T |
Sudharshan R |
Sowmya S |
Subrapratha R |
Sudhirsha M V |
Susmitha N 
<br />
<br />
<span className="font-semibold"> Founder :</span>
<br />
<br />
JSA College of Agriculture and Technology

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
