import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Link, 
  Grid,
  Avatar,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Icons
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Account Information', 'Style Preferences'];

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      display_name: '',
      flirtiness: 50,
      friendliness: 70,
      formality: 30
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .required('Username is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
      display_name: Yup.string()
        .required('Display name is required')
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        
        // Convert style preferences to 0-1 range
        const userData = {
          email: values.email,
          username: values.username,
          password: values.password,
          display_name: values.display_name,
          style_preferences: {
            flirtiness: values.flirtiness / 100,
            friendliness: values.friendliness / 100,
            formality: values.formality / 100
          }
        };
        
        await register(userData);
        navigate('/');
      } catch (error) {
        console.error('Registration error:', error);
        setError(error.response?.data?.error || 'Failed to register');
        setLoading(false);
      }
    }
  });

  const handleNext = () => {
    // Validate current step fields
    if (activeStep === 0) {
      const errors = {};
      ['email', 'username', 'password', 'confirmPassword', 'display_name'].forEach(field => {
        try {
          formik.validateField(field);
        } catch (error) {
          errors[field] = true;
        }
      });
      
      // Check if there are any errors in the current step
      const hasErrors = Object.keys(formik.errors).some(key => 
        ['email', 'username', 'password', 'confirmPassword', 'display_name'].includes(key)
      );
      
      if (hasErrors) {
        // Touch all fields to show errors
        formik.setTouched({
          email: true,
          username: true,
          password: true,
          confirmPassword: true,
          display_name: true
        });
        return;
      }
    }
    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3,
        backgroundColor: 'background.default'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 600,
          width: '100%',
          borderRadius: 2
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <PersonAddIcon />
        </Avatar>
        
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Create Your FanAI Account
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
          {activeStep === 0 ? (
            // Step 1: Account Information
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="display_name"
                  label="Display Name"
                  name="display_name"
                  value={formik.values.display_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.display_name && Boolean(formik.errors.display_name)}
                  helperText={formik.touched.display_name && formik.errors.display_name}
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  disabled={loading}
                />
              </Grid>
            </Grid>
          ) : (
            // Step 2: Style Preferences
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Set your default response style preferences
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  These settings will determine how your automated responses sound. You can change these later.
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Flirtiness
                </Typography>
                <Typography variant="caption" color="text.secondary" paragraph>
                  How flirty should your responses be?
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <TextField
                      type="range"
                      name="flirtiness"
                      value={formik.values.flirtiness}
                      onChange={formik.handleChange}
                      inputProps={{
                        min: 0,
                        max: 100,
                        step: 10
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="body2">{formik.values.flirtiness}%</Typography>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Friendliness
                </Typography>
                <Typography variant="caption" color="text.secondary" paragraph>
                  How friendly should your responses be?
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <TextField
                      type="range"
                      name="friendliness"
                      value={formik.values.friendliness}
                      onChange={formik.handleChange}
                      inputProps={{
                        min: 0,
                        max: 100,
                        step: 10
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="body2">{formik.values.friendliness}%</Typography>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Formality
                </Typography>
                <Typography variant="caption" color="text.secondary" paragraph>
                  How formal should your responses be?
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <TextField
                      type="range"
                      name="formality"
                      value={formik.values.formality}
                      onChange={formik.handleChange}
                      inputProps={{
                        min: 0,
                        max: 100,
                        step: 10
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="body2">{formik.values.formality}%</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Account'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
        
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Grid item>
            <Link component={RouterLink} to="/login" variant="body2">
              {"Already have an account? Sign In"}
            </Link>
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
        FanAI - AI Communication System for OnlyFans Creators
      </Typography>
    </Box>
  );
};

export default Register;
