import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Typography, 
  Chip, 
  Divider,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

// Icons
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const MessageList = ({ messages, compact = false, showViewAll = false }) => {
  const navigate = useNavigate();
  
  const handleMessageClick = (messageId) => {
    navigate(`/messages/${messageId}`);
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
  
  if (!messages || messages.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No messages to display
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {messages.map((message, index) => (
          <React.Fragment key={message.id}>
            <ListItem 
              alignItems="flex-start" 
              button 
              onClick={() => handleMessageClick(message.id)}
              sx={{ 
                py: compact ? 1 : 2,
                backgroundColor: message.is_read ? 'transparent' : 'rgba(255, 90, 95, 0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemAvatar>
                <Avatar alt={message.sender_name} src={`https://ui-avatars.com/api/?name=${message.sender_name}&background=random`} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={message.is_read ? 'normal' : 'bold'}
                    >
                      {message.sender_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {moment(message.created_at).fromNow()}
                    </Typography>
                  </Box>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline', mr: 1 }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {compact 
                        ? `${message.content.substring(0, 60)}${message.content.length > 60 ? '...' : ''}`
                        : `${message.content.substring(0, 120)}${message.content.length > 120 ? '...' : ''}`
                      }
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {getRiskLevelChip(message.risk_level)}
                      {!message.is_read && (
                        <Chip 
                          label="Unread" 
                          size="small" 
                          color="primary" 
                          sx={{ ml: 1 }} 
                        />
                      )}
                    </Box>
                  </React.Fragment>
                }
              />
            </ListItem>
            {index < messages.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
      
      {showViewAll && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => navigate('/messages')}
          >
            View All Messages
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MessageList;
