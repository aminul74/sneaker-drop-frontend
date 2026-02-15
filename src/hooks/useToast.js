import { useState, useCallback } from "react";

/**
 * Hook: useToast
 * Manages temporary toast notification messages
 */
export const useToast = () => {
  const [message, setMessage] = useState("");

  const showMessage = useCallback((msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  }, []);

  return { message, showMessage };
};
