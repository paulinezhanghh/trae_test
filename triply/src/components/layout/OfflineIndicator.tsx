import React, { useState, useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { isOnline } from '../../utils/offlineStorage';

const OfflineIndicator: React.FC = () => {
  const [online, setOnline] = useState<boolean>(isOnline());

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Snackbar
      open={!online}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ bottom: { xs: 16, sm: 24 } }}
    >
      <Alert 
        icon={<WifiOffIcon />}
        severity="warning" 
        variant="filled"
        sx={{ width: '100%' }}
      >
        You are offline. Some features may be limited.
      </Alert>
    </Snackbar>
  );
};

export default OfflineIndicator;