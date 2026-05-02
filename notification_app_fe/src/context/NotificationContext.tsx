import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Notification, FetchParams } from '../types';
import { getNotifications, getTopNNotifications } from '../services/notificationService';
import { Log } from '../logger';

interface NotificationContextType {
  notifications: Notification[];
  priorityNotifications: Notification[];
  loading: boolean;
  error: string | null;
  readIds: Set<string>;
  view: 'all' | 'priority';
  topN: number;
  fetchNotifications: (params?: FetchParams) => Promise<void>;
  markAsRead: (id: string) => void;
  setView: (v: 'all' | 'priority') => void;
  setTopN: (n: number) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [priorityNotifications, setPriorityNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [view, setViewState] = useState<'all' | 'priority'>('all');
  const [topN, setTopNState] = useState(10);

  const fetchNotifications = useCallback(
    async (params: FetchParams = {}) => {
      setLoading(true);
      setError(null);
      await Log('frontend', 'info', 'state', 'fetching notifications, updating state');
      try {
        const data = await getNotifications(params);
        setNotifications(data);
        setPriorityNotifications(getTopNNotifications(data, topN));
        await Log('frontend', 'info', 'state', `state updated with ${data.length} notifications`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'failed to load notifications';
        setError(msg);
        await Log('frontend', 'error', 'state', `state update failed: ${msg}`);
      } finally {
        setLoading(false);
      }
    },
    [topN]
  );

  const markAsRead = useCallback((id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      Log('frontend', 'debug', 'state', `notification ${id} marked as read`);
      return next;
    });
  }, []);

  const setView = useCallback((v: 'all' | 'priority') => {
    setViewState(v);
    Log('frontend', 'info', 'state', `view switched to ${v}`);
  }, []);

  const setTopN = useCallback((n: number) => {
    setTopNState(n);
    Log('frontend', 'debug', 'state', `top-n updated to ${n}`);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        priorityNotifications,
        loading,
        error,
        readIds,
        view,
        topN,
        fetchNotifications,
        markAsRead,
        setView,
        setTopN,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be inside NotificationProvider');
  return ctx;
};
