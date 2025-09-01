import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../AuthContext.jsx';

const RantPage = () => {
  const [rants, setRants] = useState([]);
  const [newRant, setNewRant] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
    let intervalId;

    const startLoader = () => {
      setProgress(0);
      intervalId = setInterval(() => {
        setProgress(prev => {
          if (prev >= 85) {
            return prev;
          }
          return prev + Math.floor(Math.random() * 6 + 1);
        });
      }, 3000);
    };

    try {
      setInitialLoading(true);
      startLoader();
      
      const response = await axios.get('https://projectx-vbmj.onrender.com/rant');
      setRants(response.data.rants);
    } catch (error) {
      console.error('Error fetching rants:', error);
    } finally {
      clearInterval(intervalId);
      setProgress(100);
      setTimeout(() => {
        setInitialLoading(false);
      }, 500);
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

  // Loading Component
  const RantsLoader = () => (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24">
      {/* Modern loader with glassmorphism */}
      <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 sm:p-12 border border-white/30 shadow-2xl">
        {/* Circular progress */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8">
          <svg className="w-24 h-24 sm:w-32 sm:h-32 transform -rotate-90" viewBox="0 0 144 144">
            <circle
              cx="72"
              cy="72"
              r="64"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="72"
              cy="72"
              r="64"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 64}`}
              strokeDashoffset={`${2 * Math.PI * 64 * (1 - progress / 100)}`}
              className="text-red-500 transition-all duration-500 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              {progress}%
            </span>
          </div>
        </div>

        {/* Floating dots animation */}
        <div className="relative flex justify-center mb-6 sm:mb-8">
          <div className="flex space-x-2 sm:space-x-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-red-500 to-rose-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s`, animationDuration: '1.4s' }}
              ></div>
            ))}
          </div>
        </div>

        {/* Status message */}
        <div className="text-center">
          <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
            {progress < 20 ? "Starting Backend..." :
              progress < 45 ? "Fetching Rants..." :
                progress < 70 ? "Rendering..." :
                  progress < 90 ? "✨ Almost ready to share..." :
                    "💕 Ready for your story!"}
          </p>
          <p className="text-sm sm:text-base text-gray-500">
            {progress < 50 ? "Our server is starting up from cold storage" :
              "Fetching the latest community rants"}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-red-50 via-red-100 to-pink-100 font-inter">
      <Navbar />

      {/* Announcement Banner - Responsive */}
      <div className="max-w-4xl mx-auto mt-4 sm:mt-8 mb-4 sm:mb-6 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-50 border border-indigo-200 border-l-4 border-blue-400 rounded-xl shadow transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <svg width={24} height={24} className="text-blue-500 flex-shrink-0 sm:w-7 sm:h-7 sm:mt-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 15h2v2h-2zm0-8h2v6h-2zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
          <div>
            <span className="font-semibold text-blue-900 block">
              <span className="text-indigo-800 font-bold text-sm sm:text-base tracking-tight">Yo!</span><br />
              <span className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                Please do share the site as adding your crush doesn't make sense if they're not aware that they can add their crush. Making confessions or ranting to public doesn't mean much if there's no public.
                <br />
                If you have any suggestions, please share them on <a href="https://www.reddit.com/r/vitap/comments/1ml06e1/a_website_i_created/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">this Reddit post</a>.
              </span>
            </span>
          </div>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="max-w-xl mx-auto mt-4 sm:mt-8 mb-4 sm:mb-6 px-3 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-yellow-100 to-yellow-50 border-l-4 border-yellow-400 rounded-xl shadow">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <svg width={24} height={24} className="text-yellow-400 flex-shrink-0 sm:w-8 sm:h-8 sm:mt-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 13h-2v-2h2m0-2h-2v-2h2M12 17a1.5 1.5 0 0 1-1.5-1.5H11V17h1v-1.5A1.5 1.5 0 0 1 12 17Zm0-14c-5.04 0-9.13 4.09-9.13 9.13 0 3.57 2.13 6.63 5.25 8.21v.38a3.75 3.75 0 1 0 7.5 0v-.38c3.12-1.58 5.25-4.64 5.25-8.21C21.13 7.09 17.04 3 12 3Zm0 16a1.75 1.75 0 0 1-1.75-1.75h3.5A1.75 1.75 0 0 1 12 19Zm4.5-5.42c-.52.18-1.08.28-1.66.28s-1.14-.1-1.66-.28a.5.5 0 0 0-.68.44v.75A8.3 8.3 0 0 1 7.08 12c0-.28.22-.5.5-.5h1.07c.38 0 .68.29.74.65.22 1.34 1.39 2.35 2.73 2.35s2.51-1.01 2.73-2.35c.06-.36.36-.65.74-.65h1.07a.5.5 0 0 1 .5.5c0 1.28-.27 2.51-.75 3.58v-.75a.5.5 0 0 0-.68-.44Z" />
            </svg>
            <div>
              <span className="font-semibold text-yellow-800 block">
                <span className="text-sm sm:text-base">To use the <span className="text-pink-700 font-bold">Find Crush</span> page, verify yourself with your VITAP email, no password required</span><br />
                <span className="text-xs sm:text-sm text-yellow-700">We just want to make sure you don't imitate someone else.</span>
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        {/* Sub Navigation - Responsive */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-6 sm:mb-10 px-2">
          <Link
            to="/confessions"
            className={`px-4 sm:px-7 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-lg transition shadow flex-1 sm:flex-initial text-center max-w-32 sm:max-w-none
              ${location.pathname === '/confessions'
                ? 'bg-pink-600 text-white scale-105 shadow-lg'
                : 'bg-white text-pink-600 hover:bg-pink-100'}
            `}
          >
            Confessions
          </Link>
          <Link
            to="/rants"
            className={`px-4 sm:px-7 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-lg transition shadow flex-1 sm:flex-initial text-center max-w-32 sm:max-w-none
              ${location.pathname === '/rants'
                ? 'bg-red-600 text-white scale-105 shadow-lg'
                : 'bg-white text-red-600 hover:bg-red-100'}
            `}
          >
            Rants
          </Link>
        </div>

        {/* Rant Form - Responsive */}
        <div className="bg-white/90 backdrop-blur rounded-2xl sm:rounded-3xl shadow-2xl border border-red-100 p-4 sm:p-8 mb-6 sm:mb-10">
          <h2 className="text-xl sm:text-3xl font-extrabold text-red-600 text-center mb-4 sm:mb-5 tracking-tight">
            Let It All Out
          </h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={newRant}
              onChange={(e) => setNewRant(e.target.value)}
              placeholder="What's bothering you? Let it all out here..."
              className="w-full p-3 sm:p-5 border-2 border-red-100 bg-red-50/30 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-300 text-base sm:text-lg transition resize-none shadow-sm"
              rows="4"
              maxLength="500"
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 gap-2 sm:gap-0">
              <span className="text-xs sm:text-sm text-gray-400 select-none order-2 sm:order-1">
                {500 - newRant.length} characters left
              </span>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-red-600 to-rose-500 text-white px-5 sm:px-7 py-2 sm:py-2.5 rounded-full shadow-md font-semibold text-sm sm:text-base hover:scale-105 hover:bg-red-700 active:scale-95 transition disabled:opacity-60 order-1 sm:order-2 self-end sm:self-auto"
              >
                {loading ? 'Posting...' : 'Post Rant'}
              </button>
            </div>
          </form>
          {message && (
            <div className={`mt-4 text-center rounded-lg py-2 px-3 font-medium transition-all text-sm
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

        {/* Rants List - Responsive */}
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-rose-700 mb-4 sm:mb-6 tracking-tight text-center">
            Recent Rants
          </h3>
          
          {initialLoading ? (
            <RantsLoader />
          ) : rants.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg py-12 sm:py-16 px-6 sm:px-8 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h10a2 2 0 002-2V8M9 12h6m-6 4h6" />
                </svg>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">No rants yet</h4>
              <p className="text-gray-400 text-sm sm:text-base">Be the first to vent and share what's on your mind!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:gap-6">
              {rants.map((rant) => (
                <div
                  key={rant._id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl p-4 sm:p-8 border border-gray-100 hover:border-red-200 transition-all duration-300 group"
                >
                  {/* Main rant content */}
                  <div className="mb-4 sm:mb-6">
                    <p className="text-gray-800 leading-relaxed text-sm sm:text-lg font-medium break-words">
                      {rant.rant}
                    </p>
                  </div>

                  {/* Metadata and actions - Responsive */}
                  <div className="flex items-center justify-between gap-2 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                      {/* Anonymous tag - hidden on small screens, visible on larger screens */}
                      <div className="hidden sm:flex items-center gap-1 sm:gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span>Anonymous</span>
                      </div>
                      <span className="text-gray-400 hidden sm:inline">•</span>
                      <span className="text-xs sm:text-sm flex-shrink-0">{new Date(rant.createdAt).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-4">
                      {/* Comments button - Responsive */}
                      <button
                        onClick={() => navigate(`/comments/rant/${rant._id}`)}
                        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group/comment"
                      >
                        <svg width={14} height={14} className="sm:w-[18px] sm:h-[18px]" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
                        </svg>
                        <span className="font-medium text-xs sm:text-sm">{rant.commentCount || 0}</span>
                      </button>

                      {/* For Real Button - Responsive */}
                      <button
                        onClick={() => ForRealClick(rant._id)}
                        className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm text-xs sm:text-sm
                          ${localStorage.getItem(`rantKey_${rant._id}`)
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200'
                            : 'bg-white border-2 border-blue-200 text-blue-600 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                      >
                        <div className={`flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-colors
                          ${localStorage.getItem(`rantKey_${rant._id}`)
                            ? 'bg-white/20'
                            : 'bg-blue-100'
                          }`}>
                          <svg width={10} height={10} className="sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.651.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
                          </svg>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-xs sm:text-sm font-semibold leading-none">For Real</span>
                          <span className={`text-xs leading-none mt-0.5 
                            ${localStorage.getItem(`rantKey_${rant._id}`)
                              ? 'text-white/80'
                              : 'text-gray-500'
                            }`}>
                            {rant.forRealCount || 0} agreed
                          </span>
                        </div>
                      </button>
                    </div>
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