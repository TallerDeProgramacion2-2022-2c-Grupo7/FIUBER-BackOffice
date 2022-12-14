import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid, Paper, Typography } from '@mui/material';
import { RequireAuth, useAuth } from '../contexts/Auth';
import Container from './common/Container';
import CommonTable from './common/Table';
import StatusText from './common/StatusText';
import EmailLink from './common/EmailLink';
import { getMetricsForUser } from '../api/trips';

export default function Profile() {
  const auth = useAuth();
  const location = useLocation();
  const user = location.state?.user;
  const [tripMetrics, setTripMetrics] = useState({});
  useEffect(() => {
    document.title = 'User profile - FIUBER Backoffice';

    const loadTripMetrics = async () => {
      const result = await getMetricsForUser(auth.user, user.uid);
      setTripMetrics(result);
    };

    loadTripMetrics();
  }, []);
  const fullName = (user.first_name && user.last_name) ? `${user.first_name} ${user.last_name}` : '';
  return (
    <RequireAuth>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <CommonTable
                title="User profile"
                headers={['', '']}
                rows={[
                  { id: 1, fields: [<Typography fontSize="inherit">User ID</Typography>, user.uid] },
                  { id: 2, fields: [<Typography fontSize="inherit">User type</Typography>, (user.is_admin === true) ? 'Admin' : 'User'] },
                  { id: 3, fields: [<Typography fontSize="inherit">Status</Typography>, <StatusText active={user.is_active} />] },
                  { id: 4, fields: [<Typography fontSize="inherit">Full name</Typography>, fullName || '-'] },
                  { id: 5, fields: [<Typography fontSize="inherit">Email address</Typography>, <EmailLink emailAddress={user.email} />] },
                  { id: 6, fields: [<Typography fontSize="inherit">Car model</Typography>, user.car_model || '-'] },
                  { id: 7, fields: [<Typography fontSize="inherit">Car plate</Typography>, user.car_plate || '-'] },
                  { id: 8, fields: [<Typography fontSize="inherit">Signup datetime</Typography>, user.creation_datetime] },
                  { id: 9, fields: [<Typography fontSize="inherit">Last signin datetime</Typography>, user.last_sign_in_datetime] },
                ]}
              />
              <CommonTable
                title="Metrics"
                headers={['', '']}
                rows={[
                  { id: 1, fields: [<Typography fontSize="inherit">Trips as a passenger</Typography>, tripMetrics.tripsAsPassenger || 0] },
                  { id: 2, fields: [<Typography fontSize="inherit">Trips as a driver</Typography>, tripMetrics.tripsAsDriver || 0] },
                  { id: 3, fields: [<Typography fontSize="inherit">Ratings made</Typography>, 0] },
                ]}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </RequireAuth>
  );
}
