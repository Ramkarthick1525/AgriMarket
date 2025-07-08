import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // User input
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');


  const cartRef = user ? doc(db, 'carts', user.email) : null;

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;

      try {
        const docSnap = await getDoc(cartRef);
        if (docSnap.exists()) {
          setCartItems(docSnap.data().items || []);
        }
      } catch (err) {
        console.error('Error loading cart:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);
const handleOnlinePayment = async () => {
  if (!name || !address || !mobile) {
    toast.error('Please fill all the fields');
    return;
  }

  const options = {
    key: 'rzp_test_W7K9sRnfiGT25L', // replace with your Razorpay test key
    amount: total * 100, // Razorpay uses paise
    currency: 'INR',
    name: 'Farm Produce Hub',
    description: 'Purchase from Farm Produce Hub',
    image: 'assets/logo.jpg', // optional
    handler: async function (response) {
      // Payment successful — create order in Firestore
      try {
        const order = {
          userEmail: user.email,
          name,
          address,
          mobile,
          paymentMethod: 'Online Payment',
          items: cartItems,
          total,
          placedAt: serverTimestamp(),
          status: 'Pending',
          razorpay_payment_id: response.razorpay_payment_id,
          admin: 'tamilvaanan2004@gmail.com'
        };

        await addDoc(collection(db, 'orders'), order);
        await setDoc(cartRef, { items: [] });
        setCartItems([]);
        setShowForm(false);
        setName('');
        setAddress('');
        setMobile('');

        toast.success('Payment successful & order placed!');
      } catch (err) {
        console.error('Error placing order:', err);
        toast.error('Order creation failed after payment.');
      }
    },
    prefill: {
      name,
      email: user.email,
      contact: mobile
    },
    theme: {
      color: '#22c55e'
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};


  const updateCartInDB = async (updatedItems) => {
    if (!user) return;
    try {
      await setDoc(cartRef, { items: updatedItems });
    } catch (err) {
      console.error('Failed to update cart:', err);
    }
  };

  const handleRemove = async (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    await updateCartInDB(updated);
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (!user) return;

    const updatedItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedItems);
    await updateCartInDB(updatedItems);
  };

  const total = cartItems.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    const price = Number(item.price || 0);
    return sum + quantity * price;
  }, 0);

  const handleFormSubmit = async (e) => {
  e.preventDefault();
  if (!name || !address || !mobile) {
    toast.error('Please fill all the fields');
    return;
  }
if (paymentMethod === 'Online Payment') {
  handleOnlinePayment();
  return;
}
setPlacingOrder(true);

  

  try {
    const order = {
      userEmail: user.email,
      name,
      address,
      mobile,
      paymentMethod,
      items: cartItems,
      total,
      placedAt: serverTimestamp(),
      status: 'Pending',
      admin: cartItems[0]?.admin || 'admin@agrimart.com', // ✅ important for admin dashboard
    };

    await addDoc(collection(db, 'orders'), order);
    await setDoc(cartRef, { items: [] });
    setCartItems([]);
    setShowForm(false);
    setName('');
    setAddress('');
    setMobile('');

    toast.success('Order placed successfully!');
  } catch (error) {
    console.error('Error placing order:', error);
    toast.error('Failed to place order. Please try again.');
  } finally {
    setPlacingOrder(false);
  }
};


  if (!user) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-semibold mb-2">Please login to view your cart.</h2>
        <Link to="/login" className="text-green-600 underline">
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center p-10">Loading cart...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border p-4 rounded-lg bg-white shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600">
                        Unit Price: ₹{item.price}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity || 1}
                      </p>
                      <p className="text-sm text-gray-800 font-medium">
                        Subtotal: ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                      </p>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, (item.quantity || 1) - 1)
                        }
                        className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={(item.quantity || 1) <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity || 1}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, (item.quantity || 1) + 1)
                        }
                        className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
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
          </div>

          <div className="text-right mt-6">
            <p className="text-xl font-semibold">Total: ₹{total.toFixed(2)}</p>
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="mt-2 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Place Order
              </button>
            ) : (
              <form
                onSubmit={handleFormSubmit}
                className="mt-4 bg-gray-100 p-4 rounded space-y-4"
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <textarea
                  placeholder="Full Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <div className="flex flex-col gap-2">
  <label className="text-sm font-medium">Select Payment Method</label>
  <div className="flex gap-4">
    <label className="flex items-center gap-1">
      <input
        type="radio"
        name="payment"
        value="Cash on Delivery"
        checked={paymentMethod === 'Cash on Delivery'}
        onChange={(e) => setPaymentMethod(e.target.value)}
      />
      Cash on Delivery
    </label>
    <label className="flex items-center gap-1">
      <input
        type="radio"
        name="payment"
        value="Online Payment"
        checked={paymentMethod === 'Online Payment'}
        onChange={(e) => setPaymentMethod(e.target.value)}
      />
      Online Payment
    </label>
  </div>
</div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={placingOrder}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {placingOrder ? 'Placing Order...' : 'Confirm Order'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
