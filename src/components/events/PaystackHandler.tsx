"use client";

import { useEffect } from "react";
import { usePaystackPayment } from "react-paystack";

export default function PaystackHandler({ 
  config, 
  onSuccess, 
  onClose,
  trigger
}: { 
  config: any; 
  onSuccess: (res: any) => void; 
  onClose: () => void;
  trigger: boolean;
}) {
  const initializePayment = usePaystackPayment(config);

  useEffect(() => {
    if (trigger) {
      initializePayment({
        onSuccess,
        onClose
      });
    }
  }, [trigger]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
