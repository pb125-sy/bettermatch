import React, { useState } from "react";
import { Star, MessageSquare, Target, Settings, ArrowRight } from "lucide-react";

const SessionReview: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Mock data for the last session
  const lastSession = {
    therapistName: "Dr. Sarah Chen",
    date: "October 24, 2025",
    focus: "Anxiety & Work-Life Balance",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In the future, this would trigger calculateMatch() with new weightings
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-white rounded-2xl shadow-sm text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
          <Star fill="currentColor" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Reflection Saved</h2>
        <p className="text-gray-600 mb-6">
          Your feedback has been noted. We'll use this to refine your future matches.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="text-indigo-600 font-medium hover:underline"
        >
          View Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Session Reflection</h1>
          <p className="text-gray-600">How was your meeting with {lastSession.therapistName}?</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Connection Rating */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">
              Therapeutic Alliance
            </label>
            <p className="text-gray-500 text-sm mb-4">How comfortable did you feel sharing today?</p>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-2 transition ${rating >= star ? "text-yellow-400" : "text-gray-200 hover:text-gray-300"}`}
                >
                  <Star size={32} fill={rating >= star ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Future Match Adjustment (The "Hypothetical" part) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="text-indigo-600" size={20} />
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Adjust Match Preferences
              </label>
            </div>
            <p className="text-gray-500 text-sm mb-4">Based on this session, should we shift your focus?</p>
            
            <div className="space-y-3">
              {["More practical tools", "More deep exploration", "Stay the course"].map((opt) => (
                <label key={opt} className="flex items-center p-3 border rounded-xl hover:bg-slate-50 cursor-pointer transition">
                  <input type="radio" name="adjustment" className="w-4 h-4 text-indigo-600" />
                  <span className="ml-3 text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 3: Private Notes */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">
              Private Notes
            </label>
            <textarea
              className="w-full p-4 border rounded-xl h-32 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="What's one thing you want to remember from today?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            Save Reflection <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SessionReview;