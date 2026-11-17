import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import DetectionPage from './pages/DetectionPage';
import CountingPage from './pages/CountingPage';
import MeasurementPage from './pages/MeasurementPage';
import HistoryPage from './pages/HistoryPage';
import DatasetPage from './pages/DatasetPage';
import AboutPage from './pages/AboutPage';
import { checkHealth } from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [healthInfo, setHealthInfo] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  useEffect(() => {
    async function initHealth() {
      const data = await checkHealth();
      setHealthInfo(data);
    }
    initHealth();
    const interval = setInterval(initHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#070d1e] text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        healthInfo={healthInfo} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          activeTab={activeTab} 
          healthInfo={healthInfo} 
        />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
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
            {activeTab === 'about' && (
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
