import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';

const WishlistPage = () => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const wishlistRef = doc(db, 'wishlists', user.email);
        const wishlistSnap = await getDoc(wishlistRef);
        if (wishlistSnap.exists()) {
          const items = wishlistSnap.data().items || [];
          setWishlistItems(items);
        } else {
          setWishlistItems([]);
        }
      } catch (err) {
        console.error('Error loading wishlist:', err);
        setWishlistItems([]);
      }
      setLoading(false);
    };
    fetchWishlist();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-semibold mb-2">Please login to view your wishlist.</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Heart className="text-red-500" /> Your Wishlist
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : wishlistItems.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
