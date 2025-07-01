import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Truck, Shield, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck } from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { user, userRole, logout, isAdmin } = useAuth();

  const categories = [
    {
      name: 'Organic seeds',
      path: '/category/seeds-organic',
      description: 'High-quality seeds and organic fertilizers for better yields',
      image: 'https://cdn.pixabay.com/photo/2015/05/14/02/22/soil-766281_1280.jpg',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800'
    },
    {
      name: 'Vegetables',
      path: '/category/vegetables',
      description: 'Farm-fresh vegetables and their seeds  delivered to your door',
      image: 'https://static.toiimg.com/thumb/msid-121897288,width-1280,height-720,resizemode-4/121897288.jpg',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800'
    },
    {
      name: ' Machinery',
      path: '/category/machinery',
      description: 'Modern farming equipment and tools for efficient agriculture',
      image: 'https://i.pinimg.com/736x/15/30/b9/1530b944fe11198892b63ab5fe9371be.jpg',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800'
    },
    
    {
      name: 'Diary',
      path: '/category/Diary',
      description: 'Fresh and healthy dairy products ',
      image: 'https://i.pinimg.com/736x/c2/a5/03/c2a5035df9bad2990471306b6d1a2a4f.jpg',
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
    
      {isAdmin ||(
      <section className="bg-gradient-to-r from-green-800 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Farm Produce Hub
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Your one-stop shop for all agricultural needs
            </p>
            <p className="text-lg mb-10 text-green-200 max-w-3xl mx-auto">
              From premium seeds and fertilizers to fresh produce and modern machinery, 
              we provide everything farmers need to grow and succeed.
            </p>
            <Link
              to="/category/seeds-organic"
              className="inline-flex items-center bg-white text-green-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>)}

      {/* Categories Section */}
      { isAdmin ||(
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
      </section>)}
      {/* Only see on Admin Pannel */}
      { isAdmin && (
        <>
         <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-r from-green-800 to-green-600 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-3xl w-full text-center">
        <div className="flex justify-center mb-4">
          <ShieldCheck className="h-12 w-12 text-green-700" />
        </div>

        <h1 className="text-4xl font-bold text-green-800 mb-4">
          Welcome  {user?.displayName || 'Admin'} !
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          You now have full control of the AgriMart dashboard. Use the admin panel to manage products, view orders, and keep things running smoothly.
        </p>

        <Link
          to="/admin"
          className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-medium text-lg shadow hover:bg-green-800 transition-all duration-300"
        >
          Go to Admin Panel
        </Link>
      </div>
    </section>
      
        </>
      )}

      {/* Features Section */}
      { isAdmin ||(
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Farm Produce Hub?
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
      </section>)}

      {/* CTA Section */}
      { isAdmin || (
      <section className="bg-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Join thousands of farmers who trust Farm Produce Hub for their agricultural needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            <Link
              to="/category/seeds-organic"
              className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-700 transition-all duration-300"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>)}
    </div>
    );
};

export default Home;