export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8f6f1] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1000px] mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F2937] mb-6 tracking-tight">
            About <span className="text-[#2d6a5e] relative inline-block">EstateHub<span className="absolute bottom-0 left-0 w-full h-[8px] bg-green-200/50 -z-10 rounded-full"></span></span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-[700px] mx-auto font-medium leading-relaxed">
            Your one-stop platform for discovering student accommodations and real estate opportunities. Built by students, for students. We simplify the process of finding, renting, and managing properties with ease and transparency.
          </p>
        </div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
            <div className="w-14 h-14 bg-green-50 text-[#2d6a5e] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
            </div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3">Smart Property Search</h2>
            <p className="text-gray-600 leading-relaxed">Find the perfect place with advanced filters, location-based search, and detailed property insights tailored specifically to your student needs.</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3">Secure & Trusted Platform</h2>
            <p className="text-gray-600 leading-relaxed">We ensure safe interactions with verified listings, secure authentication, and reliable communication between users.</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
            <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3">Affordable & Student-Friendly</h2>
            <p className="text-gray-600 leading-relaxed">Explore budget-friendly accommodations and deals designed specifically for students and young professionals managing their finances.</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3">Fast & Efficient</h2>
            <p className="text-gray-600 leading-relaxed">Save time with instant property bookings, live chat directly with verified owners, and seamless interface performance.</p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-br from-[#2d6a5e] to-[#1f4a42] rounded-3xl p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="relative z-10 text-center max-w-[700px] mx-auto">
            <h2 className="text-3xl font-extrabold mb-6">Our Mission</h2>
            <p className="text-lg md:text-xl text-green-50 font-medium leading-relaxed">
              We believe finding a home should be simple, accessible, and stress-free. EstateHub aims to bridge the gap between property owners and students by providing a seamless, secure, and user-friendly platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
