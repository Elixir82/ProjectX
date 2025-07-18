import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [res, setRes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/crush');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const isValidEmail = (email) => {
    const regex = /^[a-z]+\.[a-z0-9]+@vitapstudent\.ac\.in$/i;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRes('');
    setError('');

    if (!isValidEmail(email)) {
      setError("Email isn't according to college norms (e.g., abc.22bceXXXX@vitapstudent.ac.in)");
      return;
    }

    setLoading(true);

    try {
      const resp = await axios.post('https://projectx-vbmj.onrender.com/signup', { email });
      if (resp?.data?.message) {
        setRes(resp.data.message);
        localStorage.setItem('campusCupidEmail', email);
        setTimeout(() => navigate('/verify'), 1000);
      }
    } catch (error) {
      setError("Something went wrong in here. Please try again.");
      console.error("Signup error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-100 via-rose-50 to-pink-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-pink-600 text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-100 via-rose-50 to-pink-200 font-inter">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 rounded-3xl shadow-2xl border border-pink-100 py-10 px-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-black text-pink-600 mb-2 flex items-center gap-2 justify-center">
          <span role="img" aria-label="heart">💘</span> RegMatch
        </h2>
        <p className="mb-5 text-center text-pink-500">Campus Email Login</p>

        <label className="block mb-1 text-sm font-semibold text-pink-700">
          College Email <span className="text-pink-400">*</span>
        </label>
        <input
          type="email"
          required
          placeholder="yourname.22bceXXXX@vitapstudent.ac.in"
          className="w-full p-3 mb-2 border-2 border-pink-100 focus:border-pink-400 focus:ring-2 focus:ring-pink-100
            rounded-2xl font-semibold placeholder:text-pink-300 text-base shadow-sm transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        {error && (
          <div className="bg-red-50 text-red-700 rounded-lg py-2 px-3 mt-2 text-sm shadow">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full bg-gradient-to-r from-pink-600 to-pink-400 hover:from-pink-700 hover:to-pink-500 text-white py-3 rounded-full font-bold transition-all shadow-lg text-lg disabled:opacity-60"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        {res && (
          <div className="mt-5 rounded-lg bg-green-50 text-green-700 py-2 px-3 text-center text-sm shadow">
            {res}
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;
