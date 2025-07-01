import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

// Mapping from URL slug to actual category name stored by admin
const categorySlugMap = {
  'seeds-organic': 'Seeds - Organic',
  'seeds-inorganic': 'Seeds - Inorganic',
  'fertilizers-organic': 'Fertilizers - Organic',
  'fertilizers-inorganic': 'Fertilizers - Inorganic',
  'machinery': 'Machinery',
  'Diary': 'Diary',
  'trees-fruit': 'Fruit Trees',
  'trees-ornamental': 'Ornamental Trees',
  'poultry-chick': 'Chick',
  'poultry-duck': 'Duck',
  'poultry-turkey': 'Turkey',
  'vegetables': 'Vegetables',
};


// Header info for each category
const categoryInfo = {
  'seeds-organic': {
    title: 'Organic Seeds',
    description: 'Naturally sourced seeds for healthier crops',
    bgColor: 'bg-lime-600'
  },
  'seeds-inorganic': {
    title: 'Inorganic Seeds',
    description: 'Scientifically improved seeds for better yield',
    bgColor: 'bg-lime-800'
  },
  'fertilizers-organic': {
    title: 'Organic Fertilizers',
    description: 'Eco-friendly fertilizers for sustainable farming',
    bgColor: 'bg-green-600'
  },
  'fertilizers-inorganic': {
    title: 'Inorganic Fertilizers',
    description: 'Boost crop productivity with chemical fertilizers',
    bgColor: 'bg-green-800'
  },
  'machinery': {
    title: 'Agricultural Machinery',
    description: 'Modern equipment to enhance productivity',
    bgColor: 'bg-blue-600'
  },
  'Diary': {
    title: 'Diary Items',
    description: 'Fresh and healthy dairy products',
    bgColor: 'bg-amber-600'
  },
  'trees-fruit': {
    title: 'Fruit Trees',
    description: 'Grow your own fruits with our best tree varieties',
    bgColor: 'bg-pink-700'
  },
  'trees-ornamental': {
    title: 'Ornamental Trees',
    description: 'Beautify farms and gardens with ornamental trees',
    bgColor: 'bg-purple-600'
  },
  'poultry-chick': {
    title: 'Chick',
    description: 'Supplies and feed for chick farming',
    bgColor: 'bg-yellow-500'
  },
  'poultry-duck': {
    title: 'Duck',
    description: 'All you need for duck rearing',
    bgColor: 'bg-yellow-700'
  },
  'poultry-turkey': {
    title: 'Turkey',
    description: 'Top-quality turkeys and accessories',
    bgColor: 'bg-red-500'
  },
  'vegetables':{
    title: 'vegetables',
    description: 'Farm-fresh vegetables and their seeds delivered to your door',
    bgColor: 'bg-orange-500'
  }
};


const CategoryPage = () => {
  const { category } = useParams();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Load all admin products from localStorage and filter by category
  useEffect(() => {
    setLoading(true);

    const allProducts = [];

    for (let key in localStorage) {
      if (key.startsWith('products_')) {
        try {
          const productsForAdmin = JSON.parse(localStorage.getItem(key));
          allProducts.push(...productsForAdmin);
        } catch (err) {
          console.warn(`Failed to parse ${key}`, err);
        }
      }
    }

    const categoryName = categorySlugMap[category]; // match with admin format
    const categoryProducts = allProducts.filter(p => p.category === categoryName);

    setProducts(categoryProducts);
    setFilteredProducts(categoryProducts);
    setLoading(false);
  }, [category]);

  // Handle search, sort, and price filter
  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceRange.min !== '') {
      filtered = filtered.filter(product => parseFloat(product.price) >= parseFloat(priceRange.min));
    }
    if (priceRange.max !== '') {
      filtered = filtered.filter(product => parseFloat(product.price) <= parseFloat(priceRange.max));
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, sortBy, priceRange]);

  if (loading) return <LoadingSpinner />;

  const currentCategory = categoryInfo[category] || {
    title: 'Products',
    description: 'Browse our selection of quality products',
    bgColor: 'bg-gray-600'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${currentCategory.bgColor} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{currentCategory.title}</h1>
          <p className="text-xl text-white/90 max-w-2xl">{currentCategory.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
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
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>
        

        {/* Product Listing */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="text-gray-400 h-16 w-16 mx-auto mb-4" />
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
