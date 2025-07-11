import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroBox from './components/HeroBox';
import FilterSection from './components/FilterSection';
import HeatmapSection from './components/HeatmapSection';
import Footer from './components/Footer';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; // ✅ Add this line

function App() {
  return (
    <Router>
      <div
        style={{
          position: 'relative',
          minHeight: '100vh',
          width: '100%',
          overflowX: 'hidden',
          backgroundColor: '#f8b7c3',
        }}
      >
        {/* ✅ Full-bleed background overlay */}
        <div
          style={{
            backgroundImage: `url('/assets/bg.png')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '125%',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.2,
            zIndex: 0,
          }}
        ></div>

        {/* ✅ Main content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Navbar />
          <HeroBox />

          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>

          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
