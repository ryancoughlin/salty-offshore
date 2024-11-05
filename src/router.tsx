import { createBrowserRouter } from 'react-router-dom';
import App from './App';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        // /region/pacific-nw/dataset/sst/date/2024-03-20
        path: "/region/:regionId/dataset/:datasetId/date/:date?",
        element: <App />,
    }
]); 