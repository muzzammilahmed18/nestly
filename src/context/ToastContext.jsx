import { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}