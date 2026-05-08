export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f8f6f1] py-16 px-6">
      <div className="max-w-[800px] mx-auto bg-white p-10 sm:p-14 rounded-2xl shadow-sm border border-[#e5e0d8]">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6" style={{ letterSpacing: '-0.5px' }}>
          Privacy Policy
        </h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed text-sm">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when you register for an account, 
              request property visits, or communicate with our support. This includes your name, email 
              address, phone number, and any other information you choose to provide.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to operate our platform, process visit requests, 
              communicate with you regarding listings, and improve our services to provide a better 
              student housing experience.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">3. Data Security</h2>
            <p>
              EstateHub takes reasonable measures to help protect information about you from loss, theft, 
              misuse, and unauthorized access. We do not sell or share your personal information with 
              unaffiliated third parties except as necessary to fulfill your accommodation requests.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">4. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through the 
              EstateHub dashboard or consult the campus administration for platform inquiries.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
