"use client";

import { useEffect, useRef } from "react";

export default function PaystackHandler({
  config,
  onSuccess,
  onClose,
  trigger,
}: {
  config: any;
  onSuccess: (res: any) => void;
  onClose: () => void;
  trigger: boolean;
}) {
  const handlerOpenedRef = useRef(false);

  useEffect(() => {
    if (!trigger || typeof window === "undefined") return;
    if (handlerOpenedRef.current) return; // prevent double-open

    // Wait for Paystack script to fully load, then open
    const tryOpen = (retries = 0) => {
      const win = window as typeof window & { PaystackPop?: any };
      if (win.PaystackPop) {
        handlerOpenedRef.current = true;
        const handler = win.PaystackPop.setup({
          key: config.publicKey,
          email: config.email,
          amount: config.amount,
          ref: config.reference,
          currency: config.currency || "NGN",
          metadata: config.metadata,
          callback: (res: any) => {
            handlerOpenedRef.current = false;
            onSuccess(res);
          },
          onClose: () => {
            handlerOpenedRef.current = false;
            onClose();
          },
        });
        handler.openIframe();
      } else if (retries < 20) {
        // Retry up to 2 seconds while script loads
        setTimeout(() => tryOpen(retries + 1), 100);
      } else {
        console.error("Paystack script not loaded.");
        onClose();
      }
    };

    tryOpen();
  }, [trigger]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset the guard when trigger goes false
  useEffect(() => {
    if (!trigger) {
      handlerOpenedRef.current = false;
    }
  }, [trigger]);

  return null;
}
