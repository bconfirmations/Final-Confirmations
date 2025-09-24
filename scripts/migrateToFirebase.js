// Sample migration script to populate Firebase with trade data
// Run this script after setting up Firebase configuration

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample unified trade data
const sampleUnifiedData = [
  {
    tradeId: "EQ001",
    tradeType: "equity",
    tradeDate: "2024-01-15",
    counterparty: "Goldman Sachs",
    status: "Confirmed",
    tradeValue: 50000,
    currency: "USD",
    quantity: 1000,
    price: 50.00,
    orderId: "ORD001",
    clientId: "CLIENT001",
    tradingVenue: "NYSE",
    traderName: "John Smith",
    confirmationStatus: "Confirmed",
    countryOfTrade: "US",
    opsTeamNotes: "Standard trade",
    settlementDate: "2024-01-17"
  },
  {
    tradeId: "FX001",
    tradeType: "fx",
    tradeDate: "2024-01-15",
    counterparty: "JP Morgan",
    status: "Settled",
    tradeValue: 75000,
    currency: "EUR",
    valueDate: "2024-01-17",
    tradeTime: "14:30:00",
    traderId: "TRADER001",
    currencyPair: "EUR/USD",
    buySell: "Buy",
    dealtCurrency: "EUR",
    baseCurrency: "EUR",
    termCurrency: "USD",
    tradeStatus: "Settled",
    productType: "Spot",
    confirmationTimestamp: "2024-01-15T14:30:00Z",
    settlementDate: "2024-01-17",
    amendmentFlag: "No",
    confirmationMethod: "Electronic",
    confirmationStatus: "Confirmed"
  },
  {
    tradeId: "EQ002",
    tradeType: "equity",
    tradeDate: "2024-01-16",
    counterparty: "Morgan Stanley",
    status: "Pending",
    tradeValue: 75000,
    currency: "USD",
    quantity: 1500,
    price: 50.00,
    orderId: "ORD002",
    clientId: "CLIENT002",
    tradingVenue: "NASDAQ",
    traderName: "Jane Doe",
    confirmationStatus: "Pending",
    countryOfTrade: "US",
    opsTeamNotes: "Large order",
    settlementDate: "2024-01-18"
  },
  {
    tradeId: "FX002",
    tradeType: "fx",
    tradeDate: "2024-01-16",
    counterparty: "Citibank",
    status: "Booked",
    tradeValue: 100000,
    currency: "GBP",
    valueDate: "2024-01-18",
    tradeTime: "09:15:00",
    traderId: "TRADER002",
    currencyPair: "GBP/USD",
    buySell: "Sell",
    dealtCurrency: "GBP",
    baseCurrency: "GBP",
    termCurrency: "USD",
    tradeStatus: "Booked",
    productType: "Forward",
    maturityDate: "2024-02-16",
    confirmationTimestamp: "2024-01-16T09:15:00Z",
    settlementDate: "2024-02-16",
    amendmentFlag: "No",
    confirmationMethod: "SWIFT",
    confirmationStatus: "Pending"
  },
  {
    tradeId: "EQ003",
    tradeType: "equity",
    tradeDate: "2024-01-17",
    counterparty: "TradeBank",
    status: "Failed",
    tradeValue: 25000,
    currency: "USD",
    quantity: 500,
    price: 50.00,
    orderId: "ORD003",
    clientId: "CLIENT003",
    tradingVenue: "LSE",
    traderName: "Mike Johnson",
    confirmationStatus: "Failed",
    countryOfTrade: "UK",
    opsTeamNotes: "Insufficient funds",
    settlementDate: "2024-01-19"
  }
];

async function migrateData() {
  try {
    console.log('Starting data migration to Firebase...');
    
    const collectionRef = collection(db, 'unified_data');
    
    for (const data of sampleUnifiedData) {
      await addDoc(collectionRef, data);
      console.log(`Added trade: ${data.tradeId}`);
    }
    
    console.log('Migration completed successfully!');
    console.log(`Added ${sampleUnifiedData.length} trade records to Firebase.`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateData(); 