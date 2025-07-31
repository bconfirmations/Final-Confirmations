import React, { useMemo } from 'react';
import { X, AlertCircle, Clock } from 'lucide-react';
import { EquityTrade, FXTrade } from '../../types/trade';
import { generateBreakReason } from '../../utils/breakReasonGenerator';

interface BreakDetailsModalProps {
  trade: EquityTrade | FXTrade;
  onClose: () => void;
}

const BreakDetailsModal: React.FC<BreakDetailsModalProps> = ({ trade, onClose }) => {

  // Generate break reason for trades with breaks
  const breakReason = useMemo(() => {
    const isEquityTrade = 'quantity' in trade;
    const status = isEquityTrade 
      ? (trade as EquityTrade).confirmationStatus 
      : (trade as FXTrade).tradeStatus;
    
    const hasBreak = status === 'Failed' || status === 'Cancelled';
    
    if (hasBreak) {
      return generateBreakReason(trade);
    }
    return null;
  }, [trade]);

  const isEquityTrade = 'quantity' in trade;
  const status = isEquityTrade 
    ? (trade as EquityTrade).confirmationStatus 
    : (trade as FXTrade).tradeStatus;

  const hasBreak = status === 'Failed' || status === 'Cancelled';

  const getBreakDetails = () => {
    switch (status.toLowerCase()) {
      case 'failed':
        return {
          type: 'Confirmation Failure',
          priority: 'High',
          assignedTo: 'Trading Desk',
          sla: '1 day',
          description: 'Trade confirmation failed due to counterparty system unavailability. Requires manual intervention and re-confirmation.',
          impact: 'Settlement delay possible',
          nextSteps: [
            'Contact counterparty via phone',
            'Obtain manual confirmation',
            'Update trade status in system',
            'Monitor for system restoration'
          ]
        };
      case 'cancelled':
        return {
          type: 'Trade Cancellation',
          priority: 'Medium',
          assignedTo: 'Middle Office',
          sla: '2 days',
          description: 'Trade cancelled due to regulatory or compliance issues. Requires proper documentation and client notification.',
          impact: 'Trade void - no settlement',
          nextSteps: [
            'Document cancellation reason',
            'Notify all relevant parties',
            'Update regulatory reporting',
            'Process any applicable fees'
          ]
        };
      default:
        return null;
    }
  };

  const breakDetails = getBreakDetails();

  // Generate the specific break reason format as shown in the screenshot
  const getBreakReasonDisplay = () => {
    if (!breakReason) return null;
    
    // Format: "Trade Date: Barclays 1/24/2024 | Client 1/24/2024X"
    const barclaysValue = breakReason.barclaysValue || '1/24/2024';
    const clientValue = breakReason.clientValue || '1/24/2024X';
    
    return `Trade Date: Barclays ${barclaysValue} | Client ${clientValue}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <AlertCircle className={`w-6 h-6 ${hasBreak ? 'text-orange-600' : 'text-green-600'}`} />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Break Details</h2>
              <p className="text-gray-500">Trade ID: {trade.tradeId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {hasBreak && breakDetails ? (
            <div className="space-y-6">
              {/* Break Summary - Updated to match screenshot format exactly */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-orange-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-orange-800 mb-4">Break Identified</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-orange-700">Break Type</p>
                          <p className="text-orange-600">{breakDetails.type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-700">Priority</p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {breakDetails.priority}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-700">Assigned To</p>
                          <p className="text-orange-600">{breakDetails.assignedTo}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-700">SLA</p>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <span className="text-orange-600">{breakDetails.sla}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-700">Break Reason</p>
                          <p className="text-orange-600 font-mono">{getBreakReasonDisplay()}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-orange-700">Impact</p>
                          <p className="text-orange-600">{breakDetails.impact}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-700">Status</p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            In Progress
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-700">Created</p>
                          <p className="text-orange-600">2025-01-18 09:30:00</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-700">Last Updated</p>
                          <p className="text-orange-600">2025-01-18 10:15:00</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700">{breakDetails.description}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Breaks Identified</h3>
              <p className="text-gray-600">This trade has been processed successfully without any issues.</p>
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-800 font-medium">Trade Status: {status}</span>
                </div>
                <p className="text-green-700 text-sm mt-2">
                  All confirmations received and processed according to standard procedures.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 p-4 bg-gray-50 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
          {hasBreak && (
            <button className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors">
              Update Status
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreakDetailsModal;