import React, { useEffect, useState } from 'react';
import { XCircle, Home, RefreshCw, AlertCircle, Mail, Phone } from 'lucide-react';

export default function PaymentFailure() {
  const [transactionDetails, setTransactionDetails] = useState({
    orderId: '',
    amount: '',
    plan: '',
    date: '',
    time: '',
    errorMessage: ''
  });

  useEffect(() => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    setTransactionDetails({
      orderId: urlParams.get('txnid') || 'ORD-2024-12345',
      amount: urlParams.get('amount') || '599.00',
      plan: urlParams.get('productinfo') || 'Professional',
      date: new Date().toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }),
      time: new Date().toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      errorMessage: urlParams.get('error_Message') || 'Payment could not be processed'
    });
  }, []);

  const handleRetry = () => {
    // Redirect back to plans page
    window.location.href = '/plans';
  };

  const handleHome = () => {
    // Redirect to home/dashboard
    window.location.href = '/';
  };

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
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 flex items-start">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-semibold text-red-900 uppercase tracking-wide mb-2">
                  What Happened?
                </h2>
                <p className="text-red-800 mb-2">
                  {transactionDetails.errorMessage}
                </p>
                <p className="text-red-700 text-sm">
                  Don't worry, no amount has been deducted from your account.
                </p>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Transaction Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-semibold text-gray-900">{transactionDetails.plan}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-semibold text-gray-900">₹{transactionDetails.amount}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-mono text-sm text-gray-900">{transactionDetails.orderId}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Date & Time</span>
                  <span className="text-gray-900">{transactionDetails.date} at {transactionDetails.time}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Status</span>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                    Failed
                  </span>
                </div>
              </div>
            </div>

            {/* Common Reasons */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                Common Reasons for Payment Failure
              </h3>
              <div className="bg-gray-50 rounded-xl p-5">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 flex-shrink-0 mt-1">•</span>
                    <span className="text-gray-700 text-sm">Insufficient funds in your account</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 flex-shrink-0 mt-1">•</span>
                    <span className="text-gray-700 text-sm">Incorrect card details or expired card</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 flex-shrink-0 mt-1">•</span>
                    <span className="text-gray-700 text-sm">Payment gateway timeout or network issue</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 flex-shrink-0 mt-1">•</span>
                    <span className="text-gray-700 text-sm">Card not enabled for online transactions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 flex-shrink-0 mt-1">•</span>
                    <span className="text-gray-700 text-sm">Daily transaction limit exceeded</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button 
                onClick={handleRetry}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-orange-200"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </button>
              <button 
                onClick={handleHome}
                className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-gray-200"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </button>
            </div>

            {/* Support Section */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
              <h3 className="font-semibold text-gray-900 mb-3 text-center">
                Need Help?
              </h3>
              <p className="text-sm text-gray-700 text-center mb-4">
                If you continue to face issues, our support team is here to help
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a 
                  href="mailto:support@formbuilder.com"
                  className="flex items-center justify-center px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-all shadow-sm"
                >
                  <Mail className="w-4 h-4 mr-2 text-orange-600" />
                  support@formbuilder.com
                </a>
                <a 
                  href="tel:+911234567890"
                  className="flex items-center justify-center px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-all shadow-sm"
                >
                  <Phone className="w-4 h-4 mr-2 text-orange-600" />
                  +91 123 456 7890
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Transaction ID: {transactionDetails.orderId}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Please save this for your records
          </p>
        </div>
      </div>
    </div>
  );
}