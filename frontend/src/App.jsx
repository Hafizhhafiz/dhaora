import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import PlatformHome from './pages/PlatformHome';
import Dashboard from './pages/Dashboard';
import DetectionPage from './pages/DetectionPage';
import CountingPage from './pages/CountingPage';
import MeasurementPage from './pages/MeasurementPage';
import HistoryPage from './pages/HistoryPage';
import DatasetPage from './pages/DatasetPage';
import AboutPage from './pages/AboutPage';

// ByCatch AI Module Pages
import ByCatchDetectPage from './pages/bycatch/ByCatchDetectPage';
import ByCatchRoleTesterPage from './pages/bycatch/ByCatchRoleTesterPage';
import ByCatchConservationPage from './pages/bycatch/ByCatchConservationPage';
import ByCatchTripPage from './pages/bycatch/ByCatchTripPage';

// OceanSense AI Module Page (Planned)
import OceanSensePage from './pages/OceanSensePage';

import { checkHealth, checkByCatchHealth } from './api/client';

export default function App() {
  const [activeModule, setActiveModule] = useState('home');
  const [activeTab, setActiveTab] = useState('home');
  const [healthInfo, setHealthInfo] = useState(null);
  const [bycatchHealth, setBycatchHealth] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

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

  return (
    <div className="flex min-h-screen bg-[#070d1e] text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        healthInfo={healthInfo} 
        bycatchHealth={bycatchHealth}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          activeModule={activeModule}
          activeTab={activeTab} 
          healthInfo={healthInfo} 
          bycatchHealth={bycatchHealth}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* PLATFORM HOME */}
            {activeModule === 'home' && (
              <PlatformHome 
                setActiveModule={setActiveModule}
                setActiveTab={setActiveTab}
                healthInfo={healthInfo}
                bycatchHealth={bycatchHealth}
              />
            )}

            {/* MODULE 1: FISHGUARD AI */}
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

            {/* MODULE 2: BYCATCH AI */}
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

            {/* MODULE 3: OCEANSENSE AI (PLANNED) */}
            {activeModule === 'oceansense' && (
              <OceanSensePage 
                setActiveModule={setActiveModule}
                setActiveTab={setActiveTab}
              />
            )}

            {/* SYSTEM ABOUT & ARCHITECTURE */}
            {activeModule === 'about' && (
              <AboutPage 
                healthInfo={healthInfo} 
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
