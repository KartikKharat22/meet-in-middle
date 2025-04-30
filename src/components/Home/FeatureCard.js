
import { Paper, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

export function FeatureCard({ icon, title, description }) {
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'translateY(-8px)'
        }
      }}
    >
      <Box sx={{ 
        width: 80,
        height: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2
      }}>
        {icon}
      </Box>
      <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  );
}

FeatureCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};