import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import WebGisDrawer from './components/WebGisDrawer';
import WebGisPage from './pages/WebGisPage';
import FishguardStudio from './pages/FishguardStudio';
import BycatchCenter from './pages/BycatchCenter';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import UnifiedHistory from './pages/UnifiedHistory';
import ErrorBoundary from './components/ErrorBoundary';
import { checkHealth } from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('webgis');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [healthInfo, setHealthInfo] = useState(null);

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
    <div className="flex h-screen bg-[#060b17] text-slate-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        healthInfo={healthInfo}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <Navbar 
          activeTab={activeTab} 
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />

        <main className="flex-1 overflow-y-auto relative">
          <ErrorBoundary>
            {activeTab === 'webgis' && (
              <WebGisPage onOpenDrawer={() => setIsDrawerOpen(true)} />
            )}
            {activeTab === 'fishguard' && (
              <FishguardStudio />
            )}
            {activeTab === 'bycatch' && (
              <BycatchCenter />
            )}
            {activeTab === 'dashboard' && (
              <ExecutiveDashboard />
            )}
            {activeTab === 'history' && (
              <UnifiedHistory />
            )}
          </ErrorBoundary>
        </main>

        {/* Slide-over Quick Analysis Dock */}
        <WebGisDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            setIsDrawerOpen(false);
          }}
        />
      </div>
    </div>
  );
}
