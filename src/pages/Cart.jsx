import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  const cartKey = `cart_${user?.email}`;

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCartItems(storedCart);
  }, [cartKey]);

  const handleRemove = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    localStorage.setItem(cartKey, JSON.stringify(updated));
    setCartItems(updated);
  };

  const total = cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0);

  if (!user) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-semibold mb-2">Please login to view your cart.</h2>
        <Link to="/login" className="text-green-600 underline">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center justify-between border p-4 rounded-lg bg-white shadow-sm">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity || 1}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}

          <div className="text-right mt-6">
            <p className="text-xl font-semibold">Total: ₹{total.toFixed(2)}</p>
            <button className="mt-2 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
