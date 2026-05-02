export interface RawNotification {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
}

export interface Notification {
  id: string;
  notification_type: string;
  message: string;
  timestamp: string;
}

export interface FetchParams {
  limit?: number;
  page?: number;
  notification_type?: string;
}
