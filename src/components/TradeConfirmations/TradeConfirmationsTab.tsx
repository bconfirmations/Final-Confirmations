import React, { useState, useMemo } from "react";
import { EquityTrade, FXTrade } from "../../types/trade";
import TradeFilters from "./TradeFilters";
import TradeCard from "./TradeCard";
import { useFirebaseTradeData } from "../../hooks/useFirebaseTradeData";
import { RefreshCw, AlertCircle } from "lucide-react";

interface TradeConfirmationsTabProps {
  equityTrades?: EquityTrade[];
  fxTrades?: FXTrade[];
  useFirebase?: boolean;
}

const TradeConfirmationsTab: React.FC<TradeConfirmationsTabProps> = ({
  equityTrades: propEquityTrades,
  fxTrades: propFxTrades,
  useFirebase = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tradeTypeFilter, setTradeTypeFilter] = useState("all");
  const [counterpartyFilter, setCounterpartyFilter] = useState("all");
  const [tradeDateFilter, setTradeDateFilter] = useState("");

  // Use Firebase data if enabled, otherwise use props
  const {
    equityTrades: firebaseEquityTrades,
    fxTrades: firebaseFxTrades,
    loading,
    error,
    refreshData
  } = useFirebaseTradeData();

  // Combine all trades
  const allTrades = useMemo(() => {
    const equityTrades = useFirebase ? firebaseEquityTrades : (propEquityTrades || []);
    const fxTrades = useFirebase ? firebaseFxTrades : (propFxTrades || []);
    return [...equityTrades, ...fxTrades];
  }, [useFirebase, firebaseEquityTrades, firebaseFxTrades, propEquityTrades, propFxTrades]);

  // Filter trades based on search and filters
  const filteredTrades = useMemo(() => {
    return allTrades.filter((trade) => {
      const isEquityTrade = "quantity" in trade;
      const status = isEquityTrade
        ? (trade as EquityTrade).confirmationStatus
        : (trade as FXTrade).tradeStatus;
      const tradeDate = isEquityTrade
        ? (trade as EquityTrade).tradeDate
        : (trade as FXTrade).tradeDate;

      // Search filter - search in trade ID and counterparty
      const searchMatch =
        searchTerm === "" ||
        trade.tradeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.counterparty.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const statusMatch =
        statusFilter === "all" ||
        status.toLowerCase() === statusFilter.toLowerCase();

      // Trade type filter
      const typeMatch =
        tradeTypeFilter === "all" ||
        (tradeTypeFilter === "equity" && isEquityTrade) ||
        (tradeTypeFilter === "fx" && !isEquityTrade);

      // Counterparty filter
      const counterpartyMatch =
        counterpartyFilter === "all" ||
        trade.counterparty.toLowerCase().includes(counterpartyFilter.toLowerCase());

      // Trade date filter
      const dateMatch =
        tradeDateFilter === "" || tradeDate === tradeDateFilter;

      return (
        searchMatch &&
        statusMatch &&
        typeMatch &&
        counterpartyMatch &&
        dateMatch
      );
    });
  }, [
    allTrades,
    searchTerm,
    statusFilter,
    tradeTypeFilter,
    counterpartyFilter,
    tradeDateFilter,
  ]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const stats = {
      total: allTrades.length,
      inProgress: 0,
      completed: 0,
      completionRate: 0,
    };

    allTrades.forEach((trade) => {
      const isEquityTrade = "quantity" in trade;
      const status = isEquityTrade
        ? (trade as EquityTrade).confirmationStatus
        : (trade as FXTrade).tradeStatus;

      if (status.toLowerCase() === "settled" || status.toLowerCase() === "confirmed") {
        stats.completed++;
      } else {
        stats.inProgress++;
      }
    });

    stats.completionRate = allTrades.length > 0 ? (stats.completed / allTrades.length) * 100 : 0;
    return stats;
  }, [allTrades]);

  // Show loading state
  if (useFirebase && loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">Loading trade data from Firebase...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (useFirebase && error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3 text-red-600">
            <AlertCircle className="w-8 h-8" />
            <div>
              <span className="text-lg font-medium">Error loading data</span>
              <p className="text-sm text-gray-600 mt-1">{error}</p>
              <button
                onClick={refreshData}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              FX Trade Confirmations
            </h2>
            <p className="text-gray-600">
              View FX trades from Firebase unified_data collection. Total FX trades: {allTrades.length}
            </p>
          </div>
          {useFirebase && (
            <button
              onClick={refreshData}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trades</p>
              <p className="text-2xl font-bold text-gray-900">
                {summaryStats.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold">T</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">
                {summaryStats.inProgress}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 font-bold">T</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Completion Rate
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {summaryStats.completionRate.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold">%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {summaryStats.completed}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
          </div>
        </div>
      </div>

      <TradeFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        tradeTypeFilter={tradeTypeFilter}
        onTradeTypeFilterChange={setTradeTypeFilter}
        counterpartyFilter={counterpartyFilter}
        onCounterpartyFilterChange={setCounterpartyFilter}
        tradeDateFilter={tradeDateFilter}
        onTradeDateFilterChange={setTradeDateFilter}
      />

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredTrades.length} of {allTrades.length} trades
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrades.map((trade) => (
          <TradeCard key={trade.tradeId} trade={trade} />
        ))}
      </div>

      {filteredTrades.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No trades found matching your criteria.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your filters or search terms.
          </p>
        </div>
      )}
    </div>
  );
};

export default TradeConfirmationsTab;
