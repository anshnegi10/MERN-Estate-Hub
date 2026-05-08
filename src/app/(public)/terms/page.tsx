export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#f8f6f1] py-16 px-6">
      <div className="max-w-[800px] mx-auto bg-white p-10 sm:p-14 rounded-2xl shadow-sm border border-[#e5e0d8]">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6" style={{ letterSpacing: '-0.5px' }}>
          Terms and Conditions
        </h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed text-sm">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the EstateHub platform, you accept and agree to be bound by the terms and 
              provision of this agreement. Our services are tailored exclusively for the university community 
              surrounding the UPES Bidholi campus.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">2. Use of the Platform</h2>
            <p>
              EstateHub is intended to facilitate the discovery and booking of student housing. You agree to use 
              the platform for lawful purposes only. Submitting false information or spamming property owners 
              with illegitimate visit requests is strictly prohibited and may result in account suspension.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">3. Property Listings</h2>
            <p>
              While we strive to ensure that all properties listed on EstateHub are verified and accurate, we 
              cannot guarantee the complete accuracy of every listing. Students are strongly encouraged to use 
              our visit request feature to inspect properties in person before making any financial commitments.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">4. Modifications</h2>
            <p>
              EstateHub reserves the right to modify these Terms and Conditions at any time. We will do our best 
              to provide notice of any significant changes, but it is your responsibility to review this page 
              periodically.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
