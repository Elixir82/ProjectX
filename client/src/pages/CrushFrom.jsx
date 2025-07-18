import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import Navbar from "../components/Navbar";

const CrushForm = () => {
  const [crushes, setCrushes] = useState([""]);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const [crushCount, setCrushCount] = useState(0);
  const [myMatches, setMyMatches] = useState([]);

  useEffect(() => {
    const fetchCrushCount = async () => {
      if (user?.regNo) {
        const token = localStorage.getItem("token");
        try {
          const res = await axios.get(
            `https://projectx-vbmj.onrender.com/match/count/${user.regNo}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setCrushCount(res.data.count);
        } catch {
          setCrushCount(0);
        }
      }
    };
    fetchCrushCount();
  }, [user?.regNo]);

  useEffect(() => {
    const fetchMyMatches = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("https://projectx-vbmj.onrender.com/match/my-matches", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyMatches(res.data.matchedWith);
      } catch {
        setMyMatches([]);
      }
    };
    fetchMyMatches();
  }, []);

  const handleChange = (index, value) => {
    const updated = [...crushes];
    updated[index] = value;
    setCrushes(updated);
  };

  const addField = () => {
    if (crushes.length < 5) setCrushes([...crushes, ""]);
  };

  const removeField = (index) => {
    if (crushes.length > 1) {
      const updated = crushes.filter((_, i) => i !== index);
      setCrushes(updated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in.");

    const filteredCrushes = crushes.filter((crush) => crush.trim() !== "");

    if (filteredCrushes.length === 0) {
      setMessage("Please enter at least one crush registration number.");
      return;
    }

    try {
      const res = await axios.post(
        "https://projectx-vbmj.onrender.com/match",
        { crushes: filteredCrushes, user },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);

      if (res.data.newMatches && res.data.newMatches.length > 0) {
        setMessage(
          `🎉 You have ${res.data.newMatches.length} new match(es)! Registration numbers: ${res.data.newMatches.join(
            ", "
          )}`
        );
      }
    } catch (err) {
      console.error("Match error:", err.message);
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200 font-inter">
      <Navbar />

      <div className="max-w-2xl mx-auto px-2 sm:px-4 md:px-8 py-6 md:py-10">
        <div className="bg-white shadow-2xl border border-pink-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 flex flex-col gap-6 sm:gap-8 mt-4 sm:mt-8 backdrop-blur-md">

          <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-600 tracking-tight text-center drop-shadow">
            Find Your Campus Crush <span className="inline-block animate-pulse">💕</span>
          </h2>

          <div className="mb-2 sm:mb-4 p-3 sm:p-4 bg-gradient-to-r from-pink-100 to-pink-50 rounded-xl sm:rounded-2xl shadow-sm border border-pink-200">
            <p className="text-sm sm:text-md text-pink-700 leading-relaxed text-center">
              <strong>How it works:</strong> Enter your crush's registration numbers below.
              If they've also added you, you'll <span className="bg-green-100 px-2 py-1 rounded">get a match notification</span>!
            </p>
            {user?.regNo && (
              <div className="mt-2 sm:mt-4 text-center text-pink-800 font-semibold">
                <span className="inline-flex items-center gap-1">
                  <span className="text-lg sm:text-xl">{crushCount}</span>
                  {crushCount === 1 ? "person has" : "people have"} added you as a crush 💌
                </span>
              </div>
            )}
          </div>

          {myMatches && myMatches.length > 0 && (
            <div className="mb-2 sm:mb-4 p-3 sm:p-4 bg-lime-100 shadow rounded-xl sm:rounded-2xl text-green-800 font-medium flex flex-col items-center gap-1 sm:gap-2">
              <span className="text-base sm:text-lg font-semibold">💚 You're matched!</span>
              <span className="flex flex-wrap gap-1 sm:gap-2 text-sm sm:text-base">
                {myMatches.map((reg) => (
                  <span key={reg} className="bg-white border px-2 py-1 rounded-lg shadow">
                    {reg}
                  </span>
                ))}
              </span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-3 sm:space-y-4 flex flex-col gap-2 sm:gap-3"
            autoComplete="off"
          >
            <div className="flex flex-col gap-3 sm:gap-4">
              {crushes.map((value, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(i, e.target.value)}
                    className="flex-1 px-4 py-2 sm:py-3 border-2 border-pink-200 focus:border-pink-400 transition shadow-sm bg-pink-50 rounded-xl sm:rounded-2xl text-base sm:text-lg font-medium focus:outline-none focus:ring ring-pink-100"
                    placeholder={`Crush ${i + 1} registration number (e.g., 22bce1234)`}
                    maxLength={20}
                  />
                  {crushes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField(i)}
                      className="w-full sm:w-auto sm:px-3 py-2 sm:py-3 bg-red-500 text-white rounded-xl sm:rounded-2xl hover:bg-red-600 transition shadow hover:scale-105 active:scale-95"
                      aria-label="Remove"
                      title="Remove this field"
                    >
                      <span className="text-base sm:text-lg">✕</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
              {crushes.length < 5 ? (
                <button
                  type="button"
                  onClick={addField}
                  className="text-pink-700 hover:text-pink-600 font-semibold px-2 py-1 rounded-lg border border-pink-200 bg-pink-50/75 shadow hover:bg-pink-100 transition w-full sm:w-auto"
                >
                  + Add another crush
                </button>
              ) : (
                <span className="text-pink-400 font-semibold w-full sm:w-auto text-center">Max 5 reached</span>
              )}
              <span className="text-xs text-gray-400 text-center sm:text-left">
                {crushes.length} / 5 fields
              </span>
            </div>
            <button
              type="submit"
              className="w-full bg-pink-600 shadow-lg hover:bg-pink-700 active:scale-95 transition text-white py-3 rounded-2xl font-semibold text-base sm:text-lg tracking-wide border-2 border-pink-500 ring-1 ring-transparent hover:ring-pink-400 focus:outline-none"
            >
              Submit My Crushes 💘
            </button>
          </form>

          {message && (
            <div
              className={`mt-4 sm:mt-6 mx-auto w-full max-w-full sm:max-w-lg p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow font-bold text-center text-sm sm:text-md
                ${
                  message.includes("🎉")
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : message.includes("wrong")
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-blue-100 text-pink-700 border border-pink-200"
                }
              `}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrushForm;
