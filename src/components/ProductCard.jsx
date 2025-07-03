import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Heart, Truck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      if (!user) return;
      try {
        const wishlistRef = doc(db, 'wishlists', user.email);
        const wishlistSnap = await getDoc(wishlistRef);
        if (wishlistSnap.exists()) {
          const wishlist = wishlistSnap.data().items || [];
          const wished = wishlist.some(item => item.id === product.id);
          setIsWishlisted(wished);
        }
      } catch (err) {
        console.error('Failed to fetch wishlist status:', err);
      }
    };
    fetchWishlistStatus();
  }, [user, product.id]);

  const handleAddToCart = (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    const userEmail = user.email;
    const cartKey = `cart_${userEmail}`;
    const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const alreadyInCart = existingCart.some(item => item.id === product.id);
    if (alreadyInCart) {
      toast.error('Product already in cart!');
      return;
    }

    const updatedCart = [...existingCart, { ...product, cartQuantity: 1 }];
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    toast.success(`${product.name} added to cart!`);
  };

  const handleRentNow = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to rent machinery');
      return;
    }

    const rentRef = doc(db, 'rental_requests', user.email);

    try {
      const rentSnap = await getDoc(rentRef);
      const currentRequests = rentSnap.exists() ? rentSnap.data().items || [] : [];

      const alreadyRequested = currentRequests.some(item => item.id === product.id);
      if (alreadyRequested) {
        toast.error('You already requested this machinery');
        return;
      }

      const updatedRequests = [...currentRequests, product];
      await setDoc(rentRef, { items: updatedRequests });

      toast.success(`Rental request sent for ${product.name}`);
    } catch (err) {
      console.error('Rental request error:', err);
      toast.error('Failed to send rental request');
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to manage wishlist');
      return;
    }

    const wishlistRef = doc(db, 'wishlists', user.email);

    try {
      const wishlistSnap = await getDoc(wishlistRef);
      const currentWishlist = wishlistSnap.exists() ? wishlistSnap.data().items || [] : [];

      const alreadyWished = currentWishlist.some(item => item.id === product.id);

      let updatedWishlist;
      if (alreadyWished) {
        updatedWishlist = currentWishlist.filter(item => item.id !== product.id);
        toast.success(`${product.name} removed from wishlist`);
        setIsWishlisted(false);
      } else {
        updatedWishlist = [...currentWishlist, product];
        toast.success(`${product.name} added to wishlist!`);
        setIsWishlisted(true);
      }

      await setDoc(wishlistRef, { items: updatedWishlist });
    } catch (err) {
      console.error('Wishlist error:', err);
      toast.error('Error updating wishlist');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const isMachineryRentable = product.category === 'Machinery' && product.rental;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative aspect-w-16 aspect-h-12 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />

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

        {!(product.category === 'Machinery' && product.rental) && Number(product.quantity) <= 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">
            ₹{Number(product.price).toFixed(2)}
          </span>

          {isMachineryRentable ? (
            <button
              onClick={handleRentNow}
              className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <Truck className="h-4 w-4" />
              <span className="text-sm font-medium">Rent Now</span>
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={Number(product.quantity) <= 0}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="text-sm font-medium">{loading ? 'Adding...' : 'Add to Cart'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
