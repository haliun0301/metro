import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const globalStyle = `html, body { height: 100%; overflow-y: auto !important; }`;
  return (
    <>
      <style>{globalStyle}</style>
      <div
        className="w-full min-h-screen flex flex-col"
        style={{
          backgroundImage: "url('../assets/bg1.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Hero Section */}
        <div
          className="w-full min-h-[80vh] flex items-center justify-center relative"
          style={{
            backgroundImage: "url('../assets/bg1.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-green-300 opacity-30" />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-4">
              RAPID TRANSIT IN SHENZHEN
            </h1>
          </div>
        </div>

        {/* 3 Columns Section */}
        <div className="w-full flex flex-row h-[340px] md:h-[640px]">
          <div
            className="flex-1 flex flex-col items-center justify-center cursor-pointer transition hover:scale-105 relative"
            style={{ backgroundColor: '#EAAF73' }}
            onClick={() => navigate('/map')}
          >
            <h2
              className="text-5xl font-bold text-white uppercase"
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                position: 'absolute',
                left: 16,
                top: 24,
                margin: 0,
                letterSpacing: '0.08em',
              }}
            >
              METRO STATIONS
            </h2>
          </div>
          <div
            className="flex-1 flex flex-col items-center justify-center relative"
            style={{ backgroundColor: '#2A383E' }}
          >
            <h2
              className="text-5xl font-bold text-white uppercase"
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                position: 'absolute',
                left: 16,
                top: 24,
                margin: 0,
                letterSpacing: '0.08em',
              }}
            >
              METRO & PEOPLE
            </h2>
          </div>
          <div
            className="flex-1 flex flex-col items-center justify-center relative"
            style={{ backgroundColor: '#3EB181' }}
          >
            <h2
              className="text-5xl font-bold text-white uppercase"
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                position: 'absolute',
                left: 16,
                top: 24,
                margin: 0,
                letterSpacing: '0.08em',
              }}
            >
              METRO & CITY
            </h2>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full bg-black text-white py-8 mt-auto h-48 md:h-64 flex items-center">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-col items-center justify-between">
            <div className="text-lg">Rapid Transit in Shenzhen city</div> 
            <div className="text-sm text-gray-400">&copy; 2026 Powered by React, Vite, and Gemini AI</div>
          </div>
        </footer>
      </div>
    </>
  );
}
  