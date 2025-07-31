import React from 'react';
import { generateBreakReason } from '../../utils/breakReasonGenerator';
import { EquityTrade, FXTrade } from '../../types/trade';

const BreakReasonTest: React.FC = () => {
  // Sample trade data
  const sampleEquityTrade: EquityTrade = {
    tradeId: 'TID00001',
    orderId: 'OID00001',
    clientId: 'CID5962',
    tradeType: 'Buy',
    quantity: 942,
    price: 721.36,
    tradeValue: 679521.12,
    currency: 'USD',
    tradeDate: '2024-01-24',
    settlementDate: '2024-01-26',
    counterparty: 'Citibank',
    tradingVenue: 'IEX',
    traderName: 'Trader A',
    confirmationStatus: 'Failed',
    countryOfTrade: 'US',
    opsTeamNotes: 'Clean'
  };

  const sampleFXTrade: FXTrade = {
    tradeId: 'FX0001',
    tradeDate: '2025-05-11',
    valueDate: '2025-05-16',
    tradeTime: '14:07:18',
    traderId: 'TDR446',
    counterparty: 'HSBC',
    currencyPair: 'EUR/USD',
    buySell: 'Sell',
    dealtCurrency: 'USD',
    baseCurrency: 'EUR',
    termCurrency: 'USD',
    tradeStatus: 'Cancelled',
    productType: 'Forward',
    maturityDate: '2025-05-16',
    confirmationTimestamp: '2025-05-11 13:53',
    settlementDate: '2025-05-16',
    amendmentFlag: 'No',
    confirmationMethod: 'SWIFT',
    confirmationStatus: 'Pending'
  };

  const [equityBreakReason, setEquityBreakReason] = React.useState(() => generateBreakReason(sampleEquityTrade));
  const [fxBreakReason, setFxBreakReason] = React.useState(() => generateBreakReason(sampleFXTrade));

  const regenerateEquity = () => {
    setEquityBreakReason(generateBreakReason(sampleEquityTrade));
  };

  const regenerateFX = () => {
    setFxBreakReason(generateBreakReason(sampleFXTrade));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Break Reason Generator Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Equity Trade Test */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Equity Trade Break Reason</h2>
          <div className="space-y-2 mb-4">
            <p><strong>Trade ID:</strong> {sampleEquityTrade.tradeId}</p>
            <p><strong>Status:</strong> {sampleEquityTrade.confirmationStatus}</p>
            <p><strong>Trade Value:</strong> ${sampleEquityTrade.tradeValue.toLocaleString()}</p>
            <p><strong>Currency:</strong> {sampleEquityTrade.currency}</p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <h3 className="font-medium text-red-900 mb-2">Generated Break Reason:</h3>
            <div className="text-sm text-red-700">
              <p><strong>{equityBreakReason.field}:</strong></p>
              <p>Barclays - {equityBreakReason.barclaysValue}</p>
              <p>Client - {equityBreakReason.clientValue}</p>
            </div>
          </div>
          
          <button
            onClick={regenerateEquity}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Regenerate
          </button>
        </div>

        {/* FX Trade Test */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">FX Trade Break Reason</h2>
          <div className="space-y-2 mb-4">
            <p><strong>Trade ID:</strong> {sampleFXTrade.tradeId}</p>
            <p><strong>Status:</strong> {sampleFXTrade.tradeStatus}</p>
            <p><strong>Currency Pair:</strong> {sampleFXTrade.currencyPair}</p>
            <p><strong>Product Type:</strong> {sampleFXTrade.productType}</p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <h3 className="font-medium text-red-900 mb-2">Generated Break Reason:</h3>
            <div className="text-sm text-red-700">
              <p><strong>{fxBreakReason.field}:</strong></p>
              <p>Barclays - {fxBreakReason.barclaysValue}</p>
              <p>Client - {fxBreakReason.clientValue}</p>
            </div>
          </div>
          
          <button
            onClick={regenerateFX}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Regenerate
          </button>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">Test Instructions:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Click "Regenerate" buttons to see different break reasons</li>
          <li>• Each trade will have 1 random field mismatch</li>
          <li>• The format follows: "Field: Barclays - [value] | Client - [value]"</li>
          <li>• Available fields: Trade Date, Notional, Currency Pair, Maturity Date, Settlement Date, Counterparty, Product Type</li>
        </ul>
      </div>
    </div>
  );
};

export default BreakReasonTest; 