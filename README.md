# Barclays Trade Confirmations

A React-based application for managing and viewing trade confirmations with Firebase integration.

## Features

- **Trade Confirmations Management**: View and manage equity and FX trades
- **Firebase Integration**: Real-time data from Firebase Firestore `unified_data` collection
- **Advanced Filtering**: Filter trades by status, type, counterparty, and date
- **Workflow Management**: Track trade lifecycle and workflow stages
- **Data Upload**: Upload CSV files for trade data management
- **Responsive Design**: Modern UI built with Tailwind CSS

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Firebase** (see [Firebase Setup Guide](./FIREBASE_SETUP.md)):
   - Create a Firebase project
   - Enable Firestore Database
   - Create the `unified_data` collection
   - Update Firebase configuration in `src/config/firebase.ts`

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to the application

## Firebase Integration

The application now fetches trade data from a Firebase Firestore collection called `unified_data`. This provides:

- Real-time data updates
- Scalable cloud storage
- Better performance for large datasets
- Centralized data management

### Data Structure

The `unified_data` collection contains documents with a unified structure that supports both equity and FX trades. Each document includes:

- Common fields: `tradeId`, `tradeType`, `tradeDate`, `counterparty`, `status`
- Equity-specific fields: `quantity`, `price`, `orderId`, `clientId`, etc.
- FX-specific fields: `currencyPair`, `buySell`, `productType`, etc.

## Development

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Build Tool**: Vite

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
