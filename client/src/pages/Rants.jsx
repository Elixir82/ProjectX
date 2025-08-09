import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../AuthContext.jsx';

const RantPage = () => {
  const [rants, setRants] = useState([]);
  const [newRant, setNewRant] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchRants();
    // eslint-disable-next-line
  }, []);

  const ForRealClick = async (rantID) => {
    try {
      let key = `rantKey_${rantID}`;
      let alreadyClicked = localStorage.getItem(key);
      let url = `https://projectx-vbmj.onrender.com/rant/${rantID}`;
      const method = alreadyClicked ? 'DELETE' : 'PUT'; 

      const res = await fetch(url, { method });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      setRants((prev) =>
        prev.map((rant) =>
          rant._id === rantID ? { ...rant, forRealCount: data.count } : rant
        )
      );

      if (alreadyClicked) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, 'true');
      }
    } catch (error) {
      console.error("Error while updating for real count", error);
    }
  };

  const fetchRants = async () => {
    try {
      const response = await axios.get('https://projectx-vbmj.onrender.com/rant');
      setRants(response.data.rants);
    } catch (error) {
      console.error('Error fetching rants:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newRant.trim()) {
      setMessage('Please write something before submitting.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post('https://projectx-vbmj.onrender.com/rant', {
        rant: newRant
      });
      setMessage(response.data.message);
      setNewRant('');
      fetchRants();
    } catch (error) {
      setMessage('Error submitting rant. Please try again.');
      console.error('Error submitting rant:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-red-50 via-red-100 to-pink-100 font-inter">
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
          <svg width={32} height={32} className="text-yellow-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24"><path d="M13 13h-2v-2h2m0-2h-2v-2h2M12 17a1.5 1.5 0 0 1-1.5-1.5H11V17h1v-1.5A1.5 1.5 0 0 1 12 17Zm0-14c-5.04 0-9.13 4.09-9.13 9.13 0 3.57 2.13 6.63 5.25 8.21v.38a3.75 3.75 0 1 0 7.5 0v-.38c3.12-1.58 5.25-4.64 5.25-8.21C21.13 7.09 17.04 3 12 3Zm0 16a1.75 1.75 0 0 1-1.75-1.75h3.5A1.75 1.75 0 0 1 12 19Zm4.5-5.42c-.52.18-1.08.28-1.66.28s-1.14-.1-1.66-.28a.5.5 0 0 0-.68.44v.75A8.3 8.3 0 0 1 7.08 12c0-.28.22-.5.5-.5h1.07c.38 0 .68.29.74.65.22 1.34 1.39 2.35 2.73 2.35s2.51-1.01 2.73-2.35c.06-.36.36-.65.74-.65h1.07a.5.5 0 0 1 .5.5c0 1.28-.27 2.51-.75 3.58v-.75a.5.5 0 0 0-.68-.44Z" /></svg>
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
                ? 'bg-red-600 text-white scale-105 shadow-lg'
                : 'bg-white text-red-600 hover:bg-red-100'}
            `}
          >
            Rants
          </Link>
        </div>

        {/* Rant Form */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl border border-red-100 p-8 mb-10">
          <h2 className="text-3xl font-extrabold text-red-600 text-center mb-5 tracking-tight">
            Let It All Out
          </h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={newRant}
              onChange={(e) => setNewRant(e.target.value)}
              placeholder="What's bothering you? Let it all out here..."
              className="w-full p-5 border-2 border-red-100 bg-red-50/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-300 text-lg transition resize-none shadow-sm"
              rows="4"
              maxLength="500"
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-gray-400 select-none">
                {1000-newRant.length} characters left
              </span>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-red-600 to-rose-500 text-white px-7 py-2.5 rounded-full shadow-md font-semibold text-base hover:scale-105 hover:bg-red-700 active:scale-95 transition disabled:opacity-60"
              >
                {loading ? 'Posting...' : 'Post Rant'}
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

        {/* Rants List */}
        <div>
          <h3 className="text-2xl font-bold text-rose-700 mb-6 tracking-tight text-center">
            Recent Rants
          </h3>
          {rants.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg py-16 px-8 text-center">
              <p className="text-gray-400">No rants yet. Be the first to vent!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {rants.map((rant) => (
                <div
                  key={rant._id}
                  className="bg-white/90 rounded-2xl shadow-lg p-6 border border-red-200 group hover:shadow-xl hover:border-rose-400 transition border-l-4 border-l-red-600"
                >
                  <p className="text-gray-800 leading-relaxed text-lg mb-4 font-medium transition group-hover:text-rose-700">
                    {rant.rant}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                    <span className="flex items-center gap-1">
                      <svg width={16} height={16} className="text-rose-300" fill="currentColor" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" /></svg>
                      Anonymous
                    </span>
                    <span>{new Date(rant.createdAt).toLocaleString()}</span>
                  </div>

                  {/* Updated "For Real" Button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => ForRealClick(rant._id)}
                      className="inline-flex items-center gap-3 px-4 py-2.5 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-2 border-blue-200 hover:border-blue-400 text-gray-700 hover:text-blue-700 text-sm font-medium rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-center w-6 h-6 bg-blue-100 group-hover:bg-blue-200 rounded-full transition-colors">
                        <svg width={12} height={12} fill="currentColor" viewBox="0 0 16 16" className="text-blue-600">
                          <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.651.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
                        </svg>
                      </div>
                      <span className="flex flex-col">
                        <span className="font-semibold">For Real</span>
                        <span className="text-xs text-gray-500">{rant.forRealCount || 0} agreed</span>
                      </span>
                    </button>
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

export default RantPage;
