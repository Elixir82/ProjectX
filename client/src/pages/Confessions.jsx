import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../AuthContext.jsx';

const ConfessPage = () => {
  const [confessions, setConfessions] = useState([]);
  const [newConfession, setNewConfession] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchConfessions();
    // eslint-disable-next-line
  }, []);

  const fetchConfessions = async () => {
    try {
      console.log("Let's see if theis is working");
      const response = await axios.get('https://projectx-vbmj.onrender.com/confess');
      setConfessions(response.data.confessions);
    } catch (error) {
      console.error('Error fetching confessions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newConfession.trim()) {
      setMessage('Please write something before submitting.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post('https://projectx-vbmj.onrender.com/confess', {
        confession: newConfession
      });
      setMessage(response.data.message);
      setNewConfession('');
      fetchConfessions();
    } catch (error) {
      setMessage('Error submitting confession. Please try again.');
      console.error('Error submitting confession:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-50 via-pink-100 to-pink-200 font-inter">
      <Navbar />
      
      {/* NEW: Announcement Banner */}
      <div className="max-w-4xl mx-auto mt-8 mb-6 px-6 py-5 bg-gradient-to-r from-blue-100 to-indigo-50 border-l-4 border-blue-400 rounded-xl shadow flex items-start gap-4">
        <svg width={32} height={32} className="text-blue-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <div>
          <span className="font-semibold text-blue-800 block">
            <span className="text-indigo-700 font-bold">📢 Updates Coming Soon!</span><br />
            <span className="text-sm text-blue-700">
              I'll add comments section to each rant/confession post in about a week with some other features I've been suggested on reddit, please refrain from asking any question as there's no way to answer. Also try to differentiate if you're writing a confession or rant and write in respective page, If you have any suggestion, you can write in the reddit post on vit ap subreddit with the post titled as "A website I created" most probably.
            </span>
          </span>
        </div>
      </div>
      
      {!isAuthenticated && (
        <div className="max-w-xl mx-auto mt-8 mb-6 px-6 py-5 bg-gradient-to-r from-yellow-100 to-yellow-50 border-l-4 border-yellow-400 rounded-xl shadow flex items-start gap-4">
          <svg width={32} height={32} className="text-yellow-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24"><path d="M13 13h-2v-2h2m0-2h-2v-2h2M12 17a1.5 1.5 0 0 1-1.5-1.5H11V17h1v-1.5A1.5 1.5 0 0 1 12 17Zm0-14c-5.04 0-9.13 4.09-9.13 9.13 0 3.57 2.13 6.63 5.25 8.21v.38a3.75 3.75 0 1 0 7.5 0v-.38c3.12-1.58 5.25-4.64 5.25-8.21C21.13 7.09 17.04 3 12 3Zm0 16a1.75 1.75 0 0 1-1.75-1.75h3.5A1.75 1.75 0 0 1 12 19Zm4.5-5.42c-.52.18-1.08.28-1.66.28s-1.14-.1-1.66-.28a.5.5 0 0 0-.68.44v.75A8.3 8.3 0 0 1 7.08 12c0-.28.22-.5.5-.5h1.07c.38 0 .68.29.74.65.22 1.34 1.39 2.35 2.73 2.35s2.51-1.01 2.73-2.35c.06-.36.36-.65.74-.65h1.07a.5.5 0 0 1 .5.5c0 1.28-.27 2.51-.75 3.58v-.75a.5.5 0 0 0-.68-.44Z"/></svg>
          <div>
            <span className="font-semibold text-yellow-800 block">
              To use the <span className="text-pink-700 font-bold">Find Crush</span> page, verify yourself with your VITAP email, no password required<br />
              <span className="text-sm text-yellow-700">We just want to make sure you don't imitate someone else.</span>
            </span>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-2 py-10">
        {/* Sub Navigation */}
        <div className="flex justify-center gap-4 mb-10">
          <Link
            to="/confessions"
            className={`px-7 py-2.5 rounded-full font-semibold text-lg transition shadow
              ${location.pathname === '/confessions'
                ? 'bg-pink-600 text-white scale-105 shadow-lg'
                : 'bg-white text-pink-600 hover:bg-pink-100'}
            `}
          >
            Confessions
          </Link>
          <Link
            to="/rants"
            className={`px-7 py-2.5 rounded-full font-semibold text-lg transition shadow
              ${location.pathname === '/rants'
                ? 'bg-pink-600 text-white scale-105 shadow-lg'
                : 'bg-white text-pink-600 hover:bg-pink-100'}
            `}
          >
            Rants
          </Link>
        </div>

        {/* Confession Form */}
        <div className="bg-white/80 backdrop-blur rounded-3xl shadow-2xl border border-pink-100 p-8 mb-10">
          <h2 className="text-3xl font-extrabold text-pink-600 text-center mb-5 tracking-tight">
            Share Your Confession
          </h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={newConfession}
              onChange={(e) => setNewConfession(e.target.value)}
              placeholder="What's on your mind? Share your confession anonymously..."
              className="w-full p-5 border-2 border-pink-100 bg-pink-50/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-300 text-lg transition resize-none shadow-sm"
              rows="4"
              maxLength="500"
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-gray-400 select-none">
                {1000-newConfession.length} characters left
              </span>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-pink-600 to-pink-400 text-white px-7 py-2.5 rounded-full shadow-md font-semibold text-base hover:scale-105 hover:bg-pink-700 active:scale-95 transition disabled:opacity-60"
              >
                {loading ? 'Posting...' : 'Post Confession'}
              </button>
            </div>
          </form>
          {message && (
            <div className={`mt-4 text-center rounded-lg py-2 px-3 font-medium transition-all
                ${message.includes('Error')
                  ? 'bg-red-100 text-red-700'
                  : message.includes('please write')
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-green-100 text-green-700'
                }`
              }>
              {message}
            </div>
          )}
        </div>

        {/* Confessions List */}
        <div>
          <h3 className="text-2xl font-bold text-pink-700 mb-6 tracking-tight text-center">
            Recent Confessions
          </h3>
          {confessions.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg py-16 px-8 text-center">
              <p className="text-gray-400">No confessions yet. Be the first to share!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {confessions.map((confession) => (
                <div
                  key={confession._id}
                  className="bg-white/90 rounded-2xl shadow-lg p-6 border border-pink-200 group hover:shadow-xl hover:border-pink-400 transition"
                >
                  <p className="text-gray-800 leading-relaxed text-lg mb-4 font-medium transition group-hover:text-pink-700">
                    {confession.confession}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                    <span className="flex items-center gap-1">
                      <svg width={16} height={16} className="text-pink-300" fill="currentColor" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" /></svg>
                      Anonymous
                    </span>
                    <span>{new Date(confession.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfessPage;
