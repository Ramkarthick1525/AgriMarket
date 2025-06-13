import React from 'react'

const Aboutus = () => {
  return (
    <div className="bg-green-50 py-16 px-4 sm:px-6 lg:px-8">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-4xl font-bold text-green-800 mb-4">About AgriMart</h2>
    <p className="text-lg text-gray-700 mb-8">
      <span className="font-semibold">AgriMart</span> is your trusted online platform dedicated to connecting farmers, home producers, and eco-conscious buyers across India. We bring the richness of rural farming — organic, homemade, and sustainable products — directly to your home.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left text-gray-700">
      <div>
        <h3 className="text-xl font-semibold text-green-700 mb-2">🌾 Our Mission</h3>
        <p>
          Empower farmers and small businesses by removing middlemen, offering fair pricing, and building a sustainable agri-commerce ecosystem.
        </p>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-green-700 mb-2">🌿 Why AgriMart?</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>100% authentic and organic products</li>
          <li>Fair trade and direct-from-farm sourcing</li>
          <li>Eco-friendly packaging and delivery</li>
          <li>Empowering rural India and traditional practices</li>
        </ul>
      </div>
    </div>
    <p className="mt-10 text-md text-gray-600">
      At AgriMart, every purchase is a step toward a greener future and a stronger farming community. 🌱
    </p>
  </div>
</div>

  );
}

export default Aboutus