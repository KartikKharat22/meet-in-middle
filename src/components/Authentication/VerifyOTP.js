import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';

function VerifyOTP() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (s) => {
        s.preventDefault();
        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6 digit OTP');
            return;
        }

        // OTP verification
        const verifyOTP = async (phone, code) => {
            try {
                const res = await API.post('/auth/verify-otp', { phone, code });
                localStorage.setItem('token', res.data.token);
                // Store user data in context/state
            } catch (err) {
                // Handle error
            }
        };

        navigate('/dashboard');
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 10, p: 4 }}>
            <Typography variant='h4' gutterBottom>Verify OTP</Typography>
            <Typography variant='body1' gutterBottom>
                OTP sent to your phone number
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label='OTP Code'
                    variant='outlined'
                    margin='normal'
                    value={otp}
                    onChange={(s) => setOtp(s.target.value)}
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
                    Verify
                </Button>
            </form>
        </Box>
    );
}

export default VerifyOTP;
