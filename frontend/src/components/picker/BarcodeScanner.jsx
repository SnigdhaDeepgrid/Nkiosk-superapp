import React, { useState, useRef } from 'react';
import { 
  Scan, 
  Camera, 
  Check, 
  X, 
  RefreshCw, 
  Keyboard,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { mockBarcodeScan } from '../../services/mockPickerPackerSocket';

const BarcodeScanner = ({ currentOrder, onScanSuccess, onScanError }) => {
  const [scanMode, setScanMode] = useState('camera'); // 'camera' or 'manual'
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const videoRef = useRef(null);

  // Mock camera scanning
  const handleCameraScan = async () => {
    if (!currentOrder) {
      onScanError('No active order. Please start picking an order first.');
      return;
    }

    setIsScanning(true);
    setScanResult(null);

    try {
      // Simulate camera scanning delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful scan of first pending item
      const pendingItem = currentOrder.items.find(item => 
        item.status === 'pending' || !item.status
      );
      
      if (pendingItem) {
        const mockCode = pendingItem.barcode;
        const scanData = await mockBarcodeScan(mockCode);
        
        if (scanData.success) {
          const success = await onScanSuccess(currentOrder.id, pendingItem.id, mockCode);
          setScanResult({
            success: true,
            item: pendingItem,
            code: mockCode,
            message: `Successfully scanned ${pendingItem.name}`
          });
          
          // Add to scan history
          setScanHistory(prev => [{
            id: Date.now(),
            item: pendingItem,
            code: mockCode,
            success: true,
            timestamp: new Date()
          }, ...prev.slice(0, 4)]);
        } else {
          setScanResult({
            success: false,
            code: mockCode,
            message: 'Barcode verification failed'
          });
        }
      } else {
        setScanResult({
          success: false,
          message: 'No pending items to scan in current order'
        });
      }
    } catch (error) {
      setScanResult({
        success: false,
        message: 'Camera scan failed. Please try again.'
      });
      onScanError('Camera scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  const handleManualScan = async () => {
    if (!manualCode.trim()) {
      onScanError('Please enter a barcode');
      return;
    }

    if (!currentOrder) {
      onScanError('No active order. Please start picking an order first.');
      return;
    }

    setIsScanning(true);
    setScanResult(null);

    try {
      // Find matching item by barcode
      const matchedItem = currentOrder.items.find(item => 
        item.barcode === manualCode.trim()
      );

      if (matchedItem) {
        const scanData = await mockBarcodeScan(manualCode.trim());
        
        if (scanData.success) {
          const success = await onScanSuccess(currentOrder.id, matchedItem.id, manualCode.trim());
          setScanResult({
            success: true,
            item: matchedItem,
            code: manualCode.trim(),
            message: `Successfully scanned ${matchedItem.name}`
          });
          
          // Add to scan history
          setScanHistory(prev => [{
            id: Date.now(),
            item: matchedItem,
            code: manualCode.trim(),
            success: true,
            timestamp: new Date()
          }, ...prev.slice(0, 4)]);
          
          // Clear input
          setManualCode('');
        } else {
          setScanResult({
            success: false,
            code: manualCode.trim(),
            message: 'Barcode verification failed'
          });
        }
      } else {
        setScanResult({
          success: false,
          code: manualCode.trim(),
          message: 'Barcode does not match any item in current order'
        });
      }
    } catch (error) {
      setScanResult({
        success: false,
        message: 'Manual scan failed. Please check the barcode.'
      });
      onScanError('Manual scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  const handleQuickScan = async (item) => {
    if (!currentOrder) return;

    setIsScanning(true);
    setScanResult(null);

    try {
      const scanData = await mockBarcodeScan(item.barcode);
      
      if (scanData.success) {
        const success = await onScanSuccess(currentOrder.id, item.id, item.barcode);
        setScanResult({
          success: true,
          item: item,
          code: item.barcode,
          message: `Successfully scanned ${item.name}`
        });
        
        // Add to scan history
        setScanHistory(prev => [{
          id: Date.now(),
          item: item,
          code: item.barcode,
          success: true,
          timestamp: new Date()
        }, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      setScanResult({
        success: false,
        message: 'Quick scan failed'
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Scanner Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scan className="w-5 h-5" />
            <span>Barcode Scanner</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <Button
              onClick={() => setScanMode('camera')}
              variant={scanMode === 'camera' ? 'default' : 'outline'}
              className="flex items-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>Camera Scan</span>
            </Button>
            <Button
              onClick={() => setScanMode('manual')}
              variant={scanMode === 'manual' ? 'default' : 'outline'}
              className="flex items-center space-x-2"
            >
              <Keyboard className="w-4 h-4" />
              <span>Manual Entry</span>
            </Button>
          </div>

          {/* Camera Scanner */}
          {scanMode === 'camera' && (
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <div className="w-32 h-32 mx-auto bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
                  {isScanning ? (
                    <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  {isScanning ? 'Scanning...' : 'Camera Scanner'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {isScanning 
                    ? 'Please wait while we scan the barcode'
                    : 'Click scan to use camera for barcode scanning'
                  }
                </p>
                <Button 
                  onClick={handleCameraScan}
                  disabled={isScanning || !currentOrder}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4 mr-2" />
                      Start Camera Scan
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Manual Entry */}
          {scanMode === 'manual' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-900 mb-2 block">
                  Enter Barcode Manually
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Enter or paste barcode..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleManualScan()}
                  />
                  <Button
                    onClick={handleManualScan}
                    disabled={isScanning || !manualCode.trim() || !currentOrder}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isScanning ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Scan Result */}
          {scanResult && (
            <Alert className={scanResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              {scanResult.success ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={scanResult.success ? 'text-green-700' : 'text-red-700'}>
                {scanResult.message}
                {scanResult.code && (
                  <span className="block text-xs mt-1 font-mono">
                    Code: {scanResult.code}
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Quick Scan for Current Order */}
      {currentOrder && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-orange-500" />
              <span>Quick Scan - Current Order</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {currentOrder.items
                .filter(item => item.status === 'pending' || !item.status)
                .slice(0, 3)
                .map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-600">Code: {item.barcode}</p>
                  </div>
                  <Button
                    onClick={() => handleQuickScan(item)}
                    size="sm"
                    disabled={isScanning}
                    variant="outline"
                  >
                    <Scan className="w-3 h-3 mr-1" />
                    Scan
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recent Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scanHistory.map((scan) => (
                <div key={scan.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>{scan.item.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {scan.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Active Order Warning */}
      {!currentOrder && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No active picking order. Please start picking an order to use the barcode scanner.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default BarcodeScanner;