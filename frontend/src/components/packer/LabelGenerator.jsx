import React, { useState } from 'react';
import { QrCode, Download, Printer, Copy, Tag, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { useToast } from '../../hooks/use-toast';

const LabelGenerator = ({ generatedLabels, onGenerateLabel }) => {
  const [manualOrderId, setManualOrderId] = useState('');
  const { toast } = useToast();

  const handleGenerateManualLabel = () => {
    if (!manualOrderId.trim()) {
      toast({
        title: "Error",
        description: "Please enter an order ID",
        variant: "destructive"
      });
      return;
    }

    const labelData = onGenerateLabel(manualOrderId.trim());
    toast({
      title: "Label Generated",
      description: `Label ${labelData.labelId} created successfully`,
    });
    setManualOrderId('');
  };

  const handleCopyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied",
        description: `${type} copied to clipboard`,
      });
    });
  };

  const handlePrintLabel = (labelId) => {
    // Mock print functionality
    toast({
      title: "Printing",
      description: `Sending label ${labelId} to printer...`,
    });
  };

  const handleDownloadLabel = (labelId) => {
    // Mock download functionality
    toast({
      title: "Download Started",
      description: `Downloading label ${labelId}...`,
    });
  };

  const formatLabelId = (labelId) => {
    return labelId.replace('LBL_', '').replace(/_/g, '-');
  };

  return (
    <div className="space-y-6">
      {/* Manual Label Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Tag className="w-5 h-5" />
            <span>Generate New Label</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              value={manualOrderId}
              onChange={(e) => setManualOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g., ORD_001)"
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerateManualLabel()}
            />
            <Button
              onClick={handleGenerateManualLabel}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Generate Label
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Labels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <QrCode className="w-5 h-5" />
              <span>Generated Labels</span>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              {Object.keys(generatedLabels).length} labels
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(generatedLabels).length === 0 ? (
            <div className="text-center py-8">
              <QrCode className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Labels Generated</h3>
              <p className="text-gray-600">
                Labels will appear here as orders are completed and ready for delivery.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(generatedLabels).map(([orderId, labelData]) => (
                <div key={orderId} className="border rounded-lg p-6 bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Order #{orderId.slice(-6)}</h3>
                      <p className="text-sm text-gray-600">
                        Generated: {labelData.generatedAt.toLocaleString()}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <Truck className="w-3 h-3 mr-1" />
                      Ready for Delivery
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Label ID */}
                    <div>
                      <label className="text-sm font-medium text-gray-900 mb-2 block">
                        Label ID
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 p-3 bg-gray-50 rounded border font-mono text-sm">
                          {formatLabelId(labelData.labelId)}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyToClipboard(labelData.labelId, 'Label ID')}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div>
                      <label className="text-sm font-medium text-gray-900 mb-2 block">
                        QR Code
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 p-3 bg-gray-50 rounded border font-mono text-sm">
                          {labelData.qrCode}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyToClipboard(labelData.qrCode, 'QR Code')}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Visual */}
                  <div className="mt-4 flex justify-center">
                    <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">QR Code</p>
                        <p className="text-xs font-mono text-gray-600">
                          {labelData.qrCode.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center space-x-4 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePrintLabel(labelData.labelId)}
                    >
                      <Printer className="w-3 h-3 mr-1" />
                      Print
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadLabel(labelData.labelId)}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>

                  {/* Delivery Instructions */}
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      📋 <strong>Delivery Instructions:</strong> Attach this label to the package and hand over to delivery partner. 
                      QR code will be scanned upon pickup and delivery confirmation.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LabelGenerator;