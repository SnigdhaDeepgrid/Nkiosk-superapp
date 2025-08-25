import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';
import { Key, AlertCircle, CheckCircle } from 'lucide-react';

const OtpDialog = ({ isOpen, onClose, onVerify, customerName, orderId }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setError('');
      setIsVerifying(false);
      // Focus first input
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleInputChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      handleVerifyOtp();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const success = onVerify(otpCode);
      
      if (success) {
        // Show success briefly before closing
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setError('Invalid OTP. Please check and try again.');
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numbers = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (numbers.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = numbers[i] || '';
      }
      setOtp(newOtp);
      setError('');
      
      // Focus the next empty input or the last one
      const nextIndex = Math.min(numbers.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const isComplete = otp.every(digit => digit !== '');
  const isSuccess = isVerifying && isComplete;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-blue-500" />
            <span>Verify Delivery OTP</span>
          </DialogTitle>
          <DialogDescription>
            Enter the 6-digit OTP provided by <strong>{customerName}</strong> to complete the delivery.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order ID */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Order ID: <span className="font-mono font-medium">#{orderId?.slice(-6)}</span>
            </p>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`
                  w-12 h-12 text-center text-lg font-bold border-2 
                  ${error ? 'border-red-300' : 'border-gray-300'}
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                `}
                disabled={isVerifying}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success State */}
          {isSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                OTP verified successfully! Delivery completed.
              </AlertDescription>
            </Alert>
          )}

          {/* Help Text */}
          <div className="text-center text-sm text-gray-500">
            <p>Ask the customer to provide the OTP from their order confirmation</p>
            <p className="text-xs mt-1">Demo OTP: <span className="font-mono">123456</span></p>
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isVerifying}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleVerifyOtp}
            disabled={!isComplete || isVerifying}
            className="bg-green-600 hover:bg-green-700"
          >
            {isVerifying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Verifying...
              </>
            ) : (
              'Verify & Complete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OtpDialog;