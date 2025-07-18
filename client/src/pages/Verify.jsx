import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function OTPVerify() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [otp, setOTP] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const email = localStorage.getItem('campusCupidEmail');
  const [crushData] = React.useState([]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const res = await axios.post('http://localhost:8000/verify', {
        email,
        otp,
        crushData
      });

      if (res?.data?.token) {
        const { token, userData } = res.data;
        login(token, userData);
        localStorage.removeItem('campusCupidEmail');
        setMessage("Verification successful! Redirecting...");
        setTimeout(() => navigate('/crush'), 1000);
      } else {
        setMessage("Something went wrong with tokens. Try again.");
      }
    } catch (error) {
      setMessage("Invalid or expired OTP");
      console.error("OTP verification error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <div className="bg-white px-8 py-6 rounded-2xl shadow-xl text-center">
          <p className="text-red-600 font-semibold text-lg">No email found.<br />Please login again.</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-5 px-6 py-2 rounded-full bg-pink-600 text-white font-semibold transition shadow hover:bg-rose-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-rose-50 via-pink-50 to-pink-100 font-inter">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 px-10 py-10 rounded-3xl shadow-2xl border border-pink-100 w-full max-w-md"
      >
        <h2 className="text-2xl font-extrabold text-pink-600 text-center mb-2 tracking-tight">Verify OTP</h2>
        <p className="mb-6 text-center text-pink-400 font-medium">We’ve sent a 6-digit code to your campus email</p>

        <label className="text-sm font-semibold text-pink-700 mb-1 block">Email</label>
        <input
          type="email"
          readOnly
          value={email}
          className="w-full p-3 mb-4 border-2 bg-gray-100 text-gray-400 rounded-xl font-medium shadow-inner cursor-not-allowed"
        />

        <label className="text-sm font-semibold text-pink-700 mb-1 block">Enter OTP</label>
        <input
          type="text"
          maxLength={6}
          required
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
          className="w-full p-3 mb-1 border-2 border-pink-100 rounded-2xl focus:border-pink-400 focus:ring-2 focus:ring-pink-100 font-semibold text-base shadow-sm"
          placeholder="Enter 6-digit OTP"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full bg-gradient-to-r from-pink-600 to-pink-400 hover:from-pink-700 hover:to-pink-500 text-white py-3 rounded-full font-bold shadow-lg text-lg transition-all disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {message && (
          <div className={`mt-5 rounded-lg text-center text-base font-semibold py-2 px-3 shadow
            ${
              message.includes('success')
                ? 'bg-green-50 text-green-600'
                : 'bg-rose-50 text-rose-600'
            }
          `}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default OTPVerify;
