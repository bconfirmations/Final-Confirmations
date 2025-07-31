import { useState, useEffect, useCallback } from 'react';
import { EquityTrade, FXTrade } from '../types/trade';
import { FirebaseService, UnifiedTradeData } from '../services/firebaseService';

export const useFirebaseTradeData = () => {
  const [equityTrades, setEquityTrades] = useState<EquityTrade[]>([]);
  const [fxTrades, setFxTrades] = useState<FXTrade[]>([]);
  const [unifiedData, setUnifiedData] = useState<UnifiedTradeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTradeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all unified data
      const data = await FirebaseService.fetchUnifiedTradeData();
      setUnifiedData(data);
      
      const { equityTrades: equity, fxTrades: fx } = FirebaseService.convertToTradeTypes(data);
      setEquityTrades(equity);
      setFxTrades(fx);
      
      console.log('Unified data loaded:', {
        total: data.length,
        equity: equity.length,
        fx: fx.length
      });
    } catch (err) {
      console.error('Error fetching Firebase trade data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch trade data from Firebase');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFilteredData = useCallback(async (filters: {
    status?: string;
    tradeType?: string;
    counterparty?: string;
    tradeDate?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await FirebaseService.fetchFilteredTradeData(filters);
      setUnifiedData(data);
      
      const { equityTrades: equity, fxTrades: fx } = FirebaseService.convertToTradeTypes(data);
      setEquityTrades(equity);
      setFxTrades(fx);
    } catch (err) {
      console.error('Error fetching filtered Firebase trade data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch filtered trade data from Firebase');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => {
    fetchTradeData();
  }, [fetchTradeData]);

  useEffect(() => {
    fetchTradeData();
  }, [fetchTradeData]);

  return {
    equityTrades,
    fxTrades,
    unifiedData,
    loading,
    error,
    refreshData,
    fetchFilteredData
  };
}; 