import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Globe, Sparkles, Users, ShieldCheck } from "lucide-react";
import ProfileCount from "../components/ProfileCount";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-sky-100">
      {/* 1. Simple Navigation Bar */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          {/*<Sparkles className="text-indigo-600 w-8 h-8" />*/}
          <span className="text-2xl font-bold tracking-tight text-slate-900">BetterMatch</span>
        </div>
        <div className="hidden md:flex space-x-8 text-slate-600 font-medium">
          
        </div>
      </nav>

      {/* 2. Hero Section */}
      <main className="max-w-7xl mx-auto px-8 py-12 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Text & Value Prop */}
        <div className="space-y-8">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-indigo-700 text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>AI-Driven Matching Technology</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
            Find the therapist who <span className="text-indigo-600">actually</span> gets you.
          </h1>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-md">
            Stop sifting through 1,000+ results. We use AI to match you with 4-6 therapists based on culture, language, and lived experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/match"
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center space-x-2"
            >
              <span>Start Your Match</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center px-4">
               <ProfileCount />
            </div>
          </div>
        </div>

        {/* Right Column: Visual Features Card */}
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-inner">
          <h3 className="text-slate-900 font-bold mb-6">Why BetterMatch?</h3>
          <div className="grid gap-6">
            <FeatureItem 
              icon={<Users className="text-purple-600" />} 
              title="Cultural Alignment" 
              desc="Matches based on shared background and identity." 
            />
            <FeatureItem 
              icon={<Globe className="text-blue-600" />} 
              title="Language Access" 
              desc="Native speakers in over 15+ languages available." 
            />
            <FeatureItem 
              icon={<ShieldCheck className="text-green-600" />} 
              desc="Verified insurance and sliding scale options." 
              title="Financial Fit"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

// Small helper component for the list items
const FeatureItem = ({ icon, title, desc }) => (
  <div className="flex items-start space-x-4 bg-white p-4 rounded-2xl shadow-sm">
    <div className="bg-slate-50 p-3 rounded-lg">{icon}</div>
    <div>
      <h4 className="font-bold text-slate-900">{title}</h4>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
  </div>
);

export default HomePage;