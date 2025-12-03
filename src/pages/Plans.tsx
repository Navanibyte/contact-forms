// import React, { useEffect, useState } from 'react';
// import { Check, Sparkles, Zap, Crown, Star, ArrowRight } from 'lucide-react';

// const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// interface Plan {
//   id: number;
//   plan_name: string;
//   price: number;
//   description: string;
//   duration?: string;
//   features?: string[];
//   popular?: boolean;
//   icon?: string;
//   color?: string;
// }

// interface CreateSubscriptionResponse {
//   order_id: string;
//   amount: number;
//   productinfo: string;
// }

// interface PayUInitiateResponse {
//   payu_url: string;
//   [key: string]: string;
// }

// // Mock data fallback
// const MOCK_PLANS: Plan[] = [
//   {
//     id: 1,
//     plan_name: 'Starter',
//     price: 299,
//     duration: 'month',
//     description: 'Perfect for individuals and small projects',
//     features: [
//       'Up to 5 forms',
//       '100 responses per month',
//       'Basic form fields',
//       'Email notifications',
//       'Data export (CSV)',
//       'Mobile responsive forms',
//       '7-day data retention'
//     ],
//     icon: 'sparkles',
//     color: 'blue'
//   },
//   {
//     id: 2,
//     plan_name: 'Professional',
//     price: 599,
//     duration: 'month',
//     description: 'Best for professionals and growing teams',
//     features: [
//       'Unlimited forms',
//       '1,000 responses per month',
//       'All form field types',
//       'Custom branding & themes',
//       'Advanced logic & conditions',
//       'File uploads (up to 10MB)',
//       'Payment integration (PayU)',
//       'Email & SMS notifications',
//       'Data export (CSV, Excel, PDF)',
//       'API access',
//       '90-day data retention',
//       'Priority email support'
//     ],
//     popular: true,
//     icon: 'zap',
//     color: 'purple'
//   },
//   {
//     id: 3,
//     plan_name: 'Enterprise',
//     price: 1299,
//     duration: 'month',
//     description: 'For organizations with advanced requirements',
//     features: [
//       'Everything in Professional',
//       'Unlimited responses',
//       'Team collaboration (10 users)',
//       'Advanced analytics & reports',
//       'Custom domain & SSL',
//       'Webhooks & integrations',
//       'Multi-language forms',
//       'GDPR compliance tools',
//       'White-label solution',
//       'Unlimited file uploads',
//       'Database integration',
//       'Lifetime data retention',
//       '24/7 priority support',
//       'Dedicated account manager'
//     ],
//     icon: 'crown',
//     color: 'amber'
//   }
// ];

// export default function Plans(): JSX.Element {
//   const [plans, setPlans] = useState<Plan[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [processingPlanId, setProcessingPlanId] = useState<number | null>(null);
//   const [usingMockData, setUsingMockData] = useState(false);

//   useEffect(() => {
//     fetchPlans();
//   }, []);

//   const fetchPlans = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API}/plans`);
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch plans');
//       }
      
//       const data = await response.json();
      
//       if (!data || data.length === 0) {
//         console.warn('API returned empty data, using mock plans');
//         setPlans(MOCK_PLANS);
//         setUsingMockData(true);
//       } else {
//         setPlans(data);
//         setUsingMockData(false);
//       }
//       setError(null);
//     } catch (err) {
//       console.warn('API not available, using mock data:', err);
//       setPlans(MOCK_PLANS);
//       setUsingMockData(true);
//       setError(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const buy = async (plan: Plan): Promise<void> => {
//     if (processingPlanId !== null) return;
    
//     if (usingMockData) {
//       alert(`Demo Mode: You selected ${plan.plan_name} for ₹${plan.price}. Connect to the API for actual payments.`);
//       return;
//     }
    
//     setProcessingPlanId(plan.id);
    
//     try {
//       const createRes = await fetch(`${API}/subscriptions/create`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           user_id: 1,
//           plan_id: plan.id
//         })
//       });

//       if (!createRes.ok) {
//         throw new Error(`Failed to create subscription: ${createRes.statusText}`);
//       }
      
//       const createData: CreateSubscriptionResponse = await createRes.json();
//       const { order_id, amount, productinfo } = createData;

