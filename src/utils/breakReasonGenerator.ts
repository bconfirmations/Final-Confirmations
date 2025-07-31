import { EquityTrade, FXTrade } from '../types/trade';

export interface BreakReason {
  field: string;
  barclaysValue: string;
  clientValue: string;
}

const breakFields = [
  'Trade Date',
  'Notional',
  'Currency Pair',
  'Maturity Date',
  'Settlement Date',
  'Counterparty',
  'Product Type'
];

const generateRandomValue = (field: string, trade: EquityTrade | FXTrade): string => {
  const isEquityTrade = 'quantity' in trade;
  
  switch (field) {
    case 'Trade Date': {
      const tradeDate = new Date(trade.tradeDate);
      const tradeRandomDays = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1 days
      const newDate = new Date(tradeDate);
      newDate.setDate(tradeDate.getDate() + tradeRandomDays);
      return newDate.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    }
    
    case 'Notional': {
      if (isEquityTrade) {
        const baseValue = (trade as EquityTrade).tradeValue;
        const variation = baseValue * (0.95 + Math.random() * 0.1); // ±5% variation
        return variation.toLocaleString('en-US', { 
          minimumFractionDigits: 0, 
          maximumFractionDigits: 0 
        });
      } else {
        // For FX trades, use a random notional amount
        const baseValue = 1000000 + Math.random() * 9000000; // 1M to 10M
        const variation = baseValue * (0.95 + Math.random() * 0.1);
        return variation.toLocaleString('en-US', { 
          minimumFractionDigits: 0, 
          maximumFractionDigits: 0 
        });
      }
    }
    
    case 'Currency Pair': {
      if (isEquityTrade) {
        return (trade as EquityTrade).currency;
      } else {
        const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD'];
        return pairs[Math.floor(Math.random() * pairs.length)];
      }
    }
    
    case 'Maturity Date': {
      if (isEquityTrade) {
        return 'N/A';
      } else {
        const fxTrade = trade as FXTrade;
        if (fxTrade.maturityDate) {
          const maturityDate = new Date(fxTrade.maturityDate);
          const maturityRandomDays = Math.floor(Math.random() * 3) - 1;
          const newDate = new Date(maturityDate);
          newDate.setDate(maturityDate.getDate() + maturityRandomDays);
          return newDate.toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
          });
        }
        return 'N/A';
      }
    }
    
    case 'Settlement Date': {
      const settlementDate = new Date(trade.settlementDate);
      const settlementRandomDays = Math.floor(Math.random() * 3) - 1;
      const newSettlementDate = new Date(settlementDate);
      newSettlementDate.setDate(settlementDate.getDate() + settlementRandomDays);
      return newSettlementDate.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    }
    
    case 'Counterparty': {
      const counterparties = ['Goldman Sachs', 'Morgan Stanley', 'JP Morgan', 'Citigroup', 'Bank of America'];
      return counterparties[Math.floor(Math.random() * counterparties.length)];
    }
    
    case 'Product Type': {
      if (isEquityTrade) {
        return 'Equity';
      } else {
        const fxTrade = trade as FXTrade;
        return fxTrade.productType;
      }
    }
    
    default:
      return 'N/A';
  }
};

const getOriginalValue = (field: string, trade: EquityTrade | FXTrade): string => {
  const isEquityTrade = 'quantity' in trade;
  
  switch (field) {
    case 'Trade Date': {
      return new Date(trade.tradeDate).toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    }
    
    case 'Notional': {
      if (isEquityTrade) {
        return (trade as EquityTrade).tradeValue.toLocaleString('en-US', { 
          minimumFractionDigits: 0, 
          maximumFractionDigits: 0 
        });
      } else {
        // For FX trades, generate a reasonable notional
        const baseValue = 1000000 + Math.random() * 9000000;
        return baseValue.toLocaleString('en-US', { 
          minimumFractionDigits: 0, 
          maximumFractionDigits: 0 
        });
      }
    }
    
    case 'Currency Pair': {
      if (isEquityTrade) {
        return (trade as EquityTrade).currency;
      } else {
        return (trade as FXTrade).currencyPair;
      }
    }
    
    case 'Maturity Date': {
      if (isEquityTrade) {
        return 'N/A';
      } else {
        const fxTrade = trade as FXTrade;
        if (fxTrade.maturityDate) {
          return new Date(fxTrade.maturityDate).toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
          });
        }
        return 'N/A';
      }
    }
    
    case 'Settlement Date': {
      return new Date(trade.settlementDate).toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    }
    
    case 'Counterparty': {
      return trade.counterparty;
    }
    
    case 'Product Type': {
      if (isEquityTrade) {
        return 'Equity';
      } else {
        return (trade as FXTrade).productType;
      }
    }
    
    default:
      return 'N/A';
  }
};

export const generateBreakReason = (trade: EquityTrade | FXTrade): BreakReason => {
  // Randomly select one field to have a break
  const randomField = breakFields[Math.floor(Math.random() * breakFields.length)];
  
  const originalValue = getOriginalValue(randomField, trade);
  const mismatchedValue = generateRandomValue(randomField, trade);
  
  // Ensure the values are different (if they're the same, regenerate the mismatched value)
  let finalMismatchedValue = mismatchedValue;
  let attempts = 0;
  while (finalMismatchedValue === originalValue && attempts < 10) {
    finalMismatchedValue = generateRandomValue(randomField, trade);
    attempts++;
  }
  
  return {
    field: randomField,
    barclaysValue: originalValue,
    clientValue: finalMismatchedValue
  };
}; 