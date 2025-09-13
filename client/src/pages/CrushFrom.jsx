import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";

const CrushForm = () => {
  const [crushRegNo, setCrushRegNo] = useState("");
  const [crushName, setCrushName] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const [crushCount, setCrushCount] = useState(0);
  const [myMatches, setMyMatches] = useState([]);
  const [myCrushes, setMyCrushes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token || !user?.regNo) return;
      
      try {
        const countRes = await axios.get(
          `https://projectx-production-7788.up.railway.app/match/count/${user.regNo}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCrushCount(countRes.data.count);

        const matchesRes = await axios.get(
          "https://projectx-production-7788.up.railway.app/match/my-matches",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMyMatches(matchesRes.data.matchedWith);

        const crushesRes = await axios.get(
          "https://projectx-production-7788.up.railway.app/match/crushes",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMyCrushes(crushesRes.data.crushes);

      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, [user?.regNo]);

  const handleAddCrush = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    if (!crushRegNo.trim()) {
      setMessage("Please enter a registration number");
      return;
    }

    try {
      const res = await axios.post(
        "https://projectx-production-7788.up.railway.app/match",
        { crushRegNo, crushName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.isMatch) {
        setMessage(`🎉 It's a match with ${crushRegNo}!`);
        setMyMatches(prev => [...prev, crushRegNo]);
      } else {
        setMessage(`Added ${crushName || crushRegNo} to your crushes`);
        setMyCrushes(prev => [...prev, { regNo: crushRegNo, name: crushName }]);
      }

    
      setCrushRegNo("");
      setCrushName("");

    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to add crush");
    }
  };

  const handleDeleteCrush = async (regNo) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(
        `https://projectx-production-7788.up.railway.app/match/${regNo}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyCrushes(prev => prev.filter(c => c.regNo !== regNo));
      setMessage(`Removed crush ${regNo}`);
    } catch (error) {
      setMessage("Failed to delete crush");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 font-inter">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
              <svg width={24} height={24} fill="white" viewBox="0 0 16 16">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748z"/>
              </svg>
            </div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
              Find Your Crush
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Connect with your secret crushes and discover mutual connections at VITAP
          </p>
        </div>

        {/* How It Works Section */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 mb-10 border border-purple-100">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                <svg width={20} height={20} fill="white" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">How It Works</h2>
            </div>
            <p className="text-gray-600">Your complete guide to finding matches</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <span className="text-2xl font-bold text-pink-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Add Your Crush</h3>
              <p className="text-sm text-gray-600">Enter their registration number and optional name. You can add up to 5 crushes at a time.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Wait for Magic</h3>
              <p className="text-sm text-gray-600">If they add you as their crush too, you'll get an instant match notification!</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Manage Crushes</h3>
              <p className="text-sm text-gray-600">Hover over crushes (or tap on mobile) to delete them. Matches can't be deleted.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">See Your Popularity</h3>
              <p className="text-sm text-gray-600">Check how many people have secretly added you as their crush!</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Stats & Matches */}
          <div className="space-y-6">
            {/* Crush Count Card */}
            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-6 border border-pink-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">{crushCount}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Secret Admirers</h3>
                <p className="text-gray-600">
                  <span className="font-semibold text-pink-600">{crushCount}</span> people have you as their crush
                </p>
                <div className="mt-3 text-xs text-gray-500 bg-pink-50 px-3 py-1 rounded-full inline-block">
                  💡 This number updates when someone adds you
                </div>
              </div>
            </div>

            {/* Current Matches */}
            {myMatches.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-6 border border-green-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <svg width={16} height={16} fill="white" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-green-700">🎉 Your Matches</h3>
                </div>
                <div className="text-xs text-green-600 mb-3 bg-green-50 px-3 py-1 rounded-full inline-block">
                  ⚠️ Matches cannot be deleted
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {myMatches.map(regNo => (
                    <div key={regNo} className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 px-4 py-3 rounded-xl shadow-sm text-center">
                      <span className="font-semibold text-green-800">{regNo}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Main Form */}
          <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-pink-100">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Add Your Crush
              </h2>
              <p className="text-gray-600">Keep it secret, make it special ✨</p>
            </div>

            {/* Current Crushes */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-pink-700">Your Crushes</h3>
                <div className="bg-pink-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold text-pink-700">{myCrushes.length}/5</span>
                </div>
              </div>
              
              {myCrushes.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg width={24} height={24} fill="gray" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-2">No crushes added yet</p>
                  <p className="text-xs text-gray-400">Start by adding someone below!</p>
                </div>
              ) : (
                <>
                  <div className="text-xs text-pink-600 mb-3 bg-pink-50 px-3 py-1 rounded-full inline-block">
                    💡 Hover to delete (tap on mobile)
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {myCrushes.map((crush, index) => (
                      <div key={index} className="flex items-center justify-between bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 p-4 rounded-xl shadow-sm group hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {crush.name ? crush.name.charAt(0).toUpperCase() : "?"}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800 block">
                              {crush.name || "Unknown"}
                            </span>
                            <span className="text-sm text-gray-500">{crush.regNo}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteCrush(crush.regNo)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 md:opacity-100"
                          title="Delete crush"
                        >
                          <svg width={16} height={16} fill="currentColor" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Add New Crush Form */}
            <form onSubmit={handleAddCrush} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Registration Number *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={crushRegNo}
                      onChange={(e) => setCrushRegNo(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-200 bg-gray-50/50"
                      placeholder="e.g., 22BCE1234"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg width={16} height={16} fill="gray" viewBox="0 0 16 16">
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={crushName}
                      onChange={(e) => setCrushName(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-200 bg-gray-50/50"
                      placeholder="e.g., Aman Jadon"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg width={16} height={16} fill="gray" viewBox="0 0 16 16">
                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={myCrushes.length >= 5}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 transform ${
                  myCrushes.length >= 5
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white hover:scale-105 hover:shadow-xl active:scale-95"
                }`}
              >
                {myCrushes.length >= 5 ? "Max 5 Crushes Reached" : "Add Crush 💕"}
              </button>
            </form>

            {/* Messages */}
            {message && (
              <div className={`mt-6 p-4 rounded-xl text-center font-medium shadow-sm border-2 transition-all duration-300 ${
                message.includes("🎉") 
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200" 
                  : message.includes("Failed") 
                  ? "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200" 
                  : "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200"
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrushForm;