//       const payRes = await fetch(`${API}/payu/initiate`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           txnid: order_id,
//           amount: amount.toString(),
//           productinfo,
//           firstname: 'Customer Name',
//           email: 'customer@example.com'
//         })
//       });

//       if (!payRes.ok) {
//         throw new Error(`Failed to initiate payment: ${payRes.statusText}`);
//       }
      
//       const data: PayUInitiateResponse = await payRes.json();

//       const form = document.createElement('form');
//       form.method = 'POST';
//       form.action = data.payu_url;

//       Object.keys(data).forEach(key => {
//         if (key === 'payu_url') return;
//         const input = document.createElement('input');
//         input.type = 'hidden';
//         input.name = key;
//         input.value = data[key];
//         form.appendChild(input);
//       });

//       document.body.appendChild(form);
//       form.submit();
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Payment failed';
//       console.error('Payment error:', error);
//       alert(`Error: ${errorMessage}. Please try again.`);
//       setProcessingPlanId(null);
//     }
//   };

//   const getIcon = (iconName?: string) => {
//     switch (iconName) {
//       case 'sparkles':
//         return <Sparkles className="w-7 h-7" />;
//       case 'zap':
//         return <Zap className="w-7 h-7" />;
//       case 'crown':
//         return <Crown className="w-7 h-7" />;
//       default:
//         return <Sparkles className="w-7 h-7" />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary"></div>
//           <p className="mt-4 text-gray-600 font-medium">Loading plans...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 rounded-full mb-6">
//             <Star className="w-4 h-4 text-primary mr-2" />
//             <span className="text-sm font-semibold text-primary">Form Builder Pricing Plans</span>
//           </div>
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
//             Build Forms Without Limits
//           </h1>
//           <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
//             Powerful drag-and-drop form builder with advanced features.<br />
//             Create surveys, registration forms, payment forms, and more.
//           </p>
//         </div>

//         {/* Feature Highlights */}
//         <div className="max-w-6xl mx-auto mb-16">
//           <div className="grid md:grid-cols-4 gap-4">
//             <div className="bg-white rounded-xl p-5 shadow-sm text-center border border-gray-100">
//               <div className="text-3xl mb-2">📝</div>
//               <p className="text-sm font-semibold text-gray-900">Drag & Drop Builder</p>
//             </div>
//             <div className="bg-white rounded-xl p-5 shadow-sm text-center border border-gray-100">
//               <div className="text-3xl mb-2">🎨</div>
//               <p className="text-sm font-semibold text-gray-900">Custom Branding</p>
//             </div>
//             <div className="bg-white rounded-xl p-5 shadow-sm text-center border border-gray-100">
//               <div className="text-3xl mb-2">💳</div>
//               <p className="text-sm font-semibold text-gray-900">Payment Integration</p>
//             </div>
//             <div className="bg-white rounded-xl p-5 shadow-sm text-center border border-gray-100">
//               <div className="text-3xl mb-2">📊</div>
//               <p className="text-sm font-semibold text-gray-900">Analytics & Reports</p>
//             </div>
//           </div>
//         </div>

