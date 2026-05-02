import type { Notification, RawNotification, FetchParams } from '../types';
import { Log, getToken } from '../logger';

const BASE = '/eval-api';

const normalise = (raw: RawNotification): Notification => ({
  id: raw.ID,
  notification_type: raw.Type,
  message: raw.Message,
  timestamp: raw.Timestamp,
});

export const getNotifications = async (params: FetchParams = {}): Promise<Notification[]> => {
  await Log('frontend', 'info', 'api', 'fetching notifications from api');
  try {
    const query = new URLSearchParams();
    if (params.limit) query.set('limit', String(params.limit));
    if (params.page) query.set('page', String(params.page));
    if (params.notification_type) query.set('notification_type', params.notification_type);

    const token = getToken();
    const res = await fetch(`${BASE}/notifications?${query.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    await Log('frontend', 'info', 'api', 'notifications fetched successfully');

    const raw: RawNotification[] = Array.isArray(data)
      ? data
      : (data.notifications ?? data.data ?? []);

    return raw.map(normalise);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'unknown error';
    await Log('frontend', 'error', 'api', `failed to fetch notifications: ${msg}`);
    throw err;
  }
};

const PRIORITY_WEIGHT: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export const getTopNNotifications = (notifications: Notification[], n = 10): Notification[] => {
  Log('frontend', 'debug', 'api', `sorting ${notifications.length} notifications by priority, returning top ${n}`);
  return [...notifications]
    .sort((a, b) => {
      const pa = PRIORITY_WEIGHT[a.notification_type] ?? 0;
      const pb = PRIORITY_WEIGHT[b.notification_type] ?? 0;
      if (pb !== pa) return pb - pa;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    })
    .slice(0, n);
};
