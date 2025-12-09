import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminForgotPassword from './pages/admin/AdminForgotPassword';
import AdminResetPassword from './pages/admin/AdminResetPassword';
import AdminVendorManagement from './pages/admin/AdminVendorManagement';
import AdminVendorDetail from './pages/admin/AdminVendorDetail';

// Customer Pages
import CustomerRegister from './pages/customer/CustomerRegister';
import CustomerLogin from './pages/customer/CustomerLogin';
import CustomerProfile from './pages/customer/CustomerProfile';
import CustomerUpdateProfile from './pages/customer/CustomerUpdateProfile';
import CustomerAddress from './pages/customer/CustomerAddress';
import CustomerCart from './pages/customer/CustomerCart';
import CustomerOrders from './pages/customer/CustomerOrders';

// Vendor Pages
import VendorRegister from './pages/vendor/VendorRegister';
import VendorLogin from './pages/vendor/VendorLogin';
import VendorProfile from './pages/vendor/VendorProfile';
import VendorUpdateProfile from './pages/vendor/VendorUpdateProfile';
import ProductList from './pages/vendor/ProductList';
import ProductInventory from './pages/vendor/ProductInventory';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorSubscription from './pages/vendor/VendorSubscription';

// Delivery Partner Pages
import DeliveryPartnerRegister from './pages/deliveryPartner/DeliveryPartnerRegister';
import DeliveryPartnerLogin from './pages/deliveryPartner/DeliveryPartnerLogin';
import DeliveryPartnerProfile from './pages/deliveryPartner/DeliveryPartnerProfile';
import DeliveryPartnerUpdateProfile from './pages/deliveryPartner/DeliveryPartnerUpdateProfile';
import DeliveryOrders from './pages/deliveryPartner/DeliveryOrders';

// OTP Pages
import OTPTest from './pages/otp/OTPTest';

// WhatsApp Test Pages
import WhatsAppTest from './pages/whatsapp/WhatsAppTest';
import AdminOrders from './pages/admin/AdminOrders';
import AdminVendorSubscription from './pages/admin/AdminVendorSubscription';
import StoreManagement from './pages/store/StoreManagement';
import MapplsPlayground from './pages/mappls/MapplsPlayground';
import GoogleMapsPlayground from './pages/googleMaps/GoogleMapsPlayground';
import DeliveryTracking from './pages/googleMaps/DeliveryTracking';
import DeliveryPartnerLocation from './pages/googleMaps/DeliveryPartnerLocation';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />
        <Route path="/admin/vendors" element={<AdminVendorManagement />} />
        <Route path="/admin/vendors/:id" element={<AdminVendorDetail />} />

        {/* Customer Routes */}
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
        <Route path="/customer/update-profile" element={<CustomerUpdateProfile />} />
        <Route path="/customer/address" element={<CustomerAddress />} />
        <Route path="/customer/cart" element={<CustomerCart />} />
        <Route path="/customer/orders" element={<CustomerOrders />} />

        {/* Vendor Routes */}
        <Route path="/vendor/register" element={<VendorRegister />} />
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/vendor/profile" element={<VendorProfile />} />
        <Route path="/vendor/update-profile" element={<VendorUpdateProfile />} />
        <Route path="/vendor/products" element={<ProductList />} />
        <Route path="/vendor/products/create" element={<ProductInventory />} />
        <Route path="/vendor/products/:id" element={<ProductInventory />} />
        <Route path="/vendor/orders" element={<VendorOrders />} />
        <Route path="/vendor/subscriptions" element={<VendorSubscription />} />

        {/* Delivery Partner Routes */}
        <Route path="/delivery-partner/register" element={<DeliveryPartnerRegister />} />
        <Route path="/delivery-partner/login" element={<DeliveryPartnerLogin />} />
        <Route path="/delivery-partner/profile" element={<DeliveryPartnerProfile />} />
        <Route path="/delivery-partner/update-profile" element={<DeliveryPartnerUpdateProfile />} />
        <Route path="/delivery-partner/orders" element={<DeliveryOrders />} />

        {/* OTP Routes */}
        <Route path="/otp/send-registration" element={<OTPTest />} />
        <Route path="/otp/verify-registration" element={<OTPTest />} />
        <Route path="/otp/verify-login" element={<OTPTest />} />
        <Route path="/otp/resend" element={<OTPTest />} />

        {/* WhatsApp Test Routes */}
        <Route path="/whatsapp/test" element={<WhatsAppTest />} />

        {/* Admin Utilities */}
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/vendor-subscriptions" element={<AdminVendorSubscription />} />

        {/* Shared Utilities */}
        <Route path="/store/manage" element={<StoreManagement />} />
        <Route path="/mappls/playground" element={<MapplsPlayground />} />
        
        {/* Google Maps Routes */}
        <Route path="/google-maps/playground" element={<GoogleMapsPlayground />} />
        <Route path="/google-maps/delivery-tracking" element={<DeliveryTracking />} />
        <Route path="/google-maps/delivery-partner" element={<DeliveryPartnerLocation />} />
      </Routes>
    </Router>
  );
}

export default App;
