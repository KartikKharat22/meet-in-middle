import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // updated
import { TextField, Button, Box, Link, Typography } from '@mui/material';

function Login({ onError, onSuccess }) {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // updated

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!phone) {
            setError('Valid phone number is required');
            return;
        }
        if (!/^\d{10}$/.test(phone)) {
            setError('Please enter a valid 10-digit number');
            return;
        }
        
        // OTP sending logic 
        // const sendOTP = async (phone) => {
        //     try {
        //       await API.post('/auth/send-otp', { phone });
        //     } catch (err) {
        //       // Handle error
        //     }
        //   };

        onSuccess(); // No navigation change here, since you're using callback
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', p: 3 }}>
            <Typography variant='h4' gutterBottom>Login</Typography>
            <form onSubmit={handleSubmit}>
                <TextField 
                    fullWidth
                    label="Phone Number"
                    variant="outlined"
                    margin="normal"
                    value={phone}
                    onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, '');
                        if (numericValue.length <= 10) setPhone(numericValue);
                    }}
                    slotProps={{
                        input: {
                          inputMode: 'numeric',
                          pattern: '[0-9]*',
                          maxLength: 10,
                        },
                      }}
                    error={!!error}
                    helperText={error}
                />
                <Button 
                    type='submit'
                    fullWidth
                    variant='contained'
                    color='primary'
                    sx={{ mt: 2 }}
                >
                    Send OTP
                </Button>
            </form>
            <Typography variant='body2' sx={{ mt: 2 }}>
                Don't have an account? <Link href="/register">Register</Link>
            </Typography>
        </Box>
    );
}

export default Login;
