"use client";

import { useEffect } from "react";

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
  useEffect(() => {
    if (!trigger || typeof window === "undefined") return;

    const win = window as typeof window & { PaystackPop?: any };
    if (!win.PaystackPop) {
      onClose();
      return;
    }

    const handler = win.PaystackPop.setup({
      key: config.publicKey,
      email: config.email,
      amount: config.amount,
      ref: config.reference,
      currency: config.currency || "NGN",
      metadata: config.metadata,
      callback: (res: any) => onSuccess(res),
      onClose: () => onClose(),
    });

    handler.openIframe();
  }, [config, onSuccess, onClose, trigger]);

  return null;
}
