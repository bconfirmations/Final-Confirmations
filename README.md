# Barclays Trade Confirmations

A React-based application for managing and viewing trade confirmations with Firebase integration.

## Features

* **Trade Confirmations Management**: View and manage equity and FX trades
* **Firebase Integration**: Real-time data from Firebase Firestore `unified_data` collection
* **Advanced Filtering**: Filter trades by status, type, counterparty, and date
* **Workflow Management**: Track trade lifecycle and workflow stages
* **Data Upload**: Upload CSV files for trade data management
* **Responsive Design**: Modern UI built with Tailwind CSS

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Firebase (Required)
The application requires Firebase to be configured. Run the setup script:

```bash
npm run setup
```

This will create a `.env` file with Firebase configuration template.

### 3. Configure Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firestore Database
4. Create a collection named `unified_data`
5. Get your Firebase configuration from Project Settings > General > Your apps
6. Update the `.env` file with your actual Firebase configuration values

### 4. Add Sample Data
Add documents to the `unified_data` collection with this structure:

```json
{
  "TradeID": "TRADE001",
  "TradeStatus": "Confirmed",
  "TradeDate": "2024-01-15",
  "Counterparty": "Goldman Sachs",
  "CurrencyPair": "EUR/USD",
  "BuySell": "Buy",
  "NotionalAmount": 1000000,
  "TraderID": "TRADER001",
  "ProductType": "Spot",
  "SettlementDate": "2024-01-17"
}
```

### 5. Start Development Server
```bash
npm run dev
```

### 6. Open Application
Navigate to the application in your browser

## Firebase Integration

The application fetches trade data from a Firebase Firestore collection called `unified_data`. This provides:

* Real-time data updates
* Scalable cloud storage
* Better performance for large datasets
* Centralized data management

### Data Structure

The `unified_data` collection contains documents with a unified structure that supports both equity and FX trades. Each document includes:

* Common fields: `TradeID`, `TradeStatus`, `TradeDate`, `Counterparty`
* Equity-specific fields: `ExecutionVenue`, `Portfolio`, `NotionalAmount`, etc.
* FX-specific fields: `CurrencyPair`, `BuySell`, `ProductType`, etc.

### Environment Variables

Create a `.env` file in the root directory with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
```

## Development

* **Framework**: React 18 with TypeScript
* **Styling**: Tailwind CSS
* **Database**: Firebase Firestore
* **Build Tool**: Vite

## Available Scripts

* `npm run dev` - Start development server
* `npm run build` - Build for production
* `npm run preview` - Preview production build
* `npm run lint` - Run ESLint
* `npm run setup` - Set up Firebase configuration

## Project Structure

```
src/
├── components/
│   ├── TradeConfirmations/    # Trade confirmation components
│   ├── WorkflowManagement/    # Workflow management components
│   ├── DataManagement/        # Data upload components
│   └── Layout/               # Header and navigation
├── hooks/                    # Custom React hooks
├── services/                 # Firebase and other services
├── types/                    # TypeScript type definitions
├── utils/                    # Utility functions
└── config/                   # Configuration files
```

## Troubleshooting

### Firebase Issues

1. **"Firebase not configured" warning**
   - Ensure your `.env` file exists and contains valid Firebase configuration
   - Check that all environment variables are set correctly

2. **"Failed to fetch trade data from Firebase"**
   - Verify your Firebase project is active
   - Check that the `unified_data` collection exists
   - Ensure Firestore security rules allow read access

3. **No data showing**
   - Verify documents exist in the `unified_data` collection
   - Check that document fields match the expected structure
   - Review browser console for any errors

4. **Permission denied errors**
   - Update Firestore security rules to allow read access:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /unified_data/{document} {
         allow read: if true;
         allow write: if false;
       }
     }
   }
   ```

### General Issues

1. **Application not loading**
   - Check that all dependencies are installed: `npm install`
   - Verify Node.js version is compatible
   - Check browser console for errors

2. **Build errors**
   - Run `npm run lint` to check for code issues
   - Ensure TypeScript types are correct
   - Check that all imports are valid

## Data Migration

If you have existing CSV data, you can migrate it to Firebase using the provided script:

```bash
node scripts/migrateToFirebase.js
```

This script will convert your CSV data to the unified format and upload it to Firebase.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues related to:
- Firebase setup: Check the [FIREBASE_SETUP.md](FIREBASE_SETUP.md) file
- Application functionality: Review the troubleshooting section above
- Data migration: Use the provided migration script
