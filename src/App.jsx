import { Routes, Route } from 'react-router-dom'
import LandingPage from '@/pages/Landing/LandingPage'
import Login from '@/pages/Auth/Login'
import Register from '@/pages/Auth/Register'
import ProtectedRoute from '@/components/routing/ProtectedRoute'
import ComingSoon from '@/pages/ComingSoon'
import { ROLES } from '@/utils/constants'
import ProductsPage from '@/pages/Product/ProductsPage'
import ProductDetailsPage from '@/pages/Product/ProductDetailsPage'
import AddProductPage from '@/pages/Product/AddProductPage'
import CartPage from '@/pages/Cart/CartPage'
import FarmersPage from '@/pages/Farmer/FarmersPage'
import FarmerProfilePage from '@/pages/Farmer/FarmerProfilePage'
import CheckoutPage from '@/pages/Checkout/CheckoutPage'
import PaymentPage from '@/pages/Payment/PaymentPage'
import PaymentSuccessPage from '@/pages/Payment/PaymentSuccessPage'
import PaymentFailedPage from '@/pages/Payment/PaymentFailedPage'
import OrdersPage from '@/pages/Orders/OrdersPage'
import OrderDetailsPage from '@/pages/Orders/OrderDetailsPage'
import BuyerDashboard from '@/pages/Buyer/BuyerDashboard'
import ProfilePage from '@/pages/ProfilePage'
import GovernmentSchemesPage from '@/pages/GovernmentSchemes/GovernmentSchemesPage'
import GovernmentSchemeDetailsPage
  from './pages/GovernmentSchemes/GovernmentSchemeDetailsPage'
import OrderActionPage from '@/pages/Orders/OrderActionPage'
import FarmerDashboard from '@/pages/Farmer/FarmerDashboard'

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailsPage />} />
      <Route path="/farmers" element={<FarmersPage />} />
      <Route path="/farmers/:id" element={<FarmerProfilePage />} />
      <Route
  path="/order/action"
  element={<OrderActionPage />}
/>
      <Route path="/how-it-works" element={<ComingSoon title="How it works" />} />

      {/* Buyer only */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.BUYER]} />}>
        <Route path="/dashboard" element={<BuyerDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        <Route path="/payment/success/:orderId" element={<PaymentSuccessPage />} />
        <Route path="/payment/failed/:orderId" element={<PaymentFailedPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
      </Route>

      {/* Farmer only */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.FARMER]} />}>
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/government-schemes" element={<GovernmentSchemesPage />} />
        <Route path="/government-schemes/:id" element={<GovernmentSchemeDetailsPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/farmer/products" element={<ComingSoon title="Manage products" />} />
        <Route path="/farmer/orders" element={<ComingSoon title="Farmer orders" />} />
      </Route>
     

      {/* Any authenticated user */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ComingSoon title="Profile" />} />
      </Route>

      <Route path="*" element={<ComingSoon title="Page not found" />} />
    </Routes>
  )
}
