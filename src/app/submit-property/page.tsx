'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SubmitPropertyPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contact: '',
        amount: '',
        sharingBasis: 'Single',
        propertyType: 'Hostel',
        video: '',
    });

    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.role !== 'owner') {
                setIsAuthorized(false);
            } else {
                setIsAuthorized(true);
            }
        } catch (e) {
            console.error("Invalid token", e);
            router.push('/login');
        }
    }, [router]);

    const [images, setImages] = useState<string[]>(['']);
    
    const [facilities, setFacilities] = useState<Record<string, boolean>>({
        'Wifi': false,
        'Electricity Included': false,
        'Water': false,
        'Cleaner': false,
        'Washing Machine / Laundry': false,
        'Kitchen': false,
        'Hot-Water Supply': false,
        'With Food': false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFacilityToggle = (facility: string) => {
        setFacilities(prev => ({ ...prev, [facility]: !prev[facility] }));
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...images];
        newImages[index] = value;
        setImages(newImages);
    };

    const addImageField = () => {
        setImages([...images, '']);
    };

    const removeImageField = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        // Validation
        if (!formData.name || !formData.address || !formData.contact || !formData.amount) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        const selectedFacilities = Object.keys(facilities).filter(k => facilities[k]);
        const validImages = images.filter(img => img.trim() !== '');

        if (validImages.length < 3) {
            setError('Please provide at least 3 image URLs.');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch('/api/property', {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    facilities: selectedFacilities,
                    images: validImages
                })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                // Reset form
                setFormData({
                    name: '',
                    address: '',
                    contact: '',
                    amount: '',
                    sharingBasis: 'Single',
                    propertyType: 'Hostel',
                    video: '',
                });
                setImages(['']);
                setFacilities(Object.keys(facilities).reduce((acc, key) => ({ ...acc, [key]: false }), {}));
                
                // Optional: redirect to profile or explore
                setTimeout(() => {
                    router.push('/explore');
                }, 2000);
            } else {
                setError(data.error || 'Failed to submit property.');
            }
        } catch (err) {
            setError('A network error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (isAuthorized === false) {
        return (
            <div className="min-h-screen bg-[#f8f6f1] flex flex-col items-center justify-center px-4 font-sans">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-[#e5e0d8]">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-6">Only registered property owners can access this page and submit new listings.</p>
                    <Link href="/explore" className="block w-full bg-[#2d6a5e] text-white font-bold py-3 px-4 rounded-xl hover:bg-[#1a4a3a] transition-colors">
                        Return to Explore
                    </Link>
                </div>
            </div>
        );
    }

    if (isAuthorized === null) {
        return (
            <div className="min-h-screen bg-[#f8f6f1] flex flex-col items-center justify-center">
                <svg className="w-12 h-12 animate-spin text-[#2d6a5e] mb-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <p className="text-gray-500 font-medium">Verifying access...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f6f1] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-[#0f2922] mb-3 tracking-tight">List Your Property</h1>
                    <p className="text-[#2d6a5e] text-lg">Join the EstateHub network and reach thousands of UPES students.</p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#e5e0d8]">
                    <div className="bg-gradient-to-r from-[#0f2922] to-[#1a4a3a] px-8 py-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span>📋</span> Property Details
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        
                        {/* Error & Success Messages */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700 font-medium">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-green-700 font-medium">Property listed successfully! Redirecting...</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Basic Info Section */}
                        <div className="space-y-5">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">1. Basic Information</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Name *</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6a5e] focus:border-transparent outline-none transition-all" placeholder="e.g. Sunrise Premium Hostel" />
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6a5e] focus:border-transparent outline-none transition-all" placeholder="e.g. Near UPES Bidholi Campus, Dehradun" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Owner Contact Number *</label>
                                    <input type="tel" name="contact" value={formData.contact} onChange={handleChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6a5e] focus:border-transparent outline-none transition-all" placeholder="+91 XXXXX XXXXX" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (₹) *</label>
                                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} required min="1000" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6a5e] focus:border-transparent outline-none transition-all" placeholder="e.g. 15000" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sharing Basis *</label>
                                    <select name="sharingBasis" value={formData.sharingBasis} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6a5e] focus:border-transparent outline-none transition-all">
                                        <option value="Single">Single</option>
                                        <option value="Double">Double</option>
                                        <option value="Triple">Triple</option>
                                        <option value="Entire Flat">Entire Flat</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type *</label>
                                    <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6a5e] focus:border-transparent outline-none transition-all">
                                        <option value="Hostel">Hostel</option>
                                        <option value="PG">PG</option>
                                        <option value="Flat">Flat</option>
                                        <option value="Apartment">Apartment</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Facilities Section */}
                        <div className="space-y-5">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">2. Facilities Provided</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.keys(facilities).map((facility) => (
                                    <label key={facility} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${facilities[facility] ? 'bg-[#eefcf5] border-[#2d6a5e] text-[#0f2922]' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                        <input type="checkbox" className="hidden" checked={facilities[facility]} onChange={() => handleFacilityToggle(facility)} />
                                        <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${facilities[facility] ? 'bg-[#2d6a5e] border-[#2d6a5e]' : 'border-gray-300'}`}>
                                            {facilities[facility] && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                        <span className="text-sm font-medium">{facility}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Media Section */}
                        <div className="space-y-5">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">3. Media & Photos</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URLs (Minimum 3 required) *</label>
                                    <div className="space-y-3">
                                        {images.map((img, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input 
                                                    type="url" 
                                                    value={img} 
                                                    onChange={(e) => handleImageChange(index, e.target.value)} 
                                                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6a5e] focus:border-transparent outline-none transition-all" 
                                                    placeholder="https://example.com/image.jpg" 
                                                />
                                                {images.length > 1 && (
                                                    <button type="button" onClick={() => removeImageField(index)} className="px-3 py-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button type="button" onClick={addImageField} className="mt-3 text-sm font-semibold text-[#2d6a5e] hover:text-[#1a4a3a] flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                        Add Another Image
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Video Tour URL (Optional)</label>
                                    <input type="url" name="video" value={formData.video} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6a5e] focus:border-transparent outline-none transition-all" placeholder="https://youtube.com/watch?v=..." />
                                </div>
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="pt-6 flex gap-4">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-[#2d6a5e] to-[#1a4a3a] text-white py-3.5 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                            >
                                {loading ? (
                                    <><svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg> Submitting...</>
                                ) : (
                                    <>🚀 Submit Property Listing</>
                                )}
                            </button>
                            <Link href="/explore" className="px-6 py-3.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center">
                                Cancel
                            </Link>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
