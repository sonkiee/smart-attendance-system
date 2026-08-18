import {
  authenticateBiometric,
  verifyAndSetupBiometrics,
} from "@/service/biometric";
import { useState } from "react";

export const useBiometric = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticate = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      return await authenticateBiometric();
    } catch (error) {
      console.error("biometric error:", error);
      setError("BIOMETRIC_ERROR");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Used for Setup in Settings Screen
  const setupBiometrics = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      return await verifyAndSetupBiometrics();
    } catch (err) {
      setError("SETUP_ERROR");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    authenticate,
    setupBiometrics,
    isProcessing,
    error,
  };
};
