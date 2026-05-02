import React from 'react';
import { Box, Pagination as MuiPagination, Typography } from '@mui/material';
import { Log } from '../logger';

interface Props {
  page: number;
  limit: number;
  total: number;
  onPageChange: (p: number) => void;
}

const PaginationBar: React.FC<Props> = ({ page, limit, total, onPageChange }) => {
  const count = Math.max(1, Math.ceil(total / limit));

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
    Log('frontend', 'info', 'component', `pagination moved to page ${value}`);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={1} mt={3} mb={2}>
      <MuiPagination
        count={count}
        page={page}
        onChange={handleChange}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
        sx={{
          '& .MuiPaginationItem-root': {
            color: 'text.secondary',
            '&.Mui-selected': {
              background: 'linear-gradient(135deg,#6366f1,#a855f7)',
              color: '#fff',
            },
          },
        }}
      />
      <Typography variant="caption" color="text.disabled">
        Page {page} of {count} · {total} total
      </Typography>
    </Box>
  );
};

export default PaginationBar;
