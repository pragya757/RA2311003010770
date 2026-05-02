import React from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Log } from '../logger';

interface Props {
  view: 'all' | 'priority';
  onViewChange: (v: 'all' | 'priority') => void;
  typeFilter: string;
  onTypeChange: (t: string) => void;
  topN: number;
  onTopNChange: (n: number) => void;
}

const btnBase = {
  px: 2.5, py: 0.9,
  borderRadius: 20,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  border: '1px solid rgba(255,255,255,0.15)',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
};

const FilterBar: React.FC<Props> = ({
  view, onViewChange, typeFilter, onTypeChange, topN, onTopNChange,
}) => {
  const handleType = (e: SelectChangeEvent) => {
    onTypeChange(e.target.value);
    Log('frontend', 'info', 'component', `type filter changed to ${e.target.value || 'all'}`);
  };

  const handleTopN = (e: SelectChangeEvent) => {
    onTopNChange(Number(e.target.value));
    Log('frontend', 'info', 'component', `top-n changed to ${e.target.value}`);
  };

  const handleView = (v: 'all' | 'priority') => {
    onViewChange(v);
    Log('frontend', 'info', 'component', `view toggled to ${v}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
        alignItems: 'center',
        p: 2,
        mb: 3,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mr: 1, letterSpacing: 1, fontSize: 11 }}>
        FILTERS
      </Typography>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Box
          onClick={() => handleView('all')}
          sx={{
            ...btnBase,
            backgroundColor: view === 'all' ? 'rgba(99,102,241,0.85)' : 'transparent',
            color: view === 'all' ? '#fff' : 'rgba(255,255,255,0.6)',
            borderColor: view === 'all' ? '#6366f1' : 'rgba(255,255,255,0.15)',
          }}
        >
          🔔 All
        </Box>
        <Box
          onClick={() => handleView('priority')}
          sx={{
            ...btnBase,
            backgroundColor: view === 'priority' ? 'rgba(168,85,247,0.85)' : 'transparent',
            color: view === 'priority' ? '#fff' : 'rgba(255,255,255,0.6)',
            borderColor: view === 'priority' ? '#a855f7' : 'rgba(255,255,255,0.15)',
          }}
        >
          ⭐ Priority
        </Box>
      </Box>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Type</InputLabel>
        <Select
          value={typeFilter}
          label="Type"
          onChange={handleType}
          sx={{ color: '#f1f5f9', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="Event">📅 Event</MenuItem>
          <MenuItem value="Result">🏆 Result</MenuItem>
          <MenuItem value="Placement">💼 Placement</MenuItem>
        </Select>
      </FormControl>

      {view === 'priority' && (
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Top N</InputLabel>
          <Select
            value={String(topN)}
            label="Top N"
            onChange={handleTopN}
            sx={{ color: '#f1f5f9', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
          >
            {[5, 10, 15, 20].map((n) => (
              <MenuItem key={n} value={n}>{n}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};

export default FilterBar;
