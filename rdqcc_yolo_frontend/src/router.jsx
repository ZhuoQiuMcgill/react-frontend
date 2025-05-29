import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PredictRoutes } from './features/predict';

// Main layout component
import MainLayout from './shared/layouts/MainLayout';

// Simple home component with modern beautiful design
function Home() {
    return (
        <div className="relative min-h-[80vh] overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
            <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-primary-blue/20 to-accent-pink/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-accent-pink/10 to-primary-dark-blue/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20">
                {/* Logo/Icon */}
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-blue to-accent-pink rounded-3xl blur-xl opacity-30 animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-primary-blue via-primary-blue to-primary-dark-blue p-8 rounded-3xl shadow-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>

                {/* Hero Text */}
                <div className="max-w-4xl mx-auto mb-12">
                    <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-dark-blue via-primary-blue to-accent-pink bg-clip-text text-transparent mb-6 leading-tight">
                        Intelligent Defect Detection
                    </h1>
                    <p className="text-xl md:text-2xl text-neutral-600 leading-relaxed mb-8 max-w-2xl mx-auto">
                        Leverage cutting-edge AI-powered image analysis to identify and classify defects with
                        <span className="font-semibold bg-gradient-to-r from-accent-pink to-primary-blue bg-clip-text text-transparent"> precision</span> and
                        <span className="font-semibold bg-gradient-to-r from-primary-blue to-accent-pink bg-clip-text text-transparent"> reliability</span>.
                    </p>
                </div>

                {/* CTA Button */}
                <div className="mb-16">
                    <a
                        href="/predict"
                        className="group relative inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-accent-pink via-accent-pink to-accent-dark-pink text-white font-bold text-lg rounded-3xl shadow-2xl hover:shadow-accent-pink/25 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 active:scale-95 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-accent-dark-pink/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="relative z-10 flex items-center gap-4">
                            <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-xl uppercase tracking-wider">Start Detection</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </a>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Feature 1 */}
                    <div className="group relative bg-white/70 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-blue to-primary-dark-blue rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-primary-dark-blue mb-3">Advanced Vision AI</h3>
                            <p className="text-neutral-600 leading-relaxed">
                                State-of-the-art computer vision algorithms for precise defect identification and classification.
                            </p>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="group relative bg-white/70 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-accent-pink to-accent-dark-pink rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-primary-dark-blue mb-3">Real-time Analysis</h3>
                            <p className="text-neutral-600 leading-relaxed">
                                Instant processing and detailed reporting with comprehensive defect analysis and insights.
                            </p>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="group relative bg-white/70 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-success to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-primary-dark-blue mb-3">High Precision</h3>
                            <p className="text-neutral-600 leading-relaxed">
                                Industry-leading accuracy with customizable confidence thresholds and advanced filtering options.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-20 text-center">
                    <p className="text-neutral-500 text-lg mb-6">Ready to revolutionize your quality control process?</p>
                    <a
                        href="/predict"
                        className="inline-flex items-center gap-2 px-8 py-3 text-primary-blue hover:text-primary-dark-blue font-semibold border-2 border-primary-blue hover:border-primary-dark-blue rounded-2xl transition-all duration-300 hover:bg-primary-blue/5"
                    >
                        Get Started Now
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}

// Combine all routes
const appRoutes = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            ...PredictRoutes
        ]
    }
];

const router = createBrowserRouter(appRoutes);

export default function AppRouter() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <RouterProvider router={router} />
        </Suspense>
    );
}