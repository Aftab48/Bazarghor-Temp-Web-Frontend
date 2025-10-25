import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminForgotPassword from './pages/admin/AdminForgotPassword';
import AdminResetPassword from './pages/admin/AdminResetPassword';

// Customer Pages
import CustomerRegister from './pages/customer/CustomerRegister';
import CustomerLogin from './pages/customer/CustomerLogin';
import CustomerProfile from './pages/customer/CustomerProfile';
import CustomerUpdateProfile from './pages/customer/CustomerUpdateProfile';
import CustomerAddress from './pages/customer/CustomerAddress';

// Vendor Pages
import VendorRegister from './pages/vendor/VendorRegister';
import VendorLogin from './pages/vendor/VendorLogin';
import VendorProfile from './pages/vendor/VendorProfile';
import VendorUpdateProfile from './pages/vendor/VendorUpdateProfile';

// Delivery Partner Pages
import DeliveryPartnerRegister from './pages/deliveryPartner/DeliveryPartnerRegister';
import DeliveryPartnerLogin from './pages/deliveryPartner/DeliveryPartnerLogin';
import DeliveryPartnerProfile from './pages/deliveryPartner/DeliveryPartnerProfile';
import DeliveryPartnerUpdateProfile from './pages/deliveryPartner/DeliveryPartnerUpdateProfile';

// OTP Pages
import OTPTest from './pages/otp/OTPTest';

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

        {/* Customer Routes */}
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
        <Route path="/customer/update-profile" element={<CustomerUpdateProfile />} />
        <Route path="/customer/address" element={<CustomerAddress />} />

        {/* Vendor Routes */}
        <Route path="/vendor/register" element={<VendorRegister />} />
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/vendor/profile" element={<VendorProfile />} />
        <Route path="/vendor/update-profile" element={<VendorUpdateProfile />} />

        {/* Delivery Partner Routes */}
        <Route path="/delivery-partner/register" element={<DeliveryPartnerRegister />} />
        <Route path="/delivery-partner/login" element={<DeliveryPartnerLogin />} />
        <Route path="/delivery-partner/profile" element={<DeliveryPartnerProfile />} />
        <Route path="/delivery-partner/update-profile" element={<DeliveryPartnerUpdateProfile />} />

        {/* OTP Routes */}
        <Route path="/otp/send-registration" element={<OTPTest />} />
        <Route path="/otp/verify-registration" element={<OTPTest />} />
        <Route path="/otp/verify-login" element={<OTPTest />} />
        <Route path="/otp/resend" element={<OTPTest />} />
      </Routes>
    </Router>
  );
}

export default App;
