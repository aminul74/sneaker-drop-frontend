import { useState, useCallback } from "react";

export const useToast = () => {
  const [message, setMessage] = useState("");

  const showMessage = useCallback((msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  }, []);

  return { message, showMessage };
};
