import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    TextField, 
    Button, 
    Box, 
    Typography, 
    Link,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Grid
  } from '@mui/material';
  import { DatePicker } from '@mui/lab';

  function Register(){

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        birthDate: null,
        gender: '',
        agreeTerms: false
      });
    const [errors, setErrors] = useState({});

    const handleChange = (c) => {
      const { name, value, checked, type } = c.target;
      setFormData({
        ...formData,
        [name]: type==='checkbox' ? checked : value
      });
    };

    const handleDateChange = (date) => {
      setFormData({
        ...formData,
        birthDate: date
      });
    };

    const validForm = () => {
      const newErrors = {};

      //check email
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid';

      //check phone number
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
      else if (!/^\d{10,15}$/.test(formData.phone)) newErrors.phone = 'Phone number is invalid';

      if (!formData.password) newErrors.password = 'Password is required';
      else if ( formData.password.length < 8) newErrors.password='Password muust be ata least 8 charactors';

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Password do not match';
      }

      if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree the terms';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (s) => {
      s.preventDefault();
      if (validForm()) {
        //TODO: Implement registration API call 
        console.log('Registration data: ', formData);
        //after registration succeess redirect to VerifyOTP
        navigate('/verify-otp');
      }
    };

    const formFields = [
      {label: "Full Name", name: 'name', type:'text'},
      {label: "Email", name: 'email', type:'email'},
      {label: "Phone Number", name: 'phone', type:'text'},
      {label: "Password", name: 'password', type:'password'},
      {label: "Confirm Password", name: 'confirmPassword', type:'password'},
    ]

    return (
      <Box sx={{maxWidth:600, mx: 'auto', mt:4, p:3}}>
        <Typography variant='h4' gutterBottom align='center'>
          Create Account
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {formFields.map((field, index)=>(
            <Grid item xs={12} md={6} key={index}>
              <TextField
                fullWidth
                label={field.label}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                error={!!errors[field.name]}
                helperText={errors[field.name]}
                />
            </Grid>
            ))}

           {/* Date piker */}

           <Grid item xs={12} md={6}>
            <DatePicker
              label="Birth Date"
              value={formData.birthDate}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField {...params} fullWidth />
              )}
            />
          </Grid>

           {/* Gender Selection */}
           <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select 
              name='gender' 
              value ='{formData.gender}' 
              onChange={handleChange}
              >
                <MenuItem value='male'>Male</MenuItem>
                <MenuItem value='female'>Female</MenuItem>
                <MenuItem value='other'>Other</MenuItem>
                <MenuItem value='prefer-not-to-say'>Prefer not to say</MenuItem>

              </Select>
            </FormControl>
           </Grid>
            
           <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name='agreeTerms'
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  color='primary'
                  />
                }
                label={
                  <Typography>
                    I agree to the <Link href="/terms">Terms and Conditions</Link> and <Link href="/privacy">Privacy Policy</Link>
                  </Typography>
                }
              />
              {errors.agreeTerms && (
                <Typography color='error' variant='caption'>
                  {errors.agreeTerms}
                </Typography>
              )}
           </Grid>

           <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
            >
              Register
            </Button>
           </Grid>
          </Grid>
        </form>
        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        Already have an account? <Link href="/login">Sign in</Link>
      </Typography>
      </Box>
    );
  }

  export default Register;