import React from 'react';
import { Box, Slider, Typography, Paper, Divider, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SchoolIcon from '@mui/icons-material/School';

const StyleSlider = styled(Slider)(({ theme, color }) => ({
  color: color,
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: `2px solid ${color}`,
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: `0px 0px 0px 8px ${color}33`,
    },
    '&:before': {
      display: 'none',
    },
  },
}));

const ExampleMessage = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: '#f8f9fa',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 20,
    width: 0,
    height: 0,
    border: '10px solid transparent',
    borderBottomColor: '#f8f9fa',
    borderTop: 0,
    marginLeft: -10,
    marginTop: -10,
  }
}));

const StyleSettingsPreview = ({ flirtiness, friendliness, formality }) => {
  // Generate example message based on style settings
  const generateExampleMessage = () => {
    let message = '';
    
    // Base message
    const baseMessage = "Thanks for your message! I appreciate your support.";
    
    // Adjust based on formality
    if (formality < 0.3) {
      message = "Hey there! Thanks for your msg! Really appreciate your support!";
    } else if (formality < 0.7) {
      message = "Thanks for your message! I really appreciate your support.";
    } else {
      message = "Thank you for your message. I sincerely appreciate your support.";
    }
    
    // Add emojis based on friendliness and flirtiness
    const emojiCount = Math.round((friendliness + flirtiness) * 3);
    
    // Select emojis based on flirtiness level
    let emojis = [];
    if (flirtiness > 0.7) {
      emojis = ['💋', '😘', '💖', '🔥', '😉'];
    } else if (flirtiness > 0.3) {
      emojis = ['💕', '😊', '💗', '✨', '💯'];
    } else {
      emojis = ['👍', '🙂', '👋', '✨', '🙏'];
    }
    
    // Add emojis to message
    if (emojiCount > 0) {
      for (let i = 0; i < Math.min(emojiCount, emojis.length); i++) {
        message += ' ' + emojis[i];
      }
    }
    
    return message;
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <FavoriteIcon sx={{ color: '#ff5a5f', mr: 1 }} />
            <Typography variant="subtitle2">Flirtiness</Typography>
          </Box>
          <StyleSlider
            value={flirtiness * 100}
            color="#ff5a5f"
            disabled
          />
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <EmojiEmotionsIcon sx={{ color: '#00a699', mr: 1 }} />
            <Typography variant="subtitle2">Friendliness</Typography>
          </Box>
          <StyleSlider
            value={friendliness * 100}
            color="#00a699"
            disabled
          />
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <SchoolIcon sx={{ color: '#484848', mr: 1 }} />
            <Typography variant="subtitle2">Formality</Typography>
          </Box>
          <StyleSlider
            value={formality * 100}
            color="#484848"
            disabled
          />
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle2" gutterBottom>
        Example Response:
      </Typography>
      
      <ExampleMessage>
        <Typography variant="body2">
          {generateExampleMessage()}
        </Typography>
      </ExampleMessage>
      
      <Typography variant="caption" color="text.secondary">
        This is how your automated responses will sound with current style settings.
      </Typography>
    </Box>
  );
};

export default StyleSettingsPreview;
