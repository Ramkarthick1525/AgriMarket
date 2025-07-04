

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
  const markOrderAsCompleted = async (orderId) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status: 'Completed' });
    toast.success('Order marked as completed!');
    fetchOrders(); // Refresh
  } catch (err) {
    console.error('Error updating order status:', err);
    toast.error('Failed to update order.');
  }
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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


       <div className="bg-white p-6 rounded-xl shadow">
  <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="flex flex-col">
      <label className="text-sm mb-1 text-gray-600">Product Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
    </div>

    <div className="flex flex-col">
      <label className="text-sm mb-1 text-gray-600">Category</label>
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      >
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
        <option value="Other Products">Other Products</option>
      </select>
    </div>

    {formData.category === 'Machinery' && (
      <div className="md:col-span-2 flex items-center gap-2">
        <input type="checkbox" name="rental" checked={formData.rental} onChange={handleCheckboxChange} />
        <label className="text-sm text-gray-700">Available for Rent</label>
      </div>
    )}

    <div className="flex flex-col">
      <label className="text-sm mb-1 text-gray-600">
        {formData.rental ? "Rent per Day (₹)" : "Price (₹)"}
      </label>
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
    </div>

    {!(formData.category === 'Machinery' && formData.rental) && (
      <div className="flex flex-col">
        <label className="text-sm mb-1 text-gray-600">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
      </div>
    )}

    <div className="flex flex-col">
      <label className="text-sm mb-1 text-gray-600">Image URL</label>
      <input
        type="url"
        name="image"
        value={formData.image}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
    </div>

    {/* 👇 Preview Image */}
    {formData.image && (
      <div className="md:col-span-2 flex justify-center mt-2">
        <img
          src={formData.image}
          alt="Preview"
          className="w-32 h-32 object-cover rounded border"
        />
      </div>
    )}

    <div className="md:col-span-2 flex flex-col">
      <label className="text-sm mb-1 text-gray-600">Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="border p-2 rounded"
        rows="3"
        required
      />
    </div>

    <button
      type="submit"
      className="md:col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
    >
      Add Product
    </button>
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
{/* Admin Order Management */}
<div className="bg-white p-6 rounded-xl shadow">
  <h2 className="text-2xl font-bold mb-4">Customer Orders</h2>
  {orders.length === 0 ? (
    <p className="text-gray-600">No orders placed yet.</p>
  ) : (
    <div className="space-y-4">
      {orders.map(order => (
        <div key={order.id} className="border p-4 rounded">
          <p className="font-semibold">Order ID: {order.id}</p>
          <p className="text-sm text-gray-600">Name: {order.name}</p>
          <p className="text-sm text-gray-600">Mobile: {order.mobile}</p>
          <p className="text-sm text-gray-600">Address: {order.address}</p>
          <p className="text-sm text-gray-600">Status: {order.status}</p>
          <ul className="text-sm mt-2 space-y-1">
            {order.items?.map((item, idx) => (
              <li key={idx}>• {item.name} x{item.quantity}</li>
            ))}
          </ul>
          {order.status !== 'Completed' && (
            <button
              onClick={() => markOrderAsCompleted(order.id)}
              className="mt-2 text-green-600 hover:underline text-sm"
            >
              Mark as Completed
            </button>
          )}
        </div>
      ))}
    </div>
  )}
</div>

      

       
      </div>
    </div>
  );
};

export default AdminDashboard;


 
