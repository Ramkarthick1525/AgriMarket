import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductModal = ({ product, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'seeds-fertilizers',
    description: '',
    image: '',
    stock: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        category: product.category || 'seeds-fertilizers',
        description: product.description || '',
        image: product.image || '',
        stock: product.stock || ''
      });
    }
  }, [product]);

  const categories = [
    { value: 'seeds-fertilizers', label: 'Seeds & Fertilizers' },
    { value: 'fresh-produce', label: 'Fresh Produce' },
    { value: 'fruits', label: 'Fruits'},
    { value: 'machinery', label: 'Agricultural Machinery' },
    { value: 'livestock', label: 'Livestock Supplies' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.price || !formData.description || !formData.stock) {
    toast.error('Please fill in all required fields');
    return;
  }

  if (parseFloat(formData.price) <= 0) {
    toast.error('Price must be greater than 0');
    return;
  }

  if (parseInt(formData.stock) < 0) {
    toast.error('Stock cannot be negative');
    return;
  }

  setLoading(true);

  // Simulate API call
  setTimeout(() => {
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      inStock: parseInt(formData.stock) > 0,
      rating: 4.5, // you can allow admin to rate or set default
      id: Date.now().toString(), // Unique ID for each product
      image:
        formData.image ||
        'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=400',
    };

    // 🔥 Save to localStorage by category
    const existingData = JSON.parse(localStorage.getItem('products')) || {};
    const categoryProducts = existingData[productData.category] || [];

    categoryProducts.push(productData); // add the new product
    existingData[productData.category] = categoryProducts;

    localStorage.setItem('products', JSON.stringify(existingData));

    onSubmit(productData); // update parent/admin panel
    setLoading(false);
  }, 500);
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Input fields... (unchanged from your version) */}
          {/* Keep the rest of your form UI as-is */}
          {/* Add Save/Cancel buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
