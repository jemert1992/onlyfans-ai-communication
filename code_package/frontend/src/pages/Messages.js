import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MessageList from '../components/MessageList';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [readFilter, setReadFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMessages();
  }, [page, riskFilter, readFilter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      let params = {
        page: page,
        per_page: 20
      };
      
      if (riskFilter !== 'all') {
        params.risk_level = riskFilter;
      }
      
      if (readFilter !== 'all') {
        params.is_read = readFilter === 'read';
      }
      
      const response = await axios.get('/api/messages', { params });
      
      setMessages(response.data.messages);
      setTotalPages(response.data.pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRiskFilterChange = (event) => {
    setRiskFilter(event.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  const handleReadFilterChange = (event) => {
    setReadFilter(event.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  // Filter messages by search term
  const filteredMessages = messages.filter(message => 
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.sender_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && page === 1) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search messages..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="risk-filter-label">Risk Level</InputLabel>
              <Select
                labelId="risk-filter-label"
                value={riskFilter}
                label="Risk Level"
                onChange={handleRiskFilterChange}
              >
                <MenuItem value="all">All Messages</MenuItem>
                <MenuItem value="safe">Safe</MenuItem>
                <MenuItem value="low-risk">Low Risk</MenuItem>
                <MenuItem value="high-risk">High Risk</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="read-filter-label">Read Status</InputLabel>
              <Select
                labelId="read-filter-label"
                value={readFilter}
                label="Read Status"
                onChange={handleReadFilterChange}
              >
                <MenuItem value="all">All Messages</MenuItem>
                <MenuItem value="unread">Unread</MenuItem>
                <MenuItem value="read">Read</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {searchTerm ? 'Search Results' : 'All Messages'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredMessages.length} messages
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {filteredMessages.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No messages found
            </Typography>
          </Box>
        ) : (
          <MessageList messages={filteredMessages} />
        )}
      </Paper>
    </Box>
  );
};

export default Messages;
