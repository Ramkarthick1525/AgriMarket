import React from 'react'

const services = () => {
  


return (
    <div className="bg-gray-100 py-16 px-6 sm:px-10 lg:px-20">
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-4xl font-bold text-green-800 mb-4">Our Services</h2>
    <p className="text-gray-600 mb-12">
      Empowering farmers and connecting customers with quality agricultural products through innovative and reliable services.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {/* Service 1 */}
      <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition">
        <div className="text-green-600 text-4xl mb-4">🛒</div>
        <h3 className="text-xl font-semibold text-green-700 mb-2">Online Product Marketplace</h3>
        <p className="text-gray-600">Buy and sell fresh farm produce, fertilizers, seeds, and agri-tools with verified listings and simple checkout.</p>
      </div>

      {/* Service 2 */}
      <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition">
        <div className="text-green-600 text-4xl mb-4">🚚</div>
        <h3 className="text-xl font-semibold text-green-700 mb-2">Doorstep Delivery</h3>
        <p className="text-gray-600">Get agricultural products delivered straight to your farm or home with fast, safe, and affordable logistics.</p>
      </div>

      {/* Service 3 */}
      <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition">
        <div className="text-green-600 text-4xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-green-700 mb-2">Bulk & Wholesale Orders</h3>
        <p className="text-gray-600">Support for wholesalers and businesses with large quantity purchases and custom quotations.</p>
      </div>

      {/* Service 4 */}
      <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition">
        <div className="text-green-600 text-4xl mb-4">📞</div>
        <h3 className="text-xl font-semibold text-green-700 mb-2">24/7 Customer Support</h3>
        <p className="text-gray-600">Our friendly support team is always ready to assist farmers and customers via chat, call, or email.</p>
      </div>

      {/* Service 5 */}
      <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition">
        <div className="text-green-600 text-4xl mb-4">✅</div>
        <h3 className="text-xl font-semibold text-green-700 mb-2">Verified Organic Sellers</h3>
        <p className="text-gray-600">All organic products are sourced from certified farmers, ensuring natural quality and safe consumption.</p>
      </div>

      {/* Service 6 */}
      <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition">
        <div className="text-green-600 text-4xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-green-700 mb-2">Farmer Dashboard</h3>
        <p className="text-gray-600">Manage listings, track orders, earnings, and product performance in one easy-to-use interface.</p>
      </div>
    </div>
  </div>
</div>

)
}

export default services