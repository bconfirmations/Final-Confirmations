import React, { useState } from 'react';
import Header from './components/Layout/Header';
import TabNavigation from './components/Layout/TabNavigation';
import TradeConfirmationsTab from './components/TradeConfirmations/TradeConfirmationsTab';
import WorkflowManagementTab from './components/WorkflowManagement/WorkflowManagementTab';
import { useTradeData } from './hooks/useTradeData';
import { isFirebaseConfigured } from './config/firebase';
import { Loader2, AlertCircle } from 'lucide-react';


function App() {
  const [activeTab, setActiveTab] = useState<'confirmations' | 'workflow'>('confirmations');
  const { equityTrades, fxTrades, loading, error } = useTradeData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">Loading trade data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3 text-orange-600">
            <AlertCircle className="w-8 h-8" />
            <span className="text-lg">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
      
      <main>
        {activeTab === 'confirmations' ? (
          <TradeConfirmationsTab 
            equityTrades={equityTrades} 
            fxTrades={fxTrades}
            useFirebase={isFirebaseConfigured()}
          />
        ) : (
          <WorkflowManagementTab />
        )}
      </main>
    </div>
  );
}

export default App;