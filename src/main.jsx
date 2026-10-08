import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import './index.css'
import { CartProvider } from './contexts/CartContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#152119',
              color: '#FBF9F2',
              borderRadius: '12px',
              fontFamily: '"Work Sans", sans-serif',
              fontSize: '14px',
            },
          }}
        />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
