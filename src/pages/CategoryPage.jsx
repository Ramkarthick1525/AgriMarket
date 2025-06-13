import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Filter, ShoppingCart, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const CategoryPage = () => {
  const { category } = useParams();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const categoryInfo = {
    'seeds-fertilizers': {
      title: 'Seeds & Fertilizers',
      description: 'Premium quality seeds and organic fertilizers for optimal crop growth',
      bgColor: 'bg-green-600'
    },
    'fresh-produce': {
      title: 'Fresh Produce', 
      description: 'Farm-fresh fruits and vegetables delivered daily',
      bgColor: 'bg-orange-600'
    },
    'machinery': {
      title: 'Agricultural Machinery',
      description: 'Modern farming equipment and tools for efficient agriculture',
      bgColor: 'bg-blue-600'
    },
    'livestock': {
      title: 'Livestock Supplies',
      description: 'Everything you need for healthy and productive livestock',
      bgColor: 'bg-amber-600'
    }
  };

  // Mock product data - In real app, this would come from Firebase
  const mockProducts = {
    'seeds-fertilizers': [
      {
        id: '1',
        name: 'Organic Tomato Seeds',
        price: 25.99,
        description: 'High-yield organic tomato seeds, perfect for home gardens',
        image: 'https://images.pexels.com/photos/1327373/pexels-photo-1327373.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'seeds-fertilizers',
        inStock: true,
        rating: 4.5
      },
      {
        id: '2',
        name: 'Bio-Organic Fertilizer',
        price: 45.50,
        description: 'All-natural fertilizer for enhanced soil nutrition',
        image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'seeds-fertilizers',
        inStock: true,
        rating: 4.8
      },
      {
        id: '3',
        name: 'Corn Seed Variety Pack',
        price: 35.00,
        description: 'Premium corn seeds with excellent germination rate',
        image: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'seeds-fertilizers',
        inStock: false,
        rating: 4.2
      }
    ],
    'fresh-produce': [
      {
        id: '4',
        name: 'Fresh Organic Apples',
        price: 12.99,
        description: 'Crisp, sweet organic apples from local orchards',
        image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'fresh-produce',
        inStock: true,
        rating: 4.7
      },
      {
        id: '5',
        name: 'Farm Fresh Carrots',
        price: 8.50,
        description: 'Sweet, crunchy carrots harvested daily',
        image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'fresh-produce',
        inStock: true,
        rating: 4.6
      }
    ],
    'machinery': [
      {
        id: '6',
        name: 'Electric Hedge Trimmer',
        price: 189.99,
        description: 'Professional-grade electric hedge trimmer for precision cutting',
        image: 'https://images.pexels.com/photos/2886596/pexels-photo-2886596.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'machinery',
        inStock: true,
        rating: 4.4
      },
      {
        id: '7',
        name: 'Garden Tiller',
        price: 299.99,
        description: 'Heavy-duty garden tiller for soil preparation',
        image: 'https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'machinery',
        inStock: true,
        rating: 4.3
      },
      {
        id: '8',
        name: 'Tree cutter',
        price: 299.99,
        description: 'Heavy-duty garden tiller for soil preparation',
        image: 'https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'machinery',
        inStock: true,
        rating: 5
      }
    ],
    'livestock': [
      {  
        id: '8',
        name: 'Premium Cattle Feed',
        price: 65.00,
        description: 'Nutritious feed blend for healthy cattle growth',
        image: 'https://images.pexels.com/photos/422220/pexels-photo-422220.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'livestock',
        inStock: true,
        rating: 4.9
      },
      {
        id: '9',
        name: 'Chicken Coop Starter Kit',
        price: 199.99,
        description: 'Complete starter kit for backyard chicken raising',
        image: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'livestock',
        inStock: true,
        rating: 4.1
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const categoryProducts = mockProducts[category] || [];
      setProducts(categoryProducts);
      setFilteredProducts(categoryProducts);
      setLoading(false);
    }, 500);
  }, [category]);

  useEffect(() => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    if (priceRange.min !== '') {
      filtered = filtered.filter(product => product.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max !== '') {
      filtered = filtered.filter(product => product.price <= parseFloat(priceRange.max));
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, sortBy, priceRange]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const currentCategory = categoryInfo[category] || {
    title: 'Products',
    description: 'Browse our selection of quality products',
    bgColor: 'bg-gray-600'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className={`${currentCategory.bgColor} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {currentCategory.title}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            {currentCategory.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min $"
                value={priceRange.min}
                onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <input
                type="number"
                placeholder="Max $"
                value={priceRange.max}
                onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Filter className="mx-auto h-16 w-16" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;