import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, CircularProgress, Alert,
  Button, Stack, Badge, Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSearchParams } from 'react-router-dom';
import type { FetchParams } from '../types';
import { useNotifications } from '../context/NotificationContext';
import NotificationCard from '../components/NotificationCard';
import FilterBar from '../components/FilterBar';
import PaginationBar from '../components/PaginationBar';
import { Log } from '../logger';

const LIMIT = 10;

const NotificationList: React.FC = () => {
  const {
    notifications, priorityNotifications, loading, error,
    readIds, view, topN,
    fetchNotifications, markAsRead, setView, setTopN,
  } = useNotifications();

  const [searchParams, setSearchParams] = useSearchParams();
  const [typeFilter, setTypeFilter] = useState(searchParams.get('notification_type') ?? '');
  const [page, setPage] = useState(Number(searchParams.get('page') ?? '1'));

  useEffect(() => {
    Log('frontend', 'info', 'page', 'notification list page mounted');
    const pg = Number(searchParams.get('page') ?? 1);
    const type = searchParams.get('notification_type') ?? '';
    const limit = Number(searchParams.get('limit') ?? LIMIT);
    setPage(pg);
    setTypeFilter(type);
    const p: FetchParams = { page: pg, limit };
    if (type) p.notification_type = type;
    fetchNotifications(p);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = (pg: number, type: string) => {
    const urlParams: Record<string, string> = { page: String(pg), limit: String(LIMIT) };
    if (type) urlParams.notification_type = type;
    setSearchParams(urlParams);
    const p: FetchParams = { page: pg, limit: LIMIT };
    if (type) p.notification_type = type;
    fetchNotifications(p);
    Log('frontend', 'info', 'page', `filters applied: page=${pg}, type=${type || 'all'}`);
  };

  const handleTypeChange = (t: string) => {
    setTypeFilter(t);
    setPage(1);
    applyFilters(1, t);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    applyFilters(p, typeFilter);
  };

  const handleRefresh = () => {
    Log('frontend', 'info', 'page', 'refresh button clicked');
    const p: FetchParams = { page, limit: LIMIT };
    if (typeFilter) p.notification_type = typeFilter;
    fetchNotifications(p);
  };

  const handleViewChange = (v: 'all' | 'priority') => {
    setView(v);
    setPage(1);
    Log('frontend', 'info', 'page', `view toggled to ${v}`);
  };

  const handleTopNChange = (n: number) => {
    setTopN(n);
    Log('frontend', 'debug', 'page', `top-n changed to ${n}`);
  };

  const activeList = view === 'priority' ? priorityNotifications : notifications;
  const filtered = typeFilter ? activeList.filter((n) => n.notification_type === typeFilter) : activeList;
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);
  const unreadCount = filtered.filter((n) => !readIds.has(n.id)).length;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 60%, #0f0f23 100%)',
        py: 5,
      }}
    >
      <Container maxWidth="md">
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Badge badgeContent={unreadCount} color="error" max={99}>
                <NotificationsIcon sx={{ fontSize: 38, color: '#6366f1' }} />
              </Badge>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  background: 'linear-gradient(135deg,#6366f1,#a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Notifications
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.disabled" mt={0.5} ml={0.5}>
              {unreadCount} unread · {filtered.length} total
            </Typography>
          </Box>

          <Tooltip title="Refresh notifications">
            <span>
              <Button
                variant="outlined"
                onClick={handleRefresh}
                startIcon={<RefreshIcon />}
                disabled={loading}
                sx={{
                  borderColor: 'rgba(99,102,241,0.5)',
                  color: '#6366f1',
                  '&:hover': { borderColor: '#6366f1', background: 'rgba(99,102,241,0.08)' },
                }}
              >
                Refresh
              </Button>
            </span>
          </Tooltip>
        </Stack>

        <FilterBar
          view={view}
          onViewChange={handleViewChange}
          typeFilter={typeFilter}
          onTypeChange={handleTypeChange}
          topN={topN}
          onTopNChange={handleTopNChange}
        />

        {loading && (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress sx={{ color: '#6366f1' }} size={48} />
          </Box>
        )}

        {error && !loading && (
          <Alert
            severity="error"
            sx={{
              mb: 3, borderRadius: 2,
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
            }}
          >
            {error}
          </Alert>
        )}

        {!loading && !error && paginated.length === 0 && (
          <Box textAlign="center" py={10}>
            <NotificationsIcon sx={{ fontSize: 72, color: 'rgba(255,255,255,0.1)', mb: 2 }} />
            <Typography color="text.disabled" variant="h6">No notifications found</Typography>
            <Typography color="text.disabled" variant="body2" mt={0.5}>
              Click Refresh to load notifications
            </Typography>
          </Box>
        )}

        {!loading && paginated.map((n) => (
          <NotificationCard
            key={n.id}
            notification={n}
            isRead={readIds.has(n.id)}
            onRead={markAsRead}
          />
        ))}

        {!loading && filtered.length > LIMIT && (
          <PaginationBar
            page={page}
            limit={LIMIT}
            total={filtered.length}
            onPageChange={handlePageChange}
          />
        )}
      </Container>
    </Box>
  );
};

export default NotificationList;
