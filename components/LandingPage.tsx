import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const maskProgress = Math.min(scrollY / window.innerHeight, 1);
  const clipPathValue = `circle(${20 + maskProgress * 80}% at 50% 50%)`;

  const globalStyle = `html, body { height: 100%; overflow-y: auto !important; }`;
  return (
    <>
      <style>{`
        ${globalStyle}
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-24px); }
          100% { transform: translateY(0); }
        }
        .float-animate {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
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
          className="w-full h-screen flex items-center justify-center relative"
          style={{
            backgroundImage: "url('../assets/bg1.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Menu Icon - top right */}
          <button
            className="absolute top-8 right-8 z-20 p-3 rounded-full hover:bg-white shadow-md transition"
            aria-label="Open menu"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect y="7" width="32" height="3" rx="1.5" fill="#fff" />
              <rect y="14.5" width="32" height="3" rx="1.5" fill="#fff" />
              <rect y="22" width="32" height="3" rx="1.5" fill="#fff" />
            </svg>
          </button>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-green-300 opacity-30" />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-6xl md:text-8xl font-extrabold text-white drop-shadow-2xl mb-4 float-animate">
              RAPID TRANSIT IN SHENZHEN
            </h1>
          </div>
        </div>

        {/* 3 Columns Section */}
        <div className="w-full flex flex-row h-screen md:screen">
          <div
            className="flex-1 flex flex-col items-center justify-center cursor-pointer transition relative"
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
            className="flex-1 flex flex-col items-center justify-center cursor-pointer transition relative"
            style={{ backgroundColor: '#2A383E' }}
            onClick={() => navigate('/people')}
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
            className="flex-1 flex flex-col items-center justify-center cursor-pointer transition relative"
            style={{ backgroundColor: '#3EB181' }}
            onClick={() => navigate('https://shenzhen-subway.framer.website/city')}
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
            <div className="text-sm text-gray-400">&copy; 2026 Powered by React, Vite and Framer</div>
          </div>
        </footer>
      </div>
    </>
  );
}
