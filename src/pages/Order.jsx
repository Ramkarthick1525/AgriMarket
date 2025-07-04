import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, 'orders'),
          where('userEmail', '==', user.email),
          orderBy('placedAt', 'desc')
        );

        const querySnapshot = await getDocs(q);

        const fetchedOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setOrders(fetchedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));

      // Remove from UI
      setOrders(prev => prev.filter(order => order.id !== orderId));

      toast.success('Order cancelled and removed successfully!');
    } catch (err) {
      console.error('Error deleting order:', err);
      toast.error('Failed to cancel the order.');
    }
  };

  if (!user) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-semibold mb-2">Please login to view your orders.</h2>
        <Link to="/login" className="text-green-600 underline">Go to Login</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center p-10">Loading orders...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Order ID: {order.id}</h2>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    order.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'Cancelled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">Name: {order.name || 'N/A'}</p>
              <p className="text-sm text-gray-500 mb-1">Mobile: {order.mobile || 'N/A'}</p>
              <p className="text-sm text-gray-500 mb-3">Address: {order.address || 'N/A'}</p>
              <p className="text-sm text-gray-500 mb-3">
                Placed on: {order.placedAt?.toDate().toLocaleString() || 'N/A'}
              </p>
              <ul className="divide-y divide-gray-200">
                {order.items.map((item, idx) => (
                  <li key={idx} className="py-2">
                    <p className="text-sm text-gray-600">{item.name} (x{item.quantity || 1})</p>
                    <p className="text-sm text-gray-600">Unit Price: ₹{item.price}</p>
                    <p className="text-sm text-gray-800 font-medium">
                      Subtotal: ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="text-right mt-3 font-semibold">
                Total: ₹{Number(order.total).toFixed(2)}
              </div>
              

              {/* Cancel Order Button */}
              {order.status === 'Pending' && (
                <div className="text-right mt-2">
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="text-red-600 hover:underline text-sm font-medium"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
