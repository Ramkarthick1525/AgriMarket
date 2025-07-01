import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const adminId = user?.email || 'default';
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    category: '',
    description: '',
    image: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem(`products_${adminId}`)) || [];
    setProducts(storedProducts);
    const storedOrders = JSON.parse(localStorage.getItem(`orders_${adminId}`)) || [];
    setOrders(storedOrders);
  }, [adminId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, category, price, quantity, description, image } = formData;

    if (!name || !category || !price || !quantity || !description || !image) {
      toast.error("All fields are required.");
      return;
    }

    const existingProducts = JSON.parse(localStorage.getItem(`products_${adminId}`)) || [];
    const newProduct = {
      id: Date.now(),
      ...formData
    };

    const updatedProducts = [...existingProducts, newProduct];
    localStorage.setItem(`products_${adminId}`, JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
    toast.success("Product added successfully!");
    setFormData({ name: '', price: '', quantity: '', category: '', description: '', image: '' });
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditData(product);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    const updated = products.map((prod) =>
      prod.id === editingId ? editData : prod
    );
    setProducts(updated);
    localStorage.setItem(`products_${adminId}`, JSON.stringify(updated));
    setEditingId(null);
    setEditData({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = (id) => {
    const filtered = products.filter((p) => p.id !== id);
    setProducts(filtered);
    localStorage.setItem(`products_${adminId}`, JSON.stringify(filtered));
  };

  const totalEarnings = orders.reduce((sum, order) => sum + Number(order.price || 0), 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const pendingOrders = orders.filter(order => order.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="bg-white p-6 rounded-xl shadow">
          <h1 className="text-3xl font-bold text-green-800">Welcome, Admin {user?.name || 'User'}</h1>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Product Name" className="border p-2 rounded" value={formData.name} onChange={handleChange} required />
            <select
  name="category"
  className="border p-2 rounded"
  value={formData.category}
  onChange={handleChange}
  required
>
  <option value="">Select Category</option>
  <option value="Seeds & Fertilizers">Seeds & Fertilizers</option>
  <option value="Vegetables">Vegetables</option>
  <option value="Fruits">Fruits</option>
  <option value="Machinery">Machinery</option>
  <option value="Diary">Diary</option>
</select>

            <input type="number" name="price" placeholder="Price (Rs)" className="border p-2 rounded" value={formData.price} onChange={handleChange} required />
            <input type="number" name="quantity" placeholder="Quantity" className="border p-2 rounded" value={formData.quantity} onChange={handleChange} required />
            <input type="url" name="image" placeholder="Image URL" className="border p-2 rounded" value={formData.image} onChange={handleChange} required />
            <textarea name="description" placeholder="Description" className="border p-2 rounded md:col-span-2" rows="3" value={formData.description} onChange={handleChange} required></textarea>
            <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700 md:col-span-2">Add Product</button>
          </form>
        </div>

     


        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Added Products</h2>
          {products.length === 0 ? (
            <p className="text-gray-600">No products added yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {products.map((product) => (
                <div key={product.id} className="border p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center">
                  <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded" />
                  <div className="flex-1">
                    {editingId === product.id ? (
                      <div className="space-y-2">
                        <input type="text" name="name" value={editData.name} onChange={handleEditChange} className="w-full border p-1 rounded" />
                        <input type="text" name="category" value={editData.category} onChange={handleEditChange} className="w-full border p-1 rounded" />
                        <input type="number" name="price" value={editData.price} onChange={handleEditChange} className="w-full border p-1 rounded" />
                        <input type="number" name="quantity" value={editData.quantity} onChange={handleEditChange} className="w-full border p-1 rounded" />
                        <textarea name="description" value={editData.description} onChange={handleEditChange} className="w-full border p-1 rounded" />
                        <input type="url" name="image" value={editData.image} onChange={handleEditChange} className="w-full border p-1 rounded" />
                        <div className="flex gap-2">
                          <button onClick={handleUpdate} className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
                          <button onClick={handleCancelEdit} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="font-bold text-lg">{product.name}</p>
                        <p className="text-sm text-gray-600">Category: {product.category}</p>
                        <p className="text-sm text-gray-600">Price: ₹{product.price}</p>
                        <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Orders</h2>
            <p className="text-2xl font-bold text-green-700">{totalOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Completed Orders</h2>
            <p className="text-2xl font-bold text-green-700">{completedOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Pending Orders</h2>
            <p className="text-2xl font-bold text-green-700">{pendingOrders}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-right">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Total Earnings</h2>
          <p className="text-3xl font-bold text-green-700">₹{totalEarnings}</p>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
