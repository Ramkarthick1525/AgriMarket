import React from 'react'

const ContactUs = () => {
  return (
    <>
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-4xl font-bold text-green-800 text-center mb-6">Contact Us</h2>
    <p className="text-center text-gray-600 mb-12">
      Have questions or need help? Our team is here to support farmers and customers alike. Reach out to us anytime!
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Contact Info */}
      <div className="space-y-6 text-gray-700">
        <div>
          <h3 className="text-xl font-semibold text-green-700">📍 Address</h3>
          <p>AgriMart HQ<br />123 Green Lane, Coimbatore, Tamil Nadu, India</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-green-700">📞 Phone</h3>
          <p>+91 98765 43210</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-green-700">📧 Email</h3>
          <p>support@agrimart.in</p>
        </div>
      </div>

      {/* Contact Form */}
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="Your name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 h-32 resize-none focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="Write your message here..."></textarea>
        </div>
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
          Send Message
        </button>
      </form>
    </div>
  </div>
</div>

    </>
  )
}

export default ContactUs