import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  TextField,
  Button,
  IconButton,
  Avatar,
  Grid,
  Chip,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useAuth } from '../contexts/AuthContext';

// Risk level icons
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const MessageDetail = () => {
  const { messageId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [message, setMessage] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [sendingResponse, setSendingResponse] = useState(false);
  const [generatedResponse, setGeneratedResponse] = useState(null);

  useEffect(() => {
    fetchMessageDetails();
  }, [messageId]);

  const fetchMessageDetails = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(`/api/messages/${messageId}`);
      setMessage(response.data);
      setResponses(response.data.responses || []);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching message details:', error);
      setError('Failed to load message details');
      setLoading(false);
    }
  };

  const handleResponseChange = (event) => {
    setResponseText(event.target.value);
  };

  const handleSendResponse = async () => {
    if (!responseText.trim()) return;
    
    try {
      setSendingResponse(true);
      
      const response = await axios.post(`/api/messages/${messageId}/responses`, {
        content: responseText
      });
      
      // Add new response to the list
      setResponses([...responses, response.data]);
      
      // Clear response text
      setResponseText('');
      
      setSendingResponse(false);
    } catch (error) {
      console.error('Error sending response:', error);
      setSendingResponse(false);
    }
  };

  const handleGenerateResponse = async () => {
    try {
      const response = await axios.post(`/api/messages/${messageId}/generate-response`);
      setGeneratedResponse(response.data.content);
      setResponseText(response.data.content);
    } catch (error) {
      console.error('Error generating response:', error);
    }
  };

  const handleUseGeneratedResponse = () => {
    setResponseText(generatedResponse);
    setGeneratedResponse(null);
  };

  const handleBack = () => {
    navigate('/messages');
  };

  const getRiskLevelChip = (riskLevel) => {
    switch (riskLevel) {
      case 'high-risk':
        return (
          <Chip 
            icon={<ErrorIcon />} 
            label="High Risk" 
            size="small" 
            color="error" 
            variant="outlined" 
          />
        );
      case 'low-risk':
        return (
          <Chip 
            icon={<WarningIcon />} 
            label="Low Risk" 
            size="small" 
            color="warning" 
            variant="outlined" 
          />
        );
      case 'safe':
        return (
          <Chip 
            icon={<CheckCircleIcon />} 
            label="Safe" 
            size="small" 
            color="success" 
            variant="outlined" 
          />
        );
      default:
        return null;
    }
  };

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

  if (!message) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Message not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">Message from {message.sender_name}</Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <Avatar 
                src={`https://ui-avatars.com/api/?name=${message.sender_name}&background=random`} 
                alt={message.sender_name}
                sx={{ mr: 2 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {message.sender_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {moment(message.created_at).format('MMM D, YYYY h:mm A')}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {message.content}
                </Typography>
                <Box>
                  {getRiskLevelChip(message.risk_level)}
                </Box>
              </Box>
            </Box>
          </Paper>
          
          {responses.length > 0 && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Responses
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {responses.map((response, index) => (
                <Box key={response.id} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar 
                    src={currentUser?.profile_image || '/default-avatar.png'} 
                    alt={currentUser?.display_name || 'You'}
                    sx={{ mr: 2 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          You
                        </Typography>
                        {response.is_auto_generated && (
                          <Chip 
                            icon={<AutorenewIcon />} 
                            label="Auto-generated" 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {moment(response.created_at).format('MMM D, YYYY h:mm A')}
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {response.content}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Paper>
          )}
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Reply
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Type your response..."
              value={responseText}
              onChange={handleResponseChange}
              sx={{ mb: 2 }}
            />
            
            {generatedResponse && (
              <Box sx={{ mb: 2 }}>
                <Card variant="outlined" sx={{ bgcolor: 'rgba(0, 166, 153, 0.1)' }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      AI Generated Response:
                    </Typography>
                    <Typography variant="body2">
                      {generatedResponse}
                    </Typography>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="primary" 
                      sx={{ mt: 1 }}
                      onClick={handleUseGeneratedResponse}
                    >
                      Use This Response
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="outlined" 
                color="primary"
                startIcon={<AutorenewIcon />}
                onClick={handleGenerateResponse}
              >
                Generate Response
              </Button>
              
              <Button 
                variant="contained" 
                color="primary"
                endIcon={<SendIcon />}
                onClick={handleSendResponse}
                disabled={!responseText.trim() || sendingResponse}
              >
                Send Response
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Message Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Sender
              </Typography>
              <Typography variant="body1">
                {message.sender_name}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Received
              </Typography>
              <Typography variant="body1">
                {moment(message.created_at).format('MMMM D, YYYY h:mm A')}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Risk Level
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                {getRiskLevelChip(message.risk_level)}
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Risk Score
              </Typography>
              <Typography variant="body1">
                {(message.risk_score * 100).toFixed(0)}%
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                {message.is_read ? (
                  <Chip label="Read" size="small" color="default" />
                ) : (
                  <Chip label="Unread" size="small" color="primary" />
                )}
                {message.is_flagged && (
                  <Chip label="Flagged" size="small" color="error" sx={{ ml: 1 }} />
                )}
                {message.is_archived && (
                  <Chip label="Archived" size="small" color="default" sx={{ ml: 1 }} />
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MessageDetail;
