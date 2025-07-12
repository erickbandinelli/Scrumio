import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './firebase'
import './index.css'

const App = lazy(() => import('./App'))
const Room = lazy(() => import('./Room'))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full animate-pulse bg-blue-600"></div>
              <div className="w-4 h-4 rounded-full animate-pulse bg-blue-600"></div>
              <div className="w-4 h-4 rounded-full animate-pulse bg-blue-600"></div>
              <span className="text-lg text-gray-700">Carregando...</span>
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
)
