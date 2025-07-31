# Firebase Setup Guide

This application now uses Firebase Firestore to fetch trade data from the `unified_data` collection. Follow these steps to set up Firebase:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Follow the setup wizard

## 2. Enable Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location for your database

## 3. Create the unified_data Collection

1. In Firestore, click "Start collection"
2. Collection ID: `unified_data`
3. Add documents with the following structure:

### Document Structure

Each document should have these fields (matching your actual data structure):

```json
{
  "TradeID": "string",
  "KYCCheck": "string (optional)",
  "TradeStatus": "string",
  "DealtCurrency": "string (optional)",
  "ExecutionVenue": "string (optional)",
  "Portfolio": "string (optional)",
  "CustodyFee": "number (optional)",
  "CurrencyPair": "string (optional)",
  "SettlementCurrency": "string (optional)",
  "SettlementDate": "string (optional)",
  "CommissionAmount": "number (optional)",
  "CustodyCurrency": "string (optional)",
  "BrokerageCurrency": "string (optional)",
  "TraderID": "string (optional)",
  "Broker": "string (optional)",
  "TradeTime": "string (optional)",
  "TradeSourceSystem": "string (optional)",
  "RiskSystemID": "string (optional)",
  "SettlementInstructions": "string (optional)",
  "ExpenseApprovalStatus": "string (optional)",
  "FXRate": "number (optional)",
  "TradeDate": "string (YYYY-MM-DD)",
  "TradeComplianceStatus": "string (optional)",
  "BookingLocation": "string (optional)",
  "RegulatoryReportingStatus": "string (optional)",
  "Counterparty": "string",
  "AuditTrailRef": "string (optional)",
  "BrokerageFee": "number (optional)",
  "NettingEligibility": "string (optional)",
  "TradeVersion": "string (optional)",
  "TermCurrency": "string (optional)",
  "MaturityDate": "string (optional)",
  "BuySell": "string (optional)",
  "SettlementMethod": "string (optional)",
  "BaseCurrency": "string (optional)",
  "ValueDate": "string (optional)",
  "NotionalAmount": "number (optional)",
  "Reference_Data_Validated": "string (optional)",
  "ProductType": "string (optional)",
  "AmendmentFlag": "string (optional)",
  "ExceptionFlag": "string (optional)",
  "CancellationFlag": "string (optional)",
  "CommissionCurrency": "string (optional)",
  "SanctionsScreening": "string (optional)",
  "Exception Description": "string (optional)",
  "Exception Reason": "string (optional)",
  "comments": "string (optional)",
  "Custodian_Name": "string (optional)"
}
```

## 4. Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select "Web"
4. Register your app and copy the configuration

## 5. Update Firebase Configuration

1. Open `src/config/firebase.ts`
2. Replace the placeholder values with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-messaging-sender-id",
  appId: "your-actual-app-id"
};
```

## 6. Security Rules (Optional)

For production, you should set up proper security rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /unified_data/{document} {
      allow read: if true; // Allow read access to unified_data collection
      allow write: if false; // Restrict write access
    }
  }
}
```

## 7. Test the Application

1. Start the development server: `npm run dev`
2. Navigate to the Trade Confirmations tab
3. You should see the trade data loaded from Firebase

## Troubleshooting

- **"Failed to fetch trade data from Firebase"**: Check your Firebase configuration and ensure the `unified_data` collection exists
- **"Permission denied"**: Check your Firestore security rules
- **No data showing**: Ensure your documents have the correct field names and structure

## Data Migration

If you have existing CSV data, you can create a script to migrate it to Firebase. The application will automatically convert the unified data format to the existing trade types (EquityTrade and FXTrade). 