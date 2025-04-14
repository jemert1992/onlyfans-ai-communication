import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Slider,
  Button,
  Grid,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// Icons
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SchoolIcon from '@mui/icons-material/School';
import SaveIcon from '@mui/icons-material/Save';

// Components
import StyleSettingsPreview from '../components/StyleSettingsPreview';

const StyleSettings = () => {
  const { currentUser, updateStylePreferences } = useAuth();
  
  const [flirtiness, setFlirtiness] = useState(0.5);
  const [friendliness, setFriendliness] = useState(0.7);
  const [formality, setFormality] = useState(0.3);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Load user's current style preferences
    if (currentUser && currentUser.style_preferences) {
      setFlirtiness(currentUser.style_preferences.flirtiness || 0.5);
      setFriendliness(currentUser.style_preferences.friendliness || 0.7);
      setFormality(currentUser.style_preferences.formality || 0.3);
    }
    setLoading(false);
  }, [currentUser]);

  const handleFlirtinessChange = (event, newValue) => {
    setFlirtiness(newValue / 100);
  };

  const handleFriendlinessChange = (event, newValue) => {
    setFriendliness(newValue / 100);
  };

  const handleFormalityChange = (event, newValue) => {
    setFormality(newValue / 100);
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      await updateStylePreferences({
        flirtiness,
        friendliness,
        formality
      });
      
      setSuccess(true);
      setSaving(false);
    } catch (error) {
      console.error('Error saving style preferences:', error);
      setError('Failed to save style preferences');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Response Style Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Customize how your automated responses sound by adjusting these style parameters.
              Changes will affect all future automated responses.
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FavoriteIcon sx={{ color: '#ff5a5f', mr: 1 }} />
                <Typography variant="subtitle1">Flirtiness</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Controls how flirty and romantic your responses will be.
              </Typography>
              <Slider
                value={flirtiness * 100}
                onChange={handleFlirtinessChange}
                aria-labelledby="flirtiness-slider"
                valueLabelDisplay="auto"
                step={10}
                marks
                min={0}
                max={100}
                sx={{ color: '#ff5a5f' }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                  Professional
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Very Flirty
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmojiEmotionsIcon sx={{ color: '#00a699', mr: 1 }} />
                <Typography variant="subtitle1">Friendliness</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Controls how friendly and warm your responses will be.
              </Typography>
              <Slider
                value={friendliness * 100}
                onChange={handleFriendlinessChange}
                aria-labelledby="friendliness-slider"
                valueLabelDisplay="auto"
                step={10}
                marks
                min={0}
                max={100}
                sx={{ color: '#00a699' }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                  Reserved
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Very Friendly
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SchoolIcon sx={{ color: '#484848', mr: 1 }} />
                <Typography variant="subtitle1">Formality</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Controls how formal or casual your responses will be.
              </Typography>
              <Slider
                value={formality * 100}
                onChange={handleFormalityChange}
                aria-labelledby="formality-slider"
                valueLabelDisplay="auto"
                step={10}
                marks
                min={0}
                max={100}
                sx={{ color: '#484848' }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                  Very Casual
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Very Formal
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveSettings}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </Box>
            
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            
            {success && (
              <Typography color="success.main" sx={{ mt: 2 }}>
                Style settings saved successfully!
              </Typography>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              This is how your automated responses will sound with current settings.
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <StyleSettingsPreview 
              flirtiness={flirtiness}
              friendliness={friendliness}
              formality={formality}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StyleSettings;
