import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Truck, Shield, Star, ArrowRight } from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const categories = [
    {
      name: 'Seeds & Fertilizers',
      path: '/category/seeds-fertilizers',
      description: 'High-quality seeds and organic fertilizers for better yields',
      image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800'
    },
    {
      name: 'Fresh Produce',
      path: '/category/fresh-produce',
      description: 'Farm-fresh fruits and vegetables delivered to your door',
      image: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800'
    },
    {
      name: 'Agricultural Machinery',
      path: '/category/machinery',
      description: 'Modern farming equipment and tools for efficient agriculture',
      image: 'https://images.pexels.com/photos/2886596/pexels-photo-2886596.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800'
    },
    {
      name: 'Livestock Supplies',
      path: '/category/livestock',
      description: 'Everything you need for healthy and productive livestock',
      image: 'https://images.pexels.com/photos/422220/pexels-photo-422220.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-800'
    }
  ];

  const features = [
    {
      icon: <Sprout className="h-8 w-8 text-green-600" />,
      title: 'Quality Products',
      description: 'Carefully selected agricultural products from trusted suppliers'
    },
    {
      icon: <Truck className="h-8 w-8 text-green-600" />,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery to your farm or business location'
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: 'Secure Payments',
      description: 'Safe and secure cash on delivery payment options'
    },
    {
      icon: <Star className="h-8 w-8 text-green-600" />,
      title: 'Expert Support',
      description: '24/7 customer support from agricultural specialists'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-800 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to AgriMarket
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Your one-stop shop for all agricultural needs
            </p>
            <p className="text-lg mb-10 text-green-200 max-w-3xl mx-auto">
              From premium seeds and fertilizers to fresh produce and modern machinery, 
              we provide everything farmers need to grow and succeed.
            </p>
            <Link
              to="/category/seeds-fertilizers"
              className="inline-flex items-center bg-white text-green-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive range of agricultural products designed to meet all your farming needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.path}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${category.bgColor} ${category.textColor}`}>
                    {category.name}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AgriMarket?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to supporting farmers with quality products and exceptional service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center group hover:bg-green-50 p-6 rounded-xl transition-all duration-300"
              >
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Join thousands of farmers who trust AgriMarket for their agricultural needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center bg-white text-green-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all duration-300"
            >
              Create Account
            </Link>
            <Link
              to="/category/seeds-fertilizers"
              className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-700 transition-all duration-300"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;