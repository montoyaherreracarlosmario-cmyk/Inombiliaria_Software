'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const ToastCtx = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [msg, setMsg] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const toast = useCallback((m: string) => {
    setMsg(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(''), 2200);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div id="toast" role="status" aria-live="polite" style={{ display: msg ? 'block' : 'none' }}>
        {msg}
      </div>
    </ToastCtx.Provider>
  );
}
