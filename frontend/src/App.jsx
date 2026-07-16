import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

// Admin Dashboard Pages
import AdminLayout from './components/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminInventoryPage from './pages/admin/AdminInventoryPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminAddProductPage from './pages/admin/AdminAddProductPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Admin Routes — separate layout, no Header/Footer */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="inventory" element={<AdminInventoryPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="add-product" element={<AdminAddProductPage />} />
            </Route>

            {/* Public / Customer Routes — with Header/Footer */}
            <Route
              path="*"
              element={
                <div className="app">
                  <Header />
                  <main className="main">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/oil-additives" element={<OilAdditivesPage />} />
                      <Route path="/oil-additives/:category" element={<OilAdditivesPage />} />
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
                      <Route path="/order/:id" element={<OrderPage />} />
                      <Route
                        path="/admin-old"
                        element={
                          <ProtectedRoute adminOnly>
                            <AdminPage />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </main>
                  <ScrollUpWrapper>
                    <Footer />
                  </ScrollUpWrapper>
                </div>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
