/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import { useAuth } from '../contexts/Auth';
import Copyright from './common/Copyright';

const theme = createTheme();

export default function LogIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const from = location.state?.from?.pathname || '/dashboard';
  const [errorMessage, setErrorMessage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(true);
  const message = location.state?.message;

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      if (!email && !password) {
        setErrorMessage('Email and password are required.');
      } else if (!email) {
        setErrorMessage('Email addres is required.');
      } else if (!password) {
        setErrorMessage('Password is required.');
      } else {
        await auth.login(email, password);
        navigate(from, { replace: true });
      }
    } catch (error) {
      if (error.code === 'auth/wrong-password'
        || error.code === 'auth/user-not-found') {
        setErrorMessage('Incorrect email or password.');
      } else if (error.code === 'auth/user-disabled') {
        setErrorMessage('Your account is blocked.');
      } else {
        setErrorMessage('An error has ocurred.');
      }
    }
  }

  React.useEffect(() => {
    document.title = 'FIUBER Backoffice';
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {message
      && (
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={6000}
        action={() => {}}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: 400 }}>
          {message}
        </Alert>
      </Snackbar>
      )}
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://wallpapercave.com/wp/wp2290778.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Log in to FI-UBER&apos;s backoffice
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Log in
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/resetPassword" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
              {errorMessage
              && (
              <Alert severity="error" sx={{ marginTop: '1rem' }}>
                <AlertTitle>{ errorMessage }</AlertTitle>
              </Alert>
              )}
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
