import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import type { Notification } from '../types';
import { Log } from '../logger';

interface Props {
  notification: Notification;
  isRead: boolean;
  onRead: (id: string) => void;
}

const typeColors: Record<string, string> = {
  Event: '#6366f1',
  Result: '#22c55e',
  Placement: '#f59e0b',
};

const typeLabels: Record<string, string> = {
  Event: '📅 Event',
  Result: '🏆 Result',
  Placement: '💼 Placement',
};

const NotificationCard: React.FC<Props> = ({ notification, isRead, onRead }) => {
  const color = typeColors[notification.notification_type] ?? '#6366f1';
  const label = typeLabels[notification.notification_type] ?? notification.notification_type;

  const handleClick = () => {
    if (!isRead) {
      onRead(notification.id);
      Log('frontend', 'debug', 'component', `notification card clicked: ${notification.id}`);
    }
  };

  let formattedTime = notification.timestamp;
  try {
    const d = new Date(notification.timestamp);
    if (!isNaN(d.getTime())) {
      formattedTime = d.toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    }
  } catch { /* keep raw */ }

  return (
    <Card
      onClick={handleClick}
      sx={{
        mb: 2,
        cursor: isRead ? 'default' : 'pointer',
        border: `2px solid ${isRead ? 'rgba(255,255,255,0.08)' : color}`,
        borderRadius: 3,
        backgroundColor: isRead ? 'rgba(255,255,255,0.03)' : 'rgba(99,102,241,0.07)',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.22s ease',
        opacity: isRead ? 0.7 : 1,
        '&:hover': {
          transform: isRead ? 'none' : 'translateY(-2px)',
          boxShadow: isRead ? 'none' : `0 8px 28px ${color}40`,
        },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
          <Box
            sx={{
              px: 1.5, py: 0.4,
              borderRadius: 20,
              backgroundColor: `${color}25`,
              border: `1px solid ${color}60`,
              fontSize: 12,
              fontWeight: 700,
              color: color,
              letterSpacing: 0.5,
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </Box>
          {isRead && (
            <Box
              sx={{
                px: 1.2, py: 0.4,
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.2)',
                fontSize: 11,
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              ✓ Read
            </Box>
          )}
        </Box>
        <Typography
          variant="body1"
          sx={{
            color: isRead ? 'rgba(255,255,255,0.5)' : '#f1f5f9',
            fontWeight: isRead ? 400 : 500,
            lineHeight: 1.7,
            fontSize: '0.95rem',
          }}
        >
          {notification.message}
        </Typography>
        <Typography
          variant="caption"
          sx={{ mt: 1.2, display: 'block', color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}
        >
          🕒 {formattedTime}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
