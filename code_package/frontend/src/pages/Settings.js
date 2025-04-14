import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Avatar
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// Icons
import SaveIcon from '@mui/icons-material/Save';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AutorenewIcon from '@mui/icons-material/Autorenew';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Settings = () => {
  const { currentUser, updateUserProfile, updateAutomationPreferences } = useAuth();
  
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Profile settings
  const [displayName, setDisplayName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  
  // Automation settings
  const [autoRespondSafe, setAutoRespondSafe] = useState(true);
  const [autoRespondLowRisk, setAutoRespondLowRisk] = useState(false);
  const [autoRespondHighRisk, setAutoRespondHighRisk] = useState(false);
  
  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (currentUser) {
      // Load profile settings
      setDisplayName(currentUser.display_name || '');
      setProfileImage(currentUser.profile_image || '');
      
      // Load automation preferences
      if (currentUser.automation_preferences) {
        setAutoRespondSafe(currentUser.automation_preferences.auto_respond_safe);
        setAutoRespondLowRisk(currentUser.automation_preferences.auto_respond_low_risk);
        setAutoRespondHighRisk(currentUser.automation_preferences.auto_respond_high_risk);
      }
    }
  }, [currentUser]);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await updateUserProfile({
        display_name: displayName,
        profile_image: profileImage
      });
      
      setSuccess('Profile updated successfully');
      setLoading(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
      setLoading(false);
    }
  };

  const handleSaveAutomation = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await updateAutomationPreferences({
        auto_respond_safe: autoRespondSafe,
        auto_respond_low_risk: autoRespondLowRisk,
        auto_respond_high_risk: autoRespondHighRisk
      });
      
      setSuccess('Automation preferences updated successfully');
      setLoading(false);
    } catch (error) {
      console.error('Error updating automation preferences:', error);
      setError('Failed to update automation preferences');
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await axios.put('/api/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setSuccess('Password changed successfully');
      setLoading(false);
    } catch (error) {
      console.error('Error changing password:', error);
      setError(error.response?.data?.error || 'Failed to change password');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<Avatar />} label="Profile" />
          <Tab icon={<AutorenewIcon />} label="Automation" />
          <Tab icon={<SecurityIcon />} label="Security" />
        </Tabs>
        
        {/* Profile Settings */}
        <TabPanel value={value} index={0}>
          <Typography variant="h6" gutterBottom>
            Profile Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Update your profile information.
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Profile Image URL"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                margin="normal"
                helperText="Enter a URL for your profile image"
              />
            </Grid>
            
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
            
            {success && (
              <Grid item xs={12}>
                <Alert severity="success">{success}</Alert>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveProfile}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Profile'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Automation Settings */}
        <TabPanel value={value} index={1}>
          <Typography variant="h6" gutterBottom>
            Automation Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Control which messages receive automatic responses.
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoRespondSafe}
                    onChange={(e) => setAutoRespondSafe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Auto-respond to safe messages"
              />
              <Typography variant="caption" color="text.secondary" display="block">
                Messages classified as safe will receive automatic responses.
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoRespondLowRisk}
                    onChange={(e) => setAutoRespondLowRisk(e.target.checked)}
                    color="primary"
                  />
                }
                label="Auto-respond to low-risk messages"
              />
              <Typography variant="caption" color="text.secondary" display="block">
                Messages classified as low-risk will receive automatic responses.
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoRespondHighRisk}
                    onChange={(e) => setAutoRespondHighRisk(e.target.checked)}
                    color="primary"
                  />
                }
                label="Auto-respond to high-risk messages"
              />
              <Typography variant="caption" color="text.secondary" display="block">
                Messages classified as high-risk will receive automatic responses. Not recommended.
              </Typography>
            </Grid>
            
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
            
            {success && (
              <Grid item xs={12}>
                <Alert severity="success">{success}</Alert>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveAutomation}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Automation Settings'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Security Settings */}
        <TabPanel value={value} index={2}>
          <Typography variant="h6" gutterBottom>
            Security Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Update your password and security settings.
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
              />
            </Grid>
            
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
            
            {success && (
              <Grid item xs={12}>
                <Alert severity="success">{success}</Alert>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleChangePassword}
                  disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                >
                  {loading ? <CircularProgress size={24} /> : 'Change Password'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default Settings;
