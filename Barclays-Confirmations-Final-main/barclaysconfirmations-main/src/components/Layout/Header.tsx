import React from 'react';
import { Building2 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-barclays-blue text-white shadow-lg" style={{ backgroundColor: '#00a3ef' }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
          <Building2 className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Barclays</h1>
            <p className="text-white text-sm opacity-90">Confirmation Department</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;