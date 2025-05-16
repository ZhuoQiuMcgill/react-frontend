import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PredictRoutes } from './features/predict';

// Main layout component
import MainLayout from './shared/layouts/MainLayout';

// Create a default route for the home page
const HomeRoute = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            index: true,
            element: <Home />
        }
    ]
};

// Simple home component
function Home() {
    return (
        <div className="flex flex-col items-center justify-center p-16 text-center">
            <h1 className="text-4xl font-semibold text-primary-dark-blue mb-6">Intelligent Defect Detection</h1>
            <p className="text-xl text-text-light max-w-2xl mb-10">
                Leverage AI-powered image analysis to identify and classify defects with precision and reliability.
            </p>
            <a
                href="/predict"
                className="px-10 py-4 bg-gradient-accent text-white font-semibold rounded-full
                 uppercase tracking-wider shadow-button hover:filter hover:brightness-110
                 transform transition hover:-translate-y-1 hover:shadow-button-hover"
            >
                Start Detection
            </a>
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