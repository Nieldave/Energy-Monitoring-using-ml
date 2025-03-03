import React from 'react';
import { 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Typography, 
  IconButton,
  Box
} from '@mui/material';
import { 
  Check as CheckIcon,
  AlertTriangle as AlertIcon,
  AlertCircle as ErrorIcon,
  Bell as NotificationIcon
} from 'lucide-react';
import { Alert } from '../../types';

interface AlertItemProps {
  alert: Alert;
  onMarkAsRead: (id: string) => void;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, onMarkAsRead }) => {
  const getAlertIcon = () => {
    switch (alert.type) {
      case 'budget':
        return <AlertIcon color="#ff9800" />;
      case 'anomaly':
        return <ErrorIcon color="#f44336" />;
      case 'system':
        return <NotificationIcon color="#2196f3" />;
      default:
        return <NotificationIcon color="#2196f3" />;
    }
  };

  const getAlertColor = () => {
    switch (alert.type) {
      case 'budget':
        return '#ff9800';
      case 'anomaly':
        return '#f44336';
      case 'system':
        return '#2196f3';
      default:
        return '#2196f3';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <ListItem
      secondaryAction={
        !alert.read && (
          <IconButton edge="end" aria-label="mark as read" onClick={() => onMarkAsRead(alert.id)}>
            <CheckIcon size={20} />
          </IconButton>
        )
      }
      sx={{
        bgcolor: alert.read ? 'transparent' : 'rgba(25, 118, 210, 0.05)',
        borderLeft: alert.read ? 'none' : `4px solid ${getAlertColor()}`,
        mb: 1,
        borderRadius: 1,
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.paper' }}>
          {getAlertIcon()}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2" component="span">
              {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatTimestamp(alert.timestamp)}
            </Typography>
          </Box>
        }
        secondary={alert.message}
      />
    </ListItem>
  );
};

export default AlertItem;