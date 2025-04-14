import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

const StatContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
}));

const IconContainer = styled(Box)(({ bgcolor }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 60,
  height: 60,
  borderRadius: 12,
  backgroundColor: bgcolor,
  color: 'white',
  marginRight: 16,
  '& svg': {
    fontSize: 30,
  },
}));

const StatCard = ({ title, value, icon, color, subtitle }) => {
  return (
    <StatContainer>
      <IconContainer bgcolor={color}>
        {icon}
      </IconContainer>
      <Box>
        <Typography variant="h6" fontWeight="bold">
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </StatContainer>
  );
};

export default StatCard;
