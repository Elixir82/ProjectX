import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx'
import OTPVerify from './pages/Verify.jsx';
import CrushForm from './pages/CrushFrom.jsx';
import ConfessPage from './pages/Confessions.jsx';
import RantPage from './pages/Rants.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import CommentsPage from './pages/CommentsPage.jsx';
import { AuthProvider } from './AuthContext.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<ConfessPage />} />
          <Route path="/confessions" element={<ConfessPage />} />
          <Route path="/rants" element={<RantPage />} />
          <Route path="/comments/:postType/:postId" element={<CommentsPage />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<OTPVerify />} />

          <Route path="/crush" element={<PrivateRoute><CrushForm /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;