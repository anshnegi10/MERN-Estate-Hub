'use client';

interface Feedback {
    _id: string;
    issueType: string;
    message: string;
    status: string;
    createdAt: string;
}

interface FeedbackSummaryProps {
    feedbacks: Feedback[];
}

export default function FeedbackSummary({ feedbacks }: FeedbackSummaryProps) {
    if (!feedbacks || feedbacks.length === 0) {
        return null;
    }

    const totalReports = feedbacks.length;
    
    const issueCounts = feedbacks.reduce((acc: any, curr) => {
        acc[curr.issueType] = (acc[curr.issueType] || 0) + 1;
        return acc;
    }, {});

    const topIssue = Object.keys(issueCounts).sort((a, b) => issueCounts[b] - issueCounts[a])[0];

    // Determine safety severity
    let badgeState = { label: 'Safe', color: 'bg-green-100 text-green-800 border-green-200', icon: '✅' };
    if (totalReports > 10) {
        badgeState = { label: 'High Concerns', color: 'bg-red-100 text-red-800 border-red-200', icon: '🚨' };
    } else if (totalReports > 5) {
        badgeState = { label: 'Moderate Concerns', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '⚠️' };
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden mt-6">
            <div className="bg-red-50 p-5 border-b border-red-100 flex flex-wrap gap-4 justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-red-900 flex items-center gap-2">
                        <span>🛡️</span> User-Reported Safety Feedback
                    </h2>
                    <p className="text-sm text-red-700 mt-1">Direct feedback reported by students for this specific property.</p>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-sm font-bold border flex items-center gap-1.5 ${badgeState.color}`}>
                    {badgeState.icon} {badgeState.label}
                </div>
            </div>
            
            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Reports</p>
                        <p className="text-2xl font-black text-[#1F2937]">{totalReports} users</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Top Concern</p>
                        <p className="text-lg font-bold text-[#1F2937]">{topIssue}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{issueCounts[topIssue]} reports about this</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="font-semibold text-[#1F2937] border-b pb-2">Recent Mentions</p>
                    {feedbacks.slice(0, 3).map((f) => (
                        <div key={f._id} className="text-sm text-gray-600 bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                            <span className="font-bold text-gray-800">{f.issueType}: </span>
                            "{f.message}"
                            <div className="text-xs text-gray-400 mt-1">Reported on {new Date(f.createdAt).toLocaleDateString()}</div>
                        </div>
                    ))}
                    {totalReports > 3 && (
                        <p className="text-center text-xs font-bold text-gray-400 mt-2">+ {totalReports - 3} more reports</p>
                    )}
                </div>
            </div>
        </div>
    );
}
