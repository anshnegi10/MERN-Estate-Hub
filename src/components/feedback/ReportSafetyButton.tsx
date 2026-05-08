'use client';
import { useState } from 'react';
import FeedbackForm from './FeedbackForm';

export default function ReportSafetyButton({ propertyId, propertyName }: { propertyId: string; propertyName: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    if (showSuccess) {
        return (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center gap-3">
                <span className="text-xl">✅</span>
                <p className="text-green-800 font-bold text-sm">Thank you for your feedback! It is under review.</p>
            </div>
        );
    }

    return (
        <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Help improve safety for other students</p>
            <button 
                onClick={() => setIsOpen(true)}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all flex items-center justify-center gap-2"
            >
                ⚠️ Report Safety Concern
            </button>

            {isOpen && (
                <FeedbackForm 
                    propertyId={propertyId} 
                    propertyName={propertyName} 
                    onClose={() => setIsOpen(false)} 
                    onSuccess={() => {
                        setIsOpen(false);
                        setShowSuccess(true);
                    }} 
                />
            )}
        </div>
    );
}