//         {/* What's Included Overview */}
//         <div className="max-w-6xl mx-auto mb-16">
//           <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-3xl p-8 md:p-10 border border-orange-200/50">
//             <div className="text-center mb-8">
//               <h2 className="text-3xl font-bold text-gray-900 mb-3">What's Included in Every Plan</h2>
//               <p className="text-gray-700 max-w-2xl mx-auto">
//                 All our plans come with essential form builder features to help you create, customize, and manage forms effortlessly.
//               </p>
//             </div>
//             <div className="grid md:grid-cols-3 gap-6">
//               <div className="bg-white rounded-xl p-6 shadow-sm">
//                 <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
//                   <span className="text-2xl">🎯</span>
//                 </div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Intuitive Form Builder</h3>
//                 <p className="text-sm text-gray-600 leading-relaxed">
//                   Create beautiful forms in minutes with our easy-to-use drag-and-drop interface. No coding required.
//                 </p>
//               </div>
//               <div className="bg-white rounded-xl p-6 shadow-sm">
//                 <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
//                   <span className="text-2xl">📱</span>
//                 </div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Mobile Responsive</h3>
//                 <p className="text-sm text-gray-600 leading-relaxed">
//                   All forms automatically adapt to any device. Perfect experience on desktop, tablet, and mobile.
//                 </p>
//               </div>
//               <div className="bg-white rounded-xl p-6 shadow-sm">
//                 <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
//                   <span className="text-2xl">📧</span>
//                 </div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Email Notifications</h3>
//                 <p className="text-sm text-gray-600 leading-relaxed">
//                   Get instant email alerts when someone submits a form. Never miss a response.
//                 </p>
//               </div>
//               <div className="bg-white rounded-xl p-6 shadow-sm">
//                 <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
//                   <span className="text-2xl">📥</span>
//                 </div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Data Export</h3>
//                 <p className="text-sm text-gray-600 leading-relaxed">
//                   Export your form responses to CSV, Excel, or PDF for easy analysis and reporting.
//                 </p>
//               </div>
//               <div className="bg-white rounded-xl p-6 shadow-sm">
//                 <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
//                   <span className="text-2xl">🔒</span>
//                 </div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
//                 <p className="text-sm text-gray-600 leading-relaxed">
//                   Your data is encrypted and secure. We follow industry best practices to protect your information.
//                 </p>
//               </div>
//               <div className="bg-white rounded-xl p-6 shadow-sm">
//                 <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
//                   <span className="text-2xl">⚡</span>
//                 </div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Fast & Reliable</h3>
//                 <p className="text-sm text-gray-600 leading-relaxed">
//                   Lightning-fast form loading times and 99.9% uptime guarantee. Your forms are always available.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Demo Mode Banner */}
//         {usingMockData && (
//           <div className="max-w-4xl mx-auto mb-10">
//             <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-5 shadow-sm">
//               <div className="flex items-start">
//                 <div className="flex-shrink-0">
//                   <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 <div className="ml-4">
//                   <p className="text-sm font-semibold text-gray-900">Demo Mode Active</p>
//                   <p className="text-sm text-gray-700 mt-1">
//                     Displaying sample plans. Connect to your API for live pricing and payment processing.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Plans Grid */}
//         <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
//           {plans.map((plan, index) => (
//             <div
//               key={plan.id}
//               className={`relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
//                 plan.popular ? 'ring-2 ring-primary scale-105 lg:scale-110' : ''
//               }`}
//               style={{ zIndex: plan.popular ? 10 : 1 }}
//             >
//               {/* Popular Badge */}
//               {plan.popular && (
//                 <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
//                   <div className="bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-2 rounded-full font-semibold text-sm shadow-lg flex items-center">
//                     <Star className="w-4 h-4 mr-2 fill-current" />
//                     Most Popular
//                   </div>
//                 </div>
//               )}

//               {/* Plan Content */}
//               <div className={`${plan.popular ? 'pt-10' : 'pt-8'}`}>
//                 {/* Icon & Name */}
//                 <div className="px-8 pb-6">
//                   <div className="flex justify-center mb-5">
//                     <div className={`p-4 rounded-2xl ${plan.popular ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-700'}`}>
//                       {getIcon(plan.icon)}
//                     </div>
//                   </div>
//                   <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
//                     {plan.plan_name}
//                   </h2>
//                   <p className="text-sm text-gray-600 text-center leading-relaxed">
//                     {plan.description}
//                   </p>
//                 </div>

//                 {/* Pricing */}
//                 <div className="px-8 pb-6">
//                   <div className="flex items-end justify-center mb-2">
//                     <span className="text-5xl font-bold text-gray-900">₹{plan.price}</span>
//                     {plan.duration && (
//                       <span className="text-lg text-gray-600 ml-2 mb-2">/{plan.duration}</span>
//                     )}
//                   </div>
//                   <p className="text-center text-sm text-gray-500">Billed monthly</p>
//                 </div>

//                 {/* CTA Button */}
//                 <div className="px-8 pb-6">
//                   <button
//                     onClick={() => buy(plan)}
//                     disabled={processingPlanId === plan.id}
//                     className={`group w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
//                       plan.popular
//                         ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl'
//                         : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
//                     } disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-orange-200`}
//                   >
//                     {processingPlanId === plan.id ? (
//                       <>
//                         <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Processing...
//                       </>
//                     ) : (
//                       <>
//                         Get Started
//                         <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                       </>
//                     )}
//                   </button>
//                 </div>

