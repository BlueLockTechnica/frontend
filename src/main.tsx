import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Dashboard from './Routes/Dashboard/Dashboard';
import CallInterface from './Routes/Call/CallInterface';
import CallReport from './Routes/Call/CallReport';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />
  },
  {
    path: '/call/:channel/:userId',
    element: <CallInterface />
  },
  {
    path: '/report/:channel',
    element: <CallReport />
  }
])


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
