import { useEffect, useCallback, useRef } from 'react';

export interface LogEntry {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  data?: unknown;
  timestamp: Date;
  source?: string;
}

let logStore: LogEntry[] = [];
let listeners: ((logs: LogEntry[]) => void)[] = [];
let logIdCounter = 0;

// Override console methods
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;
const originalInfo = console.info;

const addLog = (type: LogEntry['type'], args: unknown[]) => {
  const message = args
    .map(arg => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    })
    .join(' ');

  const entry: LogEntry = {
    id: `log-${logIdCounter++}`,
    type,
    message,
    timestamp: new Date(),
  };

  logStore = [...logStore.slice(-99), entry]; // Keep last 100 logs
  listeners.forEach(listener => listener(logStore));
};

// Override console
console.log = (...args) => {
  originalLog(...args);
  addLog('log', args);
};

console.error = (...args) => {
  originalError(...args);
  addLog('error', args);
};

console.warn = (...args) => {
  originalWarn(...args);
  addLog('warn', args);
};

console.info = (...args) => {
  originalInfo(...args);
  addLog('info', args);
};

export const useConsoleLogger = () => {
  const logsRef = useRef<LogEntry[]>(logStore);

  const subscribe = useCallback((callback: (logs: LogEntry[]) => void) => {
    listeners.push(callback);
    return () => {
      listeners = listeners.filter(l => l !== callback);
    };
  }, []);

  const getLogs = useCallback(() => logStore, []);

  const clearLogs = useCallback(() => {
    logStore = [];
    listeners.forEach(listener => listener(logStore));
  }, []);

  const exportLogs = useCallback(() => {
    const text = logStore
      .map(log => `[${log.type.toUpperCase()}] ${log.timestamp.toLocaleTimeString()}: ${log.message}`)
      .join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  return {
    subscribe,
    getLogs,
    clearLogs,
    exportLogs,
  };
};
