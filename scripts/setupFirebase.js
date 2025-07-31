import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔥 Firebase Setup Script for Barclays Confirmations');
console.log('==================================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('📝 Creating .env file with Firebase configuration template...');
  
  const envTemplate = `# Firebase Configuration
# Replace these values with your actual Firebase project configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ .env file created successfully!');
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 Next Steps:');
console.log('1. Go to https://console.firebase.google.com/');
console.log('2. Create a new project or select an existing one');
console.log('3. Enable Firestore Database');
console.log('4. Create a collection named "unified_data"');
console.log('5. Get your Firebase configuration from Project Settings > General > Your apps');
console.log('6. Update the .env file with your actual Firebase configuration values');
console.log('7. Add some sample documents to the "unified_data" collection');
console.log('8. Run "npm run dev" to start the application');

console.log('\n📄 Sample document structure for the "unified_data" collection:');
console.log(JSON.stringify({
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
}, null, 2));

console.log('\n🔧 To migrate existing CSV data to Firebase, run:');
console.log('node scripts/migrateToFirebase.js');

console.log('\n✨ Setup complete! Follow the steps above to configure Firebase.'); 