import { collection, getDocs, query, orderBy, where, DocumentData } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { EquityTrade, FXTrade } from '../types/trade';

export interface UnifiedTradeData extends DocumentData {
  id: string;
  TradeID: string;
  KYCCheck?: string;
  TradeStatus: string;
  DealtCurrency?: string;
  ExecutionVenue?: string;
  Portfolio?: string;
  CustodyFee?: number;
  CurrencyPair?: string;
  SettlementCurrency?: string;
  SettlementDate?: string;
  CommissionAmount?: number;
  CustodyCurrency?: string;
  BrokerageCurrency?: string;
  TraderID?: string;
  Broker?: string;
  TradeTime?: string;
  TradeSourceSystem?: string;
  RiskSystemID?: string;
  SettlementInstructions?: string;
  ExpenseApprovalStatus?: string;
  FXRate?: number;
  TradeDate: string;
  TradeComplianceStatus?: string;
  BookingLocation?: string;
  RegulatoryReportingStatus?: string;
  Counterparty: string;
  AuditTrailRef?: string;
  BrokerageFee?: number;
  NettingEligibility?: string;
  TradeVersion?: string;
  TermCurrency?: string;
  MaturityDate?: string;
  BuySell?: string;
  SettlementMethod?: string;
  BaseCurrency?: string;
  ValueDate?: string;
  NotionalAmount?: number;
  Reference_Data_Validated?: string;
  ProductType?: string;
  AmendmentFlag?: string;
  ExceptionFlag?: string;
  CancellationFlag?: string;
  CommissionCurrency?: string;
  SanctionsScreening?: string;
  'Exception Description'?: string;
  'Exception Reason'?: string;
  comments?: string;
  Custodian_Name?: string;
}

export class FirebaseService {
  private static readonly COLLECTION_NAME = 'unified_data';

