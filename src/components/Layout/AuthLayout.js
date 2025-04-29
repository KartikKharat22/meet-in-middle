import { Box } from '@mui/material';

export function AuthLayout({ children }) {
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'background.default',
      p: 2
    }}>
      {children}
    </Box>
  );
}