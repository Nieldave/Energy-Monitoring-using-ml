import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import { 
  MoreVertical as MoreIcon,
  Calendar as CalendarIcon,
  Zap as ZapIcon,
  AlertTriangle as AlertIcon,
  DollarSign as BudgetIcon
} from 'lucide-react';
import { RootState } from '../store';
import { fetchEnergyData, fetchRealtimeData } from '../store/actions/energyDataActions';
import { fetchDevices } from '../store/actions/deviceActions';
import { fetchAlerts } from '../store/actions/alertActions';
import { fetchBudgets } from '../store/actions/budgetActions';
import EnergyConsumptionChart from '../components/Dashboard/EnergyConsumptionChart';
import DeviceStatusCard from '../components/Dashboard/DeviceStatusCard';
import BudgetProgressCard from '../components/Dashboard/BudgetProgressCard';
import AlertItem from '../components/Dashboard/AlertItem';
import { markAlertAsRead } from '../store/actions/alertActions';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('day');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const { historicalData, realtimeData, loading: energyLoading } = useSelector((state: RootState) => state.energyData);
  const { devices, loading: devicesLoading } = useSelector((state: RootState) => state.devices);
  const { alerts, loading: alertsLoading } = useSelector((state: RootState) => state.alerts);
  const { budgets, loading: budgetsLoading } = useSelector((state: RootState) => state.budgets);

  useEffect(() => {
    dispatch(fetchEnergyData() as any);
    dispatch(fetchRealtimeData() as any);
    dispatch(fetchDevices() as any);
    dispatch(fetchAlerts() as any);
    dispatch(fetchBudgets() as any);
    
    // Refresh realtime data every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchRealtimeData() as any);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    setAnchorEl(null);
    
    // Fetch data for the selected time range
    const now = new Date();
    let startDate;
    
    switch (range) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        startDate = new Date(now.setHours(0, 0, 0, 0));
    }
    
    dispatch(fetchEnergyData(undefined, startDate.toISOString(), new Date().toISOString()) as any);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = (id: string) => {
    dispatch(markAlertAsRead(id) as any);
  };

  const handleDeviceClick = (deviceId: string) => {
    navigate(`/devices/${deviceId}`);
  };

  const handleBudgetClick = () => {
    navigate('/budgets');
  };

  const handleViewAllAlerts = () => {
    navigate('/alerts');
  };

  const getTotalConsumption = () => {
    return historicalData.reduce((total, item) => total + item.value, 0).toFixed(2);
  };

  const getActiveDevices = () => {
    return devices.filter(device => device.status === 'online').length;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<CalendarIcon size={18} />}
            onClick={handleMenuClick}
          >
            {timeRange === 'day' ? 'Today' : timeRange === 'week' ? 'This Week' : 'This Month'}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleTimeRangeChange('day')}>Today</MenuItem>
            <MenuItem onClick={() => handleTimeRangeChange('week')}>This Week</MenuItem>
            <MenuItem onClick={() => handleTimeRangeChange('month')}>This Month</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Consumption
                  </Typography>
                  <Typography variant="h5" component="div" sx={{ mt: 1 }}>
                    {energyLoading ? <CircularProgress size={24} /> : `${getTotalConsumption()} kWh`}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <ZapIcon size={20} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Active Devices
                  </Typography>
                  <Typography variant="h5" component="div" sx={{ mt: 1 }}>
                    {devicesLoading ? <CircularProgress size={24} /> : `${getActiveDevices()} / ${devices.length}`}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light' }}>
                  <DevicesIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Active Budgets
                  </Typography>
                  <Typography variant="h5" component="div" sx={{ mt: 1 }}>
                    {budgetsLoading ? <CircularProgress size={24} /> : budgets.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light' }}>
                  <BudgetIcon size={20} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Alerts
                  </Typography>
                  <Typography variant="h5" component="div" sx={{ mt: 1 }}>
                    {alertsLoading ? <CircularProgress size={24} /> : alerts.filter(a => !a.read).length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light' }}>
                  <AlertIcon size={20} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Energy Consumption Chart */}
        <Grid item xs={12} md={8}>
          <EnergyConsumptionChart 
            data={historicalData} 
            title="Energy Consumption" 
            loading={energyLoading}
          />
        </Grid>
        
        {/* Recent Alerts */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Alerts</Typography>
              <Button size="small" onClick={handleViewAllAlerts}>View All</Button>
            </Box>
            {alertsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : alerts.length === 0 ? (
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  No alerts to display
                </Typography>
              </Box>
            ) : (
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {alerts.slice(0, 5).map((alert) => (
                  <AlertItem 
                    key={alert.id} 
                    alert={alert} 
                    onMarkAsRead={handleMarkAsRead} 
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Device Status */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Device Status
          </Typography>
          <Grid container spacing={3}>
            {devicesLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : devices.length === 0 ? (
              <Box sx={{ textAlign: 'center', width: '100%', p: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  No devices to display
                </Typography>
              </Box>
            ) : (
              devices.slice(0, 4).map((device) => (
                <Grid item xs={12} sm={6} md={3} key={device.id}>
                  <DeviceStatusCard 
                    device={device} 
                    currentUsage={5.2} // This would come from your real data
                    onClick={() => handleDeviceClick(device.id)}
                  />
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
        
        {/* Budget Progress */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Budget Progress
          </Typography>
          <Grid container spacing={3}>
            {budgetsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : budgets.length === 0 ? (
              <Box sx={{ textAlign: 'center', width: '100%', p: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  No budgets to display
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                  onClick={handleBudgetClick}
                >
                  Create Budget
                </Button>
              </Box>
            ) : (
              budgets.map((budget) => (
                <Grid item xs={12} sm={6} md={3} key={budget.id}>
                  <BudgetProgressCard 
                    budget={budget} 
                    onClick={handleBudgetClick}
                  />
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;