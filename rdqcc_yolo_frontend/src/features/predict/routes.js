import { lazy } from 'react';

// Use createElement instead of JSX to avoid compilation issues
import { createElement } from 'react';

const PredictPage = lazy(() => import('./views/PredictPage'));

const PredictRoutes = [
    {
        path: '/predict',
        element: createElement(PredictPage)
    }
];

export default PredictRoutes;