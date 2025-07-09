import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { db } from '../firebase/config';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    name: '', price: '', quantity: '', category: '',
    description: '', image: '', rental: false
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');

  const productsRef = collection(db, 'products');
  const ordersRef = collection(db, 'orders');

  useEffect(() => {
    if (user?.email) {
      fetchProducts();
      fetchOrders();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const q = query(productsRef, where('admin', '==', user.email));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const q = query(ordersRef, where('admin', '==', user.email));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const markOrderAsCompleted = async (orderId) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: 'Completed' });
      toast.success('Order marked as completed!');
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Failed to update order.');
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = e => {
    setFormData(prev => ({
      ...prev,
      rental: e.target.checked,
      quantity: e.target.checked ? '' : prev.quantity
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { name, category, price, quantity, description, image, rental } = formData;

    if (!user?.email) {
      toast.error("User not logged in.");
      return;
    }

    if (!name || !category || !price || !description || !image || (!rental && !quantity)) {
      toast.error("All fields are required.");
      return;
    }

    try {
      await addDoc(productsRef, { ...formData, admin: user.email });
      toast.success("Product added successfully!");
      setFormData({
        name: '',
        price: '',
        quantity: '',
        category: '',
        description: '',
        image: '',
        rental: false
      });
      fetchProducts();
    } catch (error) {
      toast.error("Error adding product.");
      console.error("Firestore error:", error);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditData({ ...product });
  };

  const handleEditChange = e => {
    const { name, value, type, checked } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, 'products', editingId);
      await updateDoc(docRef, editData);
      toast.success("Product updated");
      setEditingId(null);
      setEditData({});
      fetchProducts();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async id => {
    try {
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);
      toast.success("Deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-4">
          {['dashboard', 'products', 'orders'].map(tab => (
            <button key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h2 className="text-xl font-semibold text-gray-600 mb-1">Welcome</h2>
              <p className="text-2xl font-bold text-green-800">{user?.name || 'Admin'}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h2 className="text-sm font-medium text-gray-600">Total Products</h2>
              <p className="text-2xl font-bold text-blue-600">{products.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h2 className="text-sm font-medium text-gray-600">Total Orders</h2>
              <p className="text-2xl font-bold text-purple-600">{orders.length}</p>
            </div>
          </div>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-bold mb-4">Add Product</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="border p-2 rounded" />
                <select name="category" value={formData.category} onChange={handleChange} className="border p-2 rounded">
                  <option value="">Select Category</option>
                 <option value="Seeds"> Seeds</option>
                    <option value="Fertilizers"> Fertilizers</option>
                  <optgroup label="Trees">
                    <option value="Fruit Trees">Fruit Trees</option>
                    <option value="Ornamental Trees">Ornamental Trees</option>
                  </optgroup>
                  <optgroup label="Poultry">
                    <option value="Chick">Chick</option>
                    <option value="Duck">Duck</option>
                    <option value="Turkey">Turkey</option>
                  </optgroup>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Machinery">Machinery</option>
                  <option value="Other Products">Other Products</option>
                </select>

                {formData.category === 'Machinery' && (
                  <div className="md:col-span-2 flex items-center gap-2">
                    <input type="checkbox" name="rental" checked={formData.rental} onChange={handleCheckboxChange} />
                    <label>Available for Rent</label>
                  </div>
                )}

                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder={formData.rental ? "Rent per Day (₹)" : "Price (₹)"} className="border p-2 rounded" />

                {!(formData.category === 'Machinery' && formData.rental) && (
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" className="border p-2 rounded" />
                )}

                <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" className="border p-2 rounded" />
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="md:col-span-2 border p-2 rounded" rows="3" />
                <button type="submit" className="md:col-span-2 bg-green-600 text-white py-2 rounded">Add Product</button>
              </form>
            </div>

            {/* Product List */}
            <div className="grid md:grid-cols-2 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white p-4 rounded shadow flex gap-4">
                  <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded" />
                  <div className="flex-1">
                    {editingId === product.id ? (
                      <>
                        <input name="name" value={editData.name} onChange={handleEditChange} className="w-full border p-1 mb-1 rounded" />
                        <input name="category" value={editData.category} onChange={handleEditChange} className="w-full border p-1 mb-1 rounded" />
                        <input name="price" type="number" value={editData.price} onChange={handleEditChange} className="w-full border p-1 mb-1 rounded" />
                        {!editData.rental && (
                          <input name="quantity" type="number" value={editData.quantity} onChange={handleEditChange} className="w-full border p-1 mb-1 rounded" />
                        )}
                        <textarea name="description" value={editData.description} onChange={handleEditChange} className="w-full border p-1 mb-1 rounded" />
                        <input name="image" type="url" value={editData.image} onChange={handleEditChange} className="w-full border p-1 mb-1 rounded" />
                        <div className="flex gap-2">
                          <button onClick={handleUpdate} className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
                          <button onClick={handleCancelEdit} className="bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="font-bold">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <p className="text-sm">{product.rental ? `Rent: ₹${product.price}/day` : `Price: ₹${product.price}`}</p>
                        {!product.rental && <p className="text-sm">Qty: {product.quantity}</p>}
                        <p className="text-sm text-gray-700">{product.description}</p>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => handleEdit(product)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                          <button onClick={() => handleDelete(product.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Customer Orders</h2>
            {orders.length === 0 ? (
              <p className="text-gray-600">No orders placed yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border p-4 rounded">
                    <p className="font-semibold">Order ID: {order.id}</p>
                    <p>Name: {order.name}</p>
                    <p>Mobile: {order.mobile}</p>
                    <p>Address: {order.address}</p>
                    <p>Status: {order.status}</p>
                    <ul className="text-sm mt-2 space-y-1">
                      {order.items?.map((item, idx) => (
                        <li key={idx}>• {item.name} x{item.quantity}</li>
                      ))}
                    </ul>
                    {order.status !== 'Completed' && (
                      <button onClick={() => markOrderAsCompleted(order.id)} className="mt-2 text-green-600 hover:underline text-sm">
                        Mark as Completed
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