//                 {/* Divider */}
//                 <div className="px-8 pb-6">
//                   <div className="border-t border-gray-100"></div>
//                 </div>

//                 {/* Features List */}
//                 <div className="px-8 pb-8">
//                   <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
//                     What's included
//                   </p>
//                   <ul className="space-y-3">
//                     {(plan.features || [plan.description]).map((feature, idx) => (
//                       <li key={idx} className="flex items-start">
//                         <div className="flex-shrink-0 mt-0.5">
//                           <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
//                             <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
//                           </div>
//                         </div>
//                         <span className="ml-3 text-sm text-gray-700 leading-relaxed">{feature}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Trust Badges */}
//         <div className="max-w-6xl mx-auto mb-16">
//           <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Everything You Need to Build Better Forms</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Check className="w-6 h-6 text-green-600" />
//               </div>
//               <h4 className="font-semibold text-gray-900 mb-2 text-center">14-Day Money Back</h4>
//               <p className="text-sm text-gray-600 text-center">Not satisfied? Get a full refund, no questions asked.</p>
//             </div>
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Zap className="w-6 h-6 text-blue-600" />
//               </div>
//               <h4 className="font-semibold text-gray-900 mb-2 text-center">Instant Activation</h4>
//               <p className="text-sm text-gray-600 text-center">Start creating forms immediately after signup.</p>
//             </div>
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//               <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Star className="w-6 h-6 text-purple-600" />
//               </div>
//               <h4 className="font-semibold text-gray-900 mb-2 text-center">Cancel Anytime</h4>
//               <p className="text-sm text-gray-600 text-center">No long-term contracts. Pause or cancel anytime.</p>
//             </div>
//           </div>
//         </div>