  /**
   * Fetch all trade data from the unified_data collection
   */
  static async fetchUnifiedTradeData(): Promise<UnifiedTradeData[]> {
    if (!isFirebaseConfigured() || !db) {
      console.warn('Firebase not configured, returning empty array');
      return [];
    }

    try {
      const collectionRef = collection(db, this.COLLECTION_NAME);
      const q = query(collectionRef, orderBy('TradeDate', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const trades: UnifiedTradeData[] = [];
      querySnapshot.forEach((doc) => {
        trades.push({
          id: doc.id,
          ...doc.data()
        } as UnifiedTradeData);
      });
      
      console.log('Raw Firebase data:', trades);
      return trades;
    } catch (error) {
      console.error('Error fetching unified trade data:', error);
      throw new Error('Failed to fetch trade data from Firebase');
    }
  }

  /**
   * Fetch only FX trades from the unified_data collection
   */
  static async fetchFXTradesOnly(): Promise<UnifiedTradeData[]> {
    if (!isFirebaseConfigured() || !db) {
      console.warn('Firebase not configured, returning empty array');
      return [];
    }

    try {
      const collectionRef = collection(db, this.COLLECTION_NAME);
      const q = query(collectionRef, orderBy('TradeDate', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const allTrades: UnifiedTradeData[] = [];
      querySnapshot.forEach((doc) => {
        allTrades.push({
          id: doc.id,
          ...doc.data()
        } as UnifiedTradeData);
      });
      
      // Filter to only FX trades
      const fxTrades = allTrades.filter(trade => {
        const isFxTrade = trade.CurrencyPair || 
                         trade.ProductType === 'FX' || 
                         trade.ProductType === 'Spot' || 
                         trade.ProductType === 'Forward' || 
                         trade.ProductType === 'Swap';
        return isFxTrade;
      });
      
      console.log('FX trades found:', fxTrades.length, 'out of', allTrades.length, 'total trades');
      console.log('FX trades:', fxTrades);
      return fxTrades;
    } catch (error) {
      console.error('Error fetching FX trade data:', error);
      throw new Error('Failed to fetch FX trade data from Firebase');
    }
  }

  /**
   * Fetch trade data with filters
   */
  static async fetchFilteredTradeData(filters: {
    status?: string;
    tradeType?: string;
    counterparty?: string;
    tradeDate?: string;
  }): Promise<UnifiedTradeData[]> {
    if (!isFirebaseConfigured() || !db) {
      console.warn('Firebase not configured, returning empty array');
      return [];
    }

    try {
      const collectionRef = collection(db, this.COLLECTION_NAME);
      let q = query(collectionRef, orderBy('TradeDate', 'desc'));
      
      // Apply filters
      if (filters.status && filters.status !== 'all') {
        q = query(q, where('TradeStatus', '==', filters.status));
      }
      
      if (filters.counterparty && filters.counterparty !== 'all') {
        q = query(q, where('Counterparty', '==', filters.counterparty));
      }
      
      if (filters.tradeDate) {
        q = query(q, where('TradeDate', '==', filters.tradeDate));
      }
      
      const querySnapshot = await getDocs(q);
      
      const trades: UnifiedTradeData[] = [];
      querySnapshot.forEach((doc) => {
        trades.push({
          id: doc.id,
          ...doc.data()
        } as UnifiedTradeData);
      });
      
      // Apply trade type filter in memory since we determine it dynamically
      if (filters.tradeType && filters.tradeType !== 'all') {
        return trades.filter(trade => {
          const isEquityTrade = trade.ExecutionVenue && !trade.CurrencyPair;
          const isFxTrade = trade.CurrencyPair || trade.ProductType === 'FX' || trade.ProductType === 'Spot' || trade.ProductType === 'Forward' || trade.ProductType === 'Swap';
          
          if (filters.tradeType === 'equity') return isEquityTrade;
          if (filters.tradeType === 'fx') return isFxTrade;
          return true;
        });
      }
      
      return trades;
    } catch (error) {
      console.error('Error fetching filtered trade data:', error);
      throw new Error('Failed to fetch filtered trade data from Firebase');
    }
  }

  /**
   * Convert unified trade data to the existing trade types
   */
  static convertToTradeTypes(unifiedData: UnifiedTradeData[]): {
    equityTrades: EquityTrade[];
    fxTrades: FXTrade[];
  } {
    const equityTrades: EquityTrade[] = [];
    const fxTrades: FXTrade[] = [];

    unifiedData.forEach((item) => {
      // Determine trade type based on available fields
      const isEquityTrade = item.ExecutionVenue && !item.CurrencyPair;
      const isFxTrade = item.CurrencyPair || item.ProductType === 'FX' || item.ProductType === 'Spot' || item.ProductType === 'Forward' || item.ProductType === 'Swap';

      if (isEquityTrade) {
        const equityTrade: EquityTrade = {
          tradeId: item.TradeID,
          orderId: item.AuditTrailRef || '',
          clientId: item.Portfolio || '',
          tradeType: (item.BuySell as 'Buy' | 'Sell') || 'Buy',
          quantity: item.NotionalAmount || 0,
          price: item.FXRate || 0,
          tradeValue: item.NotionalAmount || 0,
          currency: item.DealtCurrency || item.SettlementCurrency || 'USD',
          tradeDate: item.TradeDate,
          settlementDate: item.SettlementDate || '',
          counterparty: item.Counterparty,
          tradingVenue: item.ExecutionVenue || '',
          traderName: item.TraderID || '',
          confirmationStatus: this.mapTradeStatus(item.TradeStatus),
          countryOfTrade: item.BookingLocation || '',
          opsTeamNotes: item.comments || '',
        };
        equityTrades.push(equityTrade);
      } else if (isFxTrade) {
        const fxTrade: FXTrade = {
          tradeId: item.TradeID,
          tradeDate: item.TradeDate,
          valueDate: item.ValueDate || '',
          tradeTime: item.TradeTime || '',
          traderId: item.TraderID || '',
          counterparty: item.Counterparty,
          currencyPair: item.CurrencyPair || '',
          buySell: (item.BuySell as 'Buy' | 'Sell') || 'Buy',
          dealtCurrency: item.DealtCurrency || '',
          baseCurrency: item.BaseCurrency || '',
          termCurrency: item.TermCurrency || '',
          tradeStatus: this.mapFxTradeStatus(item.TradeStatus),
          productType: this.mapProductType(item.ProductType),
          maturityDate: item.MaturityDate,
          confirmationTimestamp: item.TradeTime || '',
          settlementDate: item.SettlementDate || '',
          amendmentFlag: (item.AmendmentFlag as 'Yes' | 'No') || 'No',
          confirmationMethod: this.mapConfirmationMethod(item.SettlementMethod),
          confirmationStatus: this.mapConfirmationStatus(item.TradeStatus),
        };
        fxTrades.push(fxTrade);
      } else {
        // Default to FX trade if we can't determine the type
        const fxTrade: FXTrade = {
          tradeId: item.TradeID,
          tradeDate: item.TradeDate,
          valueDate: item.ValueDate || '',
          tradeTime: item.TradeTime || '',
          traderId: item.TraderID || '',
          counterparty: item.Counterparty,
          currencyPair: item.CurrencyPair || '',
          buySell: (item.BuySell as 'Buy' | 'Sell') || 'Buy',
          dealtCurrency: item.DealtCurrency || '',
          baseCurrency: item.BaseCurrency || '',
          termCurrency: item.TermCurrency || '',
          tradeStatus: this.mapFxTradeStatus(item.TradeStatus),
          productType: this.mapProductType(item.ProductType),
          maturityDate: item.MaturityDate,
          confirmationTimestamp: item.TradeTime || '',
          settlementDate: item.SettlementDate || '',
          amendmentFlag: (item.AmendmentFlag as 'Yes' | 'No') || 'No',
          confirmationMethod: this.mapConfirmationMethod(item.SettlementMethod),
          confirmationStatus: this.mapConfirmationStatus(item.TradeStatus),
        };
        fxTrades.push(fxTrade);
      }
    });

    return { equityTrades, fxTrades };
  }

  /**
   * Map trade status to confirmation status
   */
  private static mapTradeStatus(status: string): 'Confirmed' | 'Pending' | 'Failed' | 'Settled' {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('settled') || statusLower.includes('completed')) return 'Settled';
    if (statusLower.includes('confirmed') || statusLower.includes('booked')) return 'Confirmed';
    if (statusLower.includes('failed') || statusLower.includes('rejected')) return 'Failed';
    return 'Pending';
  }

  /**
   * Map trade status to FX trade status
   */
  private static mapFxTradeStatus(status: string): 'Booked' | 'Confirmed' | 'Settled' | 'Cancelled' {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('settled') || statusLower.includes('completed')) return 'Settled';
    if (statusLower.includes('confirmed')) return 'Confirmed';
    if (statusLower.includes('cancelled') || statusLower.includes('failed')) return 'Cancelled';
    return 'Booked';
  }

  /**
   * Map product type
   */
  private static mapProductType(productType?: string): 'Spot' | 'Forward' | 'Swap' {
    if (!productType) return 'Spot';
    const typeLower = productType.toLowerCase();
    if (typeLower.includes('forward')) return 'Forward';
    if (typeLower.includes('swap')) return 'Swap';
    return 'Spot';
  }

  /**
   * Map confirmation method
   */
  private static mapConfirmationMethod(method?: string): 'SWIFT' | 'Email' | 'Manual' | 'Electronic' {
    if (!method) return 'Electronic';
    const methodLower = method.toLowerCase();
    if (methodLower.includes('swift')) return 'SWIFT';
    if (methodLower.includes('email')) return 'Email';
    if (methodLower.includes('manual')) return 'Manual';
    return 'Electronic';
  }

  /**
   * Map confirmation status
   */
  private static mapConfirmationStatus(status: string): 'Confirmed' | 'Pending' | 'Disputed' {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('confirmed') || statusLower.includes('settled')) return 'Confirmed';
    if (statusLower.includes('disputed') || statusLower.includes('exception')) return 'Disputed';
    return 'Pending';
  }
} 