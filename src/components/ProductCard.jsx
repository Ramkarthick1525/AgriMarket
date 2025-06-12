import React, { useState } from 'react';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    setLoading(true);
    
    // Simulate adding to cart
    setTimeout(() => {
      toast.success(`${product.name} added to cart!`);
      setLoading(false);
    }, 500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted 
        ? `${product.name} removed from wishlist` 
        : `${product.name} added to wishlist!`
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      {/* Product Image */}
      <div className="relative aspect-w-16 aspect-h-12 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-md"
        >
          <Heart
            className={`h-4 w-4 ${
              isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex space-x-1">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            ({product.rating})
          </span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">
            ${product.price.toFixed(2)}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || loading}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="text-sm font-medium">
              {loading ? 'Adding...' : 'Add to Cart'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;