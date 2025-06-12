import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductModal from '../components/ProductModal';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Mock data
  const mockProducts = [
    {
      id: '1',
      name: 'Organic Tomato Seeds',
      price: 25.99,
      category: 'seeds-fertilizers',
      description: 'High-yield organic tomato seeds',
      image: 'https://images.pexels.com/photos/1327373/pexels-photo-1327373.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      stock: 150
    },
    {
      id: '2',
      name: 'Bio-Organic Fertilizer',
      price: 45.50,
      category: 'seeds-fertilizers',
      description: 'All-natural fertilizer for enhanced soil nutrition',
      image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      stock: 75
    }
  ];

  const mockOrders = [
    {
      id: 'ORD001',
      customerName: 'John Farmer',
      customerEmail: 'john@example.com',
      items: [
        { name: 'Organic Tomato Seeds', quantity: 2, price: 25.99 }
      ],
      total: 51.98,
      status: 'pending',
      createdAt: '2024-01-15T10:30:00Z',
      shippingAddress: '123 Farm Road, Agriculture City'
    },
    {
      id: 'ORD002',
      customerName: 'Sarah Green',
      customerEmail: 'sarah@example.com',
      items: [
        { name: 'Bio-Organic Fertilizer', quantity: 1, price: 45.50 }
      ],
      total: 45.50,
      status: 'delivered',
      createdAt: '2024-01-14T14:20:00Z',
      shippingAddress: '456 Garden Lane, Green Valley'
    }
  ];

  useEffect(() => {
    // Simulate API calls
    setLoading(true);
    setTimeout(() => {
      setProducts(mockProducts);
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
      toast.success('Product deleted successfully');
    }
  };

  const handleProductSubmit = (productData) => {
    if (selectedProduct) {
      // Edit existing product
      setProducts(products.map(p => 
        p.id === selectedProduct.id 
          ? { ...productData, id: selectedProduct.id }
          : p
      ));
      toast.success('Product updated successfully');
    } else {
      // Add new product
      const newProduct = {
        ...productData,
        id: Date.now().toString(),
        inStock: productData.stock > 0
      };
      setProducts([...products, newProduct]);
      toast.success('Product added successfully');
    }
    setShowProductModal(false);
  };

  const handleOrderStatusUpdate = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus }
        : order
    ));
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: <Package className="h-8 w-8 text-blue-600" />,
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: <ShoppingCart className="h-8 w-8 text-green-600" />,
      bgColor: 'bg-green-100'
    },
    {
      title: 'Pending Orders',
      value: orders.filter(o => o.status === 'pending').length,
      icon: <TrendingUp className="h-8 w-8 text-yellow-600" />,
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Total Revenue',
      value: `$${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}`,
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage your agricultural marketplace</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor} mr-4`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Orders
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Manage Products</h2>
                  <button
                    onClick={handleAddProduct}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Product</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-12 w-12 rounded-lg object-cover mr-4"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {product.description.substring(0, 50)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.inStock 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.inStock ? `${product.stock} in stock` : 'Out of stock'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Manage Orders</h2>
                
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <select
                          value={order.status}
                          onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Customer</h4>
                          <p className="text-sm text-gray-600">{order.customerName}</p>
                          <p className="text-sm text-gray-600">{order.customerEmail}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                          <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Items</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.name} x{item.quantity}</span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Total:</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          product={selectedProduct}
          onSubmit={handleProductSubmit}
          onClose={() => setShowProductModal(false)}
        />
      )}
    </div>
  );
};

export default AdminPanel;