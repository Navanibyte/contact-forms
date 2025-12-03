import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, ArrowRight, Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// This component handles both success and failure pages
export default function PaymentStatus() {
  const [status, setStatus] = useState<'success' | 'failure'>('success');
  const [transactionDetails, setTransactionDetails] = useState({
    orderId: 'ORD-2024-12345',
    amount: '599.00',
    plan: 'Professional',
    date: new Date().toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }),
    time: new Date().toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  });

  const navigate  = useNavigate()

  // Toggle between success and failure for demo
  const toggleStatus = () => {
    setStatus(status === 'success' ? 'failure' : 'success');
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard")
  }


  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          {/* Success Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header with Icon */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <CheckCircle className="w-16 h-16 text-green-500" strokeWidth={2} />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Payment Successful!
              </h1>
              <p className="text-green-50 text-lg">
                Your subscription has been activated
              </p>
            </div>

            {/* Transaction Details */}
            <div className="px-8 py-8">
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  Transaction Details
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-semibold text-gray-900">{transactionDetails.plan}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-semibold text-gray-900">₹{transactionDetails.amount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Order ID</span>
                    <span className="font-mono text-sm text-gray-900">{transactionDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date & Time</span>
                    <span className="text-gray-900">{transactionDetails.date} at {transactionDetails.time}</span>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
                <p className="text-green-800 text-center">
                  🎉 Welcome to {transactionDetails.plan} plan! You can now access all premium features.
                </p>
              </div>

              {/* What's Next */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">A confirmation email has been sent to your registered email address</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">You can download the invoice from your dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Start creating unlimited forms right away</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleBackToDashboard} className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center">
                  <Home className="w-5 h-5 mr-2" />
                  Back to Dashboard
                </button>
              </div>

              {/* Demo Toggle */}
              <div className="mt-6 text-center">
                <button
                  onClick={toggleStatus}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  View Failure Page (Demo)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Failure Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Failure Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with Icon */}
          <div className="bg-gradient-to-r from-red-500 to-orange-600 px-8 py-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <XCircle className="w-16 h-16 text-red-500" strokeWidth={2} />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Payment Failed
            </h1>
            <p className="text-red-50 text-lg">
              We couldn't process your payment
            </p>
          </div>

          {/* Error Details */}
          <div className="px-8 py-8">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
              <h2 className="text-sm font-semibold text-red-900 uppercase tracking-wide mb-3">
                What Happened?
              </h2>
              <p className="text-red-800">
                Your payment could not be completed. This might be due to insufficient funds, incorrect card details, or a network issue.
              </p>
            </div>

            {/* Transaction Details */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Transaction Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-semibold text-gray-900">{transactionDetails.plan}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-semibold text-gray-900">₹{transactionDetails.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-mono text-sm text-gray-900">{transactionDetails.orderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Date & Time</span>
                  <span className="text-gray-900">{transactionDetails.date} at {transactionDetails.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">Failed</span>
                </div>
              </div>
            </div>

            {/* Common Reasons */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Common Reasons for Payment Failure</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 flex-shrink-0">•</span>
                  <span className="text-gray-700 text-sm">Insufficient funds in your account</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 flex-shrink-0">•</span>
                  <span className="text-gray-700 text-sm">Incorrect card details or expired card</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 flex-shrink-0">•</span>
                  <span className="text-gray-700 text-sm">Payment gateway timeout or network issue</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 flex-shrink-0">•</span>
                  <span className="text-gray-700 text-sm">Card not enabled for online transactions</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 text-white py-4 rounded-xl font-semibold hover:from-red-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center">
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </button>
              <button className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </button>
            </div>

            {/* Support Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Need help? Contact our support team
              </p>
              <a href="#" className="text-orange-600 hover:text-orange-700 font-semibold text-sm">
                support@formbuilder.com
              </a>
            </div>

            {/* Demo Toggle */}
            <div className="mt-4 text-center">
              <button
                onClick={toggleStatus}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                View Success Page (Demo)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}