import { generateBreakReason } from './breakReasonGenerator';
import { EquityTrade, FXTrade } from '../types/trade';

// Test data
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

// Test function
export const testBreakReasonGenerator = () => {
  console.log('Testing Break Reason Generator...');
  
  // Test with Equity Trade
  console.log('\n--- Equity Trade Test ---');
  const equityBreakReason = generateBreakReason(sampleEquityTrade);
  console.log('Generated Break Reason:', equityBreakReason);
  console.log('Field:', equityBreakReason.field);
  console.log('TradeBank Value:', equityBreakReason.bankValue);
  console.log('Client Value:', equityBreakReason.clientValue);
  
  // Test with FX Trade
  console.log('\n--- FX Trade Test ---');
  const fxBreakReason = generateBreakReason(sampleFXTrade);
  console.log('Generated Break Reason:', fxBreakReason);
  console.log('Field:', fxBreakReason.field);
  console.log('TradeBank Value:', fxBreakReason.bankValue);
  console.log('Client Value:', fxBreakReason.clientValue);
  
  // Test multiple generations to ensure variety
  console.log('\n--- Multiple Generations Test ---');
  for (let i = 0; i < 5; i++) {
    const reason = generateBreakReason(sampleEquityTrade);
    console.log(`Generation ${i + 1}: ${reason.field} - TradeBank: ${reason.bankValue} | Client: ${reason.clientValue}`);
  }
  
  console.log('\nBreak Reason Generator Test Complete!');
}; 