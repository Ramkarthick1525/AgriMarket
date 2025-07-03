

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

  const productsRef = collection(db, 'products');
  const ordersRef = collection(db, 'orders');

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    const q = query(productsRef, where('admin', '==', user.email));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(data);
  };

  const fetchOrders = async () => {
    const q = query(ordersRef, where('admin', '==', user.email));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setOrders(data);
  };

  const handleCancelEdit = () => {
  setEditingId(null);
  setEditData({});
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

  if (!user || !user.email) {
    toast.error("User not logged in.");
    return;
  }

  if (!name || !category || !price || !description || !image || (!rental && !quantity)) {
    toast.error("All fields are required.");
    return;
  }
console.log("Submitting product:", { ...formData, admin: user.email });

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
    console.error("Firestore error:", error); // <— View error details in browser console
  }
};


  const handleEdit = (product) => {
  setEditingId(product.id);
  setEditData({
    name: product.name || '',
    category: product.category || '',
    price: product.price || '',
    quantity: product.quantity || '',
    image: product.image || '',
    description: product.description || '',
    rental: product.rental || false,
  });
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

  const totalEarnings = orders.reduce((sum, o) => sum + Number(o.price || 0), 0);
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.length - completedOrders;
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h1 className="text-3xl font-bold text-green-800">Welcome, Admin</h1>
        </div>

        {/* Add Product Form */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} className="border p-2 rounded" required />
            <select name="category" value={formData.category} onChange={handleChange} className="border p-2 rounded" required>
              <option value="">Select Category</option>
              <optgroup label="Seeds">
                <option value="Seeds - Organic">Organic Seeds</option>
                <option value="Seeds - Inorganic">Inorganic Seeds</option>
              </optgroup>
              <optgroup label="Fertilizers">
                <option value="Fertilizers - Organic">Organic Fertilizers</option>
                <option value="Fertilizers - Inorganic">Inorganic Fertilizers</option>
              </optgroup>
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
              <option value="Diary">Diary</option>
            </select>

            {formData.category === 'Machinery' && (
              <div className="md:col-span-2 flex items-center gap-2">
                <input type="checkbox" name="rental" checked={formData.rental} onChange={handleCheckboxChange} />
                <label className="text-sm text-gray-700">Available for Rent</label>
              </div>
            )}

            <input type="number" name="price" placeholder={formData.rental ? "Rent per Day (₹)" : "Price (₹)"} value={formData.price} onChange={handleChange} className="border p-2 rounded" required />

            {!(formData.category === 'Machinery' && formData.rental) && (
              <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} className="border p-2 rounded" required />
            )}

            <input type="url" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} className="border p-2 rounded" required />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="border p-2 rounded md:col-span-2" rows="3" required />
            <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700 md:col-span-2">Add Product</button>
          </form>
        </div>

        {/* Products List */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Added Products</h2>
          {products.length === 0 ? (
            <p className="text-gray-600">No products added yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {products.map(product => (
                <div key={product.id} className="border p-4 rounded-lg flex flex-col md:flex-row gap-4 items-start">
                  <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded" />
                  <div className="flex-1">
                    {editingId === product.id ? (
                      <div className="space-y-2">
                        <input type="text" name="name" value={editData.name || ''} onChange={handleEditChange} className="w-full border p-1 rounded" />
                        <input type="text" name="category" value={editData.category || ''} onChange={handleEditChange} className="w-full border p-1 rounded" />

                        {editData.category === 'Machinery' && (
                          <div className="flex items-center gap-2">
                            <input type="checkbox" name="rental" checked={editData.rental || false} onChange={handleEditChange} />
                            <label className="text-sm text-gray-700">Available for Rent</label>
                          </div>
                        )}

                        <input type="number" name="price" value={editData.price || ''} onChange={handleEditChange} className="w-full border p-1 rounded" />
                        {!(editData.category === 'Machinery' && editData.rental) && (
                          <input type="number" name="quantity" value={editData.quantity || ''} onChange={handleEditChange} className="w-full border p-1 rounded" />
                        )}
                        <textarea name="description" value={editData.description || ''} onChange={handleEditChange} className="w-full border p-1 rounded" />
                        <input type="url" name="image" value={editData.image || ''} onChange={handleEditChange} className="w-full border p-1 rounded" />

                        <div className="flex gap-2">
                          <button onClick={handleUpdate} className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
                          <button onClick={handleCancelEdit} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="font-bold text-lg">{product.name}</p>
                        <p className="text-sm text-gray-600">Category: {product.category}</p>
                        <p className="text-sm text-gray-600">
                          {product.rental ? `Rent: ₹${product.price}/day` : `Price: ₹${product.price}`}
                        </p>
                        {!product.rental && <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>}
                        <p className="text-sm text-gray-600">{product.description}</p>
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
          )}
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Total Orders</h2>
            <p className="text-2xl font-bold text-green-700">{orders.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Completed Orders</h2>
            <p className="text-2xl font-bold text-green-700">{completedOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Pending Orders</h2>
            <p className="text-2xl font-bold text-green-700">{pendingOrders}</p>
          </div>
        </div>

        {/* Earnings */}
        <div className="bg-white p-6 rounded-xl shadow text-right">
          <h2 className="text-2xl font-bold mb-2">Total Earnings</h2>
          <p className="text-3xl font-bold text-green-700">₹{totalEarnings}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


 
