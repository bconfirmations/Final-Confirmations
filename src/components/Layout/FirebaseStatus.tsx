import React from 'react';
import { AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { isFirebaseConfigured } from '../../config/firebase';

interface FirebaseStatusProps {
  showDetails?: boolean;
}

const FirebaseStatus: React.FC<FirebaseStatusProps> = ({ showDetails = false }) => {
  const configured = isFirebaseConfigured();

  if (!showDetails) {
    return (
      <div className="flex items-center space-x-2">
        {configured ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <AlertCircle className="w-4 h-4 text-orange-500" />
        )}
        <span className="text-sm">
          Firebase: {configured ? 'Connected' : 'Not Configured'}
        </span>
      </div>
    );
  }

  if (configured) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h3 className="text-sm font-medium text-green-800">Firebase Connected</h3>
        </div>
        <p className="mt-1 text-sm text-green-700">
          Your application is successfully connected to Firebase and ready to fetch trade data.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <div className="flex items-center space-x-2">
        <AlertCircle className="w-5 h-5 text-orange-600" />
        <h3 className="text-sm font-medium text-orange-800">Firebase Not Configured</h3>
      </div>
      <p className="mt-1 text-sm text-orange-700 mb-3">
        To use this application, you need to configure Firebase. Follow these steps:
      </p>
      <ol className="text-sm text-orange-700 space-y-1 ml-4">
        <li>1. Run <code className="bg-orange-100 px-1 rounded">npm run setup</code></li>
        <li>2. Create a Firebase project at <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">
          Firebase Console <ExternalLink className="w-3 h-3 ml-1" />
        </a></li>
        <li>3. Enable Firestore Database</li>
        <li>4. Create a collection named <code className="bg-orange-100 px-1 rounded">unified_data</code></li>
        <li>5. Update the <code className="bg-orange-100 px-1 rounded">.env</code> file with your Firebase configuration</li>
        <li>6. Add sample data to the collection</li>
      </ol>
      <div className="mt-3">
        <a 
          href="https://console.firebase.google.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-2 border border-orange-300 shadow-sm text-sm leading-4 font-medium rounded-md text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Go to Firebase Console
        </a>
      </div>
    </div>
  );
};

export default FirebaseStatus; 