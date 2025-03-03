import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Grid } from '@mui/material';
import { 
  Power as PowerIcon,
  Zap as ZapIcon,
  Clock as ClockIcon,
  MapPin as LocationIcon
} from 'lucide-react';
import { Device } from '../../types';

interface DeviceStatusCardProps {
  device: Device;
  currentUsage?: number;
  onClick?: () => void;
}

const DeviceStatusCard: React.FC<DeviceStatusCardProps> = ({ 
  device, 
  currentUsage = 0,
  onClick 
}) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        '&:hover': onClick ? { transform: 'translateY(-4px)', boxShadow: 3 } : {}
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="div">
            {device.name}
          </Typography>
          <Chip 
            size="small"
            label={device.status}
            color={device.status === 'online' ? 'success' : 'error'}
            icon={<PowerIcon size={14} />}
          />
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ZapIcon size={16} style={{ marginRight: '8px', color: '#1976d2' }} />
              <Typography variant="body2" color="text.secondary">
                Current Usage
              </Typography>
            </Box>
            <Typography variant="body1">
              {currentUsage} kWh
            </Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ClockIcon size={16} style={{ marginRight: '8px', color: '#1976d2' }} />
              <Typography variant="body2" color="text.secondary">
                Type
              </Typography>
            </Box>
            <Typography variant="body1">
              {device.type}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon size={16} style={{ marginRight: '8px', color: '#1976d2' }} />
              <Typography variant="body2" color="text.secondary">
                Location
              </Typography>
            </Box>
            <Typography variant="body1">
              {device.location}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DeviceStatusCard;