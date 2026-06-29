import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './responsive.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollUpWrapper from './components/ScrollUpWrapper';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import ProductsPage from './pages/ProductsPage';
import OilAdditivesPage from './pages/OilAdditivesPage';
import BrakeOilPage from './pages/BrakeOilPage';
import CoolantsPage from './pages/CoolantsPage';
import TransmissionOilPage from './pages/TransmissionOilPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import OrderPage from './pages/OrderPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app">
            <Header />
            <main className="main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/oil-additives" element={<OilAdditivesPage />} />
                <Route path="/oil-additives/brake-oil" element={<BrakeOilPage />} />
                <Route path="/oil-additives/coolants" element={<CoolantsPage />} />
                <Route path="/oil-additives/transmission-oil" element={<TransmissionOilPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order/:id"
                  element={
                    <ProtectedRoute>
                      <OrderPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            {/* Add the scroll feature externally here */}
            <ScrollUpWrapper>
              <Footer />
            </ScrollUpWrapper>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