//         {/* Form Builder Features Comparison */}
//         <div className="max-w-6xl mx-auto mb-16">
//           <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10 border border-gray-100">
//             <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Compare Form Builder Features</h3>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b-2 border-gray-200">
//                     <th className="text-left py-4 px-4 font-semibold text-gray-900">Features</th>
//                     <th className="text-center py-4 px-4 font-semibold text-gray-900">Starter</th>
//                     <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-primary/5">Professional</th>
//                     <th className="text-center py-4 px-4 font-semibold text-gray-900">Enterprise</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   <tr>
//                     <td className="py-4 px-4 text-sm text-gray-700">Number of Forms</td>
//                     <td className="text-center py-4 px-4 text-sm text-gray-900 font-medium">5</td>
//                     <td className="text-center py-4 px-4 text-sm text-gray-900 font-medium bg-primary/5">Unlimited</td>
//                     <td className="text-center py-4 px-4 text-sm text-gray-900 font-medium">Unlimited</td>
//                   </tr>
//                   <tr>
//                     <td className="py-4 px-4 text-sm text-gray-700">Responses per Month</td>
//                     <td className="text-center py-4 px-4 text-sm text-gray-900 font-medium">100</td>
//                     <td className="text-center py-4 px-4 text-sm text-gray-900 font-medium bg-primary/5">1,000</td>
//                     <td className="text-center py-4 px-4 text-sm text-gray-900 font-medium">Unlimited</td>
//                   </tr>
//                   <tr>
//                     <td className="py-4 px-4 text-sm text-gray-700">Drag & Drop Builder</td>
//                     <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
//                     <td className="text-center py-4 px-4 bg-primary/5"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
//                     <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
//                   </tr>
//                   <tr>
//                     <td className="py-4 px-4 text-sm text-gray-700">Custom Branding & Themes</td>
//                     <td className="text-center py-4 px-4"><span className="text-gray-300">—</span></td>
//                     <td className="text-center py-4 px-4 bg-primary/5"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
//                     <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
//                   </tr>
//                   <tr>
//                     <td className="py-4 px-4 text-sm text-gray-700">Conditional Logic</td>
//                     <td className="text-center py-4 px-4"><span className="text-gray-300">—</span></td>
//                     <td className="text-center py-4 px-4 bg-primary/5"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
//                     <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
//                   </tr>
//                   <tr>
//                     <td className="py-4 px-4 text-sm text-gray-700">Payment Integration (PayU)</td>
//                     <td className="text-center py-4 px-4"><span className="text-gray-300">—</span></td>
//                     <td className="text-center py-4 px-4 bg-primary/5"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
//                     <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
//                   </tr>
//                   <tr>
//                     <td className="py-4 px-4 text-sm text-gray-700">File Uploads</td>
//                     <td className="text-center py-4 px-4"><span className="text-gray-300">—</span></td>
//                     <td className="text-center py-4 px-4 bg-primary/5">Up to 10MB</td>
//                     <td className="text-center py-4 px-4">Unlimited</td>
//                   </tr>
//                   <tr>
//                     <td className="py-4 px-4 text-sm text-gray-700">Team Collaboration</td>
//                     <td className="text-center py-4 px-4"><span className="text-gray-300">—</span></td>
//                     <td className="text-center py-4 px-4 bg-primary/5"><span className="text-gray-300">—</span></td>
//                     <td className="text-center py-4 px-4">10 users</td>
//                   </tr>
//                   <tr>
//                     <td className="py-4 px-4 text-sm text-gray-700">API Access</td>
//                     <td className="text-center py-4 px-4"><span className="text-gray-300">—</span></td>
//                     <td className="text-center py-4 px-4 bg-primary/5"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
//                     <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
//                   </tr>
//                   <tr>
//                     <td className="py-4 px-4 text-sm text-gray-700">Advanced Analytics</td>
//                     <td className="text-center py-4 px-4"><span className="text-gray-300">—</span></td>
//                     <td className="text-center py-4 px-4 bg-primary/5"><span className="text-gray-300">—</span></td>
//                     <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
//                   </tr>
//                   <tr>
//                     <td className="py-4 px-4 text-sm text-gray-700">White Label</td>
//                     <td className="text-center py-4 px-4"><span className="text-gray-300">—</span></td>
//                     <td className="text-center py-4 px-4 bg-primary/5"><span className="text-gray-300">—</span></td>
//                     <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
//                   </tr>
//                   <tr>
//                     <td className="py-4 px-4 text-sm text-gray-700">Support</td>
//                     <td className="text-center py-4 px-4 text-sm text-gray-700">Email</td>
//                     <td className="text-center py-4 px-4 text-sm text-gray-700 bg-primary/5">Priority Email</td>
//                     <td className="text-center py-4 px-4 text-sm text-gray-700">24/7 Priority</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* FAQ/Contact Section */}
//         <div className="text-center">
//           <div className="bg-gradient-to-r from-primary/5 to-purple-50 rounded-3xl p-10 max-w-3xl mx-auto">
//             <h3 className="text-2xl font-bold text-gray-900 mb-3">Still have questions?</h3>
//             <p className="text-gray-600 mb-6 leading-relaxed">
//               Our team is here to help you choose the right plan for your needs.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <a
//                 href="#"
//                 className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
//               >
//                 View Pricing FAQ
//               </a>
//               <a
//                 href="#"
//                 className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-md hover:from-orange-600 hover:to-orange-700 hover:shadow-lg transition-all"
//               >
//                 Contact Sales
//                 <ArrowRight className="w-5 h-5 ml-2" />
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { Check, Sparkles, Zap, Crown, Star, ArrowRight, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Plan {
  id: number;
  plan_name: string;
  price: number;
  description: string;
  duration?: string;
  features?: string[];
  popular?: boolean;
  icon?: string;
  color?: string;
}

interface CreateSubscriptionResponse {
  order_id: string;
  amount: number;
  productinfo: string;
}

interface PayUInitiateResponse {
  payu_url: string;
  [key: string]: string;
}

// Mock data fallback
const MOCK_PLANS: Plan[] = [
  {
    id: 1,
    plan_name: 'Starter',
    price: 299,
    duration: 'month',
    description: 'Perfect for individuals and small projects',
    features: [
      'Up to 5 forms',
      '100 responses per month',
      'Basic form fields',
      'Email notifications',
      'Data export (CSV)',
      'Mobile responsive forms',
      '7-day data retention'
    ],
    icon: 'sparkles',
    color: 'blue'
  },
  {
    id: 2,
    plan_name: 'Professional',
    price: 599,
    duration: 'month',
    description: 'Best for professionals and growing teams',
    features: [
      'Unlimited forms',
      '1,000 responses per month',
      'All form field types',
      'Custom branding & themes',
      'Advanced logic & conditions',
      'File uploads (up to 10MB)',
      'Payment integration (PayU)',
      'Email & SMS notifications',
      'Data export (CSV, Excel, PDF)',
      'API access',
      '90-day data retention',
      'Priority email support'
    ],
    popular: true,
    icon: 'zap',
    color: 'purple'
  },
  {
    id: 3,
    plan_name: 'Enterprise',
    price: 1299,
    duration: 'month',
    description: 'For organizations with advanced requirements',
    features: [
      'Everything in Professional',
      'Unlimited responses',
      'Team collaboration (10 users)',
      'Advanced analytics & reports',
      'Custom domain & SSL',
      'Webhooks & integrations',
      'Multi-language forms',
      'GDPR compliance tools',
      'White-label solution',
      'Unlimited file uploads',
      'Database integration',
      'Lifetime data retention',
      '24/7 priority support',
      'Dedicated account manager'
    ],
    icon: 'crown',
    color: 'amber'
  }
];

export default function Plans(): JSX.Element {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPlanId, setProcessingPlanId] = useState<number | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/plans`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }
      
      const data = await response.json();
      
      if (!data || data.length === 0) {
        console.warn('API returned empty data, using mock plans');
        setPlans(MOCK_PLANS);
        setUsingMockData(true);
      } else {
        setPlans(data);
        setUsingMockData(false);
      }
      setError(null);
    } catch (err) {
      console.warn('API not available, using mock data:', err);
      setPlans(MOCK_PLANS);
      setUsingMockData(true);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const buy = async (plan: Plan): Promise<void> => {
    if (processingPlanId !== null) return;
    
    if (usingMockData) {
      alert(`Demo Mode: You selected ${plan.plan_name} for ₹${plan.price}. Connect to the API for actual payments.`);
      return;
    }
    
    setProcessingPlanId(plan.id);
    
    try {
      const createRes = await fetch(`${API}/subscriptions/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: 1,
          plan_id: plan.id
        })
      });

      if (!createRes.ok) {
        throw new Error(`Failed to create subscription: ${createRes.statusText}`);
      }
      
      const createData: CreateSubscriptionResponse = await createRes.json();
      const { order_id, amount, productinfo } = createData;

      const payRes = await fetch(`${API}/payu/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          txnid: order_id,
          amount: amount.toString(),
          productinfo,
          firstname: 'Customer Name',
          email: 'customer@example.com'
        })
      });

      if (!payRes.ok) {
        throw new Error(`Failed to initiate payment: ${payRes.statusText}`);
      }
      
      const data: PayUInitiateResponse = await payRes.json();

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.payu_url;

      Object.keys(data).forEach(key => {
        if (key === 'payu_url') return;
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      console.error('Payment error:', error);
      alert(`Error: ${errorMessage}. Please try again.`);
      setProcessingPlanId(null);
    }
  };

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'sparkles':
        return <Sparkles className="w-7 h-7" />;
      case 'zap':
        return <Zap className="w-7 h-7" />;
      case 'crown':
        return <Crown className="w-7 h-7" />;
      default:
        return <Sparkles className="w-7 h-7" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading plans...</p>
        </div>
      </div>
    );
  }

  const handleDashboard = () => {
     navigate('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}

          <div className = 'flex justify-end w-full '>
                <button
                 onClick={handleDashboard}
              className="text-primary inline-flex items-center justify-center px-4 py-2 bg-primary/10 rounded-full mb-6 font-bold text-lg"
            >
              {/* <ArrowRight size={20} /> */}
              Go to Dashboard
              <ArrowUpRight  size = {30}/>


            </button>
            </div>

        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Star className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-semibold text-primary">Form Craft Pricing Plans</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Build Forms Without Limits
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Powerful drag-and-drop form builder with advanced features.<br />
            Create surveys, registration forms, payment forms, and more.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm text-center border border-gray-100">
              <div className="text-3xl mb-2">📝</div>
              <p className="text-sm font-semibold text-gray-900">Drag & Drop Builder</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm text-center border border-gray-100">
              <div className="text-3xl mb-2">🎨</div>
              <p className="text-sm font-semibold text-gray-900">Custom Branding</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm text-center border border-gray-100">
              <div className="text-3xl mb-2">💳</div>
              <p className="text-sm font-semibold text-gray-900">Payment Integration</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm text-center border border-gray-100">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-sm font-semibold text-gray-900">Analytics & Reports</p>
            </div>
          </div>
        </div>

        {/* What's Included Overview */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-3xl p-8 md:p-10 border border-orange-200/50">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">What's Included in Every Plan</h2>
              <p className="text-gray-700 max-w-2xl mx-auto">
                All our plans come with essential form builder features to help you create, customize, and manage forms effortlessly.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Intuitive Form Builder</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Create beautiful forms in minutes with our easy-to-use drag-and-drop interface. No coding required.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Mobile Responsive</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  All forms automatically adapt to any device. Perfect experience on desktop, tablet, and mobile.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📧</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email Notifications</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Get instant email alerts when someone submits a form. Never miss a response.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📥</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Data Export</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Export your form responses to CSV, Excel, or PDF for easy analysis and reporting.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your data is encrypted and secure. We follow industry best practices to protect your information.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Fast & Reliable</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Lightning-fast form loading times and 99.9% uptime guarantee. Your forms are always available.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Mode Banner */}
        {usingMockData && (
          <div className="max-w-4xl mx-auto mb-10">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-5 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-900">Demo Mode Active</p>
                  <p className="text-sm text-gray-700 mt-1">
                    Displaying sample plans. Connect to your API for live pricing and payment processing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                plan.popular ? 'ring-2 ring-primary scale-105 lg:scale-110' : ''
              }`}
              style={{ zIndex: plan.popular ? 10 : 1 }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-2 rounded-full font-semibold text-sm shadow-lg flex items-center">
                    <Star className="w-4 h-4 mr-2 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Content */}
              <div className={`${plan.popular ? 'pt-10' : 'pt-8'}`}>
                {/* Icon & Name */}
                <div className="px-8 pb-6">
                  <div className="flex justify-center mb-5">
                    <div className={`p-4 rounded-2xl ${plan.popular ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-700'}`}>
                      {getIcon(plan.icon)}
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    {plan.plan_name}
                  </h2>
                  <p className="text-sm text-gray-600 text-center leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="px-8 pb-6">
                  <div className="flex items-end justify-center mb-2">
                    <span className="text-5xl font-bold text-gray-900">₹{plan.price}</span>
                    {plan.duration && (
                      <span className="text-lg text-gray-600 ml-2 mb-2">/{plan.duration}</span>
                    )}
                  </div>
                  <p className="text-center text-sm text-gray-500">Billed monthly</p>
                </div>

                {/* CTA Button */}
                <div className="px-8 pb-6">
                  <button
                    onClick={() => buy(plan)}
                    disabled={processingPlanId === plan.id}
                    className={`group w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                      plan.popular
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl'
                        : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
                    } disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-orange-200`}
                  >
                    {processingPlanId === plan.id ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Get Started
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="px-8 pb-6">
                  <div className="border-t border-gray-100"></div>
                </div>

                {/* Features List */}
                <div className="px-8 pb-8">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    What's included
                  </p>
                  <ul className="space-y-3">
                    {plan.id === 1 && (
                      <>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">Up to 5 forms</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">100 responses/month</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">Basic form fields</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">Email notifications</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">Data export (CSV)</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">Mobile responsive</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-400">✕</span>
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-400 leading-relaxed line-through">Custom branding</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-400">✕</span>
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-400 leading-relaxed line-through">Payment integration</span>
                        </li>
                      </>
                    )}
                    {plan.id === 2 && (
                      <>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">Unlimited forms</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">1,000 responses/month</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">All form field types</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">Custom branding & themes</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">Advanced logic & conditions</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">Payment integration (PayU)</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">File uploads (10MB)</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">API access</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-400">✕</span>
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-400 leading-relaxed line-through">Team collaboration</span>
                        </li>
                      </>
                    )}
                    {plan.id === 3 && (
                      <>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">Unlimited forms & responses</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">Everything in Professional</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">Team collaboration (10 users)</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">Advanced analytics & reports</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">Custom domain & SSL</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">White-label solution</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">Unlimited file uploads</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">24/7 priority support</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700 leading-relaxed">Dedicated account manager</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="max-w-6xl mx-auto mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Everything You Need to Build Better Forms</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2 text-center">14-Day Money Back</h4>
              <p className="text-sm text-gray-600 text-center">Not satisfied? Get a full refund, no questions asked.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2 text-center">Instant Activation</h4>
              <p className="text-sm text-gray-600 text-center">Start creating forms immediately after signup.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2 text-center">Cancel Anytime</h4>
              <p className="text-sm text-gray-600 text-center">No long-term contracts. Pause or cancel anytime.</p>
            </div>
          </div>
        </div>

        {/* Form Builder Features Comparison */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Compare Form Builder Features</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Features</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Starter</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-primary/5">Professional</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-700">Number of Forms</td>
                    <td className="text-center py-4 px-4 text-sm text-gray-900 font-medium">5</td>
                    <td className="text-center py-4 px-4 text-sm text-gray-900 font-medium bg-primary/5">Unlimited</td>
                    <td className="text-center py-4 px-4 text-sm text-gray-900 font-medium">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-700">Responses per Month</td>
                    <td className="text-center py-4 px-4 text-sm text-gray-900 font-medium">100</td>
                    <td className="text-center py-4 px-4 text-sm text-gray-900 font-medium bg-primary/5">1,000</td>
                    <td className="text-center py-4 px-4 text-sm text-gray-900 font-medium">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-700">Drag & Drop Builder</td>
                    <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-4 bg-primary/5"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-700">Custom Branding & Themes</td>
                    <td className="text-center py-4 px-4"><span className="text-gray-300">—</span></td>
                    <td className="text-center py-4 px-4 bg-primary/5"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-700">Conditional Logic</td>
                    <td className="text-center py-4 px-4"><span className="text-gray-300">—</span></td>
                    <td className="text-center py-4 px-4 bg-primary/5"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-700">Payment Integration (PayU)</td>
                    <td className="text-center py-4 px-4"><span className="text-gray-300">—</span></td>
                    <td className="text-center py-4 px-4 bg-primary/5"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-700">File Uploads</td>
                    <td className="text-center py-4 px-4"><span className="text-gray-300">—</span></td>
                    <td className="text-center py-4 px-4 bg-primary/5">Up to 10MB</td>
                    <td className="text-center py-4 px-4">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-700">Team Collaboration</td>
                    <td className="text-center py-4 px-4"><span className="text-gray-300">—</span></td>
                    <td className="text-center py-4 px-4 bg-primary/5"><span className="text-gray-300">—</span></td>
                    <td className="text-center py-4 px-4">10 users</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-700">API Access</td>
                    <td className="text-center py-4 px-4"><span className="text-gray-300">—</span></td>
                    <td className="text-center py-4 px-4 bg-primary/5"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-700">Advanced Analytics</td>
                    <td className="text-center py-4 px-4"><span className="text-gray-300">—</span></td>
                    <td className="text-center py-4 px-4 bg-primary/5"><span className="text-gray-300">—</span></td>
                    <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-700">White Label</td>
                    <td className="text-center py-4 px-4"><span className="text-gray-300">—</span></td>
                    <td className="text-center py-4 px-4 bg-primary/5"><span className="text-gray-300">—</span></td>
                    <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-700">Support</td>
                    <td className="text-center py-4 px-4 text-sm text-gray-700">Email</td>
                    <td className="text-center py-4 px-4 text-sm text-gray-700 bg-primary/5">Priority Email</td>
                    <td className="text-center py-4 px-4 text-sm text-gray-700">24/7 Priority</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ/Contact Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary/5 to-purple-50 rounded-3xl p-10 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Still have questions?</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our team is here to help you choose the right plan for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                View Pricing FAQ
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-md hover:from-orange-600 hover:to-orange-700 hover:shadow-lg transition-all"
              >
                Contact Sales
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}