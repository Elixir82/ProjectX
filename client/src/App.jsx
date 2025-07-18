import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx'
import OTPVerify from './pages/Verify.jsx';
import CrushForm from './pages/CrushFrom.jsx';
import ConfessPage from './pages/Confessions.jsx';
import RantPage from './pages/Rants.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import { AuthProvider } from './AuthContext.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Make Confessions page the new homepage */}
          <Route path="/" element={<ConfessPage />} />
          <Route path="/confessions" element={<ConfessPage />} />
          <Route path="/rants" element={<RantPage />} />

          {/* Login and OTP Verify accessible by link/button */}
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<OTPVerify />} />

          {/* Crushes remain protected */}
          <Route path="/crush" element={<PrivateRoute><CrushForm /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;