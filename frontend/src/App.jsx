import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import WebGisDrawer from './components/WebGisDrawer';
import ErrorBoundary from './components/ErrorBoundary';

// Public Landing & Authentication Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

// Platform Core Pages
import PlatformHome from './pages/PlatformHome';
import AboutPage from './pages/AboutPage';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import UnifiedHistory from './pages/UnifiedHistory';

// Module 1: CatchForecast AI (WebGIS)
import WebGisPage from './pages/WebGisPage';

// Module 2: FishGuard AI (Computer Vision Suite)
import Dashboard from './pages/Dashboard';
import DetectionPage from './pages/DetectionPage';
import CountingPage from './pages/CountingPage';
import MeasurementPage from './pages/MeasurementPage';
import HistoryPage from './pages/HistoryPage';
import DatasetPage from './pages/DatasetPage';

// Module 3: ByCatch AI (Conservation & ETP Protection)
import ByCatchDetectPage from './pages/bycatch/ByCatchDetectPage';
import ByCatchRoleTesterPage from './pages/bycatch/ByCatchRoleTesterPage';
import ByCatchConservationPage from './pages/bycatch/ByCatchConservationPage';
import ByCatchTripPage from './pages/bycatch/ByCatchTripPage';

import { checkHealth, checkByCatchHealth, getStoredUser, logoutUser } from './api/client';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [viewMode, setViewMode] = useState(() => (getStoredUser() ? 'app' : 'landing'));
  const [activeModule, setActiveModule] = useState('home');
  const [activeTab, setActiveTab] = useState('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [healthInfo, setHealthInfo] = useState(null);
  const [bycatchHealth, setBycatchHealth] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setViewMode('app');
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setViewMode('landing');
  };

  const handleExploreGuest = () => {
    setCurrentUser({
      username: 'tamu',
      full_name: 'Pengunjung Tamu',
      role: 'Tamu Publik',
      role_badge: 'bg-slate-800 text-slate-300 border-slate-700',
      avatar: 'TM'
    });
    setViewMode('app');
  };

  const handleNavigateLanding = () => {
    setViewMode('landing');
  };

  useEffect(() => {
    async function initHealth() {
      try {
        const fgData = await checkHealth();
        setHealthInfo(fgData);
      } catch (e) {
        setHealthInfo({ status: 'error' });
      }

      try {
        const bcData = await checkByCatchHealth();
        setBycatchHealth(bcData);
      } catch (e) {
        setBycatchHealth({ status: 'error' });
      }
    }

    initHealth();
    const interval = setInterval(initHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  // 1. PUBLIC LANDING VIEW
  if (viewMode === 'landing') {
    return (
      <LandingPage 
        onLoginClick={() => setViewMode('login')} 
        onExploreGuest={handleExploreGuest} 
      />
    );
  }

  // 2. AUTHENTICATION / LOGIN VIEW
  if (viewMode === 'login') {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess}
        onBackToLanding={handleNavigateLanding}
        onGuestAccess={handleExploreGuest}
      />
    );
  }

  // 3. MAIN DASHBOARD PLATFORM VIEW
  return (
    <div className="flex h-screen bg-[#060b17] text-slate-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        healthInfo={healthInfo} 
        bycatchHealth={bycatchHealth}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onNavigateLanding={handleNavigateLanding}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <Navbar 
          activeModule={activeModule}
          activeTab={activeTab} 
          healthInfo={healthInfo} 
          bycatchHealth={bycatchHealth}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigateLanding={handleNavigateLanding}
        />

        <main className={`flex-1 overflow-y-auto relative ${activeModule === 'catchforecast' ? 'p-0' : 'p-6'}`}>
          <div className={activeModule === 'catchforecast' ? 'h-full w-full' : 'max-w-7xl mx-auto'}>
            <ErrorBoundary>
              {/* PLATFORM HOME */}
              {activeModule === 'home' && (
                <PlatformHome 
                  setActiveModule={setActiveModule}
                  setActiveTab={setActiveTab}
                  healthInfo={healthInfo}
                  bycatchHealth={bycatchHealth}
                />
              )}

              {/* MODULE 1: CATCHFORECAST AI (WEBGIS) */}
              {activeModule === 'catchforecast' && (
                <WebGisPage onOpenDrawer={() => setIsDrawerOpen(true)} />
              )}

              {/* MODULE 2: FISHGUARD AI */}
              {activeModule === 'fishguard' && (
                <>
                  {activeTab === 'dashboard' && (
                    <Dashboard 
                      setActiveTab={setActiveTab} 
                      setSelectedAnalysis={setSelectedAnalysis} 
                    />
                  )}
                  {activeTab === 'detection' && (
                    <DetectionPage 
                      setActiveTab={setActiveTab} 
                      setSelectedAnalysis={setSelectedAnalysis} 
                      healthInfo={healthInfo}
                    />
                  )}
                  {activeTab === 'counting' && (
                    <CountingPage 
                      setActiveTab={setActiveTab} 
                      setSelectedAnalysis={setSelectedAnalysis} 
                    />
                  )}
                  {activeTab === 'measurement' && (
                    <MeasurementPage 
                      selectedAnalysis={selectedAnalysis} 
                      setSelectedAnalysis={setSelectedAnalysis} 
                    />
                  )}
                  {activeTab === 'history' && (
                    <HistoryPage 
                      setActiveTab={setActiveTab} 
                      setSelectedAnalysis={setSelectedAnalysis} 
                    />
                  )}
                  {activeTab === 'dataset' && (
                    <DatasetPage />
                  )}
                </>
              )}

              {/* MODULE 3: BYCATCH AI */}
              {activeModule === 'bycatch' && (
                <>
                  {activeTab === 'bycatch-detect' && (
                    <ByCatchDetectPage bycatchHealth={bycatchHealth} />
                  )}
                  {activeTab === 'bycatch-roles' && (
                    <ByCatchRoleTesterPage />
                  )}
                  {activeTab === 'bycatch-conservation' && (
                    <ByCatchConservationPage />
                  )}
                  {activeTab === 'bycatch-trips' && (
                    <ByCatchTripPage />
                  )}
                </>
              )}

              {/* GLOBAL EXECUTIVE DASHBOARD */}
              {activeModule === 'executive' && (
                <ExecutiveDashboard />
              )}

              {/* UNIFIED SESSION AUDIT & HISTORY */}
              {activeModule === 'unified-history' && (
                <UnifiedHistory />
              )}

              {/* SYSTEM ABOUT & ARCHITECTURE */}
              {activeModule === 'about' && (
                <AboutPage 
                  healthInfo={healthInfo} 
                />
              )}
            </ErrorBoundary>
          </div>
        </main>

        {/* Slide-over Quick Analysis Dock */}
        <WebGisDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          onNavigateTab={(module, tab) => {
            if (module) setActiveModule(module);
            if (tab) setActiveTab(tab);
            setIsDrawerOpen(false);
          }}
        />
      </div>
    </div>
  );
}
