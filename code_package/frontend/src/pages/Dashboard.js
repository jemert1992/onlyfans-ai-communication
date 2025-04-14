import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress,
  Paper,
  Divider
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// Icons
import MessageIcon from '@mui/icons-material/Message';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// Components
import StatCard from '../components/StatCard';
import MessageList from '../components/MessageList';
import StyleSettingsPreview from '../components/StyleSettingsPreview';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch user stats
        const statsResponse = await axios.get('/api/users/stats');
        setStats(statsResponse.data);
        
        // Fetch recent messages
        const messagesResponse = await axios.get('/api/messages?per_page=5');
        setRecentMessages(messagesResponse.data.messages);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
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

  // Calculate auto-response percentage
  const autoResponsePercentage = stats ? 
    Math.round(stats.response_stats.auto_response_percentage) : 0;

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Messages"
            value={stats?.message_counts.total || 0}
            icon={<MessageIcon />}
            color="#ff5a5f"
            subtitle={`${stats?.message_counts.unread || 0} unread`}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Auto-Responses"
            value={stats?.response_stats.auto_response_count || 0}
            icon={<AutorenewIcon />}
            color="#00a699"
            subtitle={`${autoResponsePercentage}% of total messages`}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Flagged Content"
            value={stats?.message_counts.high_risk || 0}
            icon={<WarningIcon />}
            color="#ff9600"
            subtitle={`${stats?.message_counts.low_risk || 0} low-risk messages`}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Engagement Rate"
            value="92%"
            icon={<TrendingUpIcon />}
            color="#4CAF50"
            subtitle="+5% from last month"
          />
        </Grid>
        
        {/* Recent Messages */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Messages
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <MessageList 
              messages={recentMessages} 
              compact={true}
              showViewAll={true}
            />
          </Paper>
        </Grid>
        
        {/* Style Settings Preview */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Your Response Style
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <StyleSettingsPreview 
              flirtiness={currentUser?.style_preferences?.flirtiness || 0.5}
              friendliness={currentUser?.style_preferences?.friendliness || 0.7}
              formality={currentUser?.style_preferences?.formality || 0.3}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
