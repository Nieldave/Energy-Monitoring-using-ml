import React from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { EnergyData } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface EnergyConsumptionChartProps {
  data: EnergyData[];
  title: string;
  loading?: boolean;
  color?: string;
  fill?: boolean;
  showLegend?: boolean;
}

const EnergyConsumptionChart: React.FC<EnergyConsumptionChartProps> = ({
  data,
  title,
  loading = false,
  color = 'rgba(75, 192, 192, 1)',
  fill = true,
  showLegend = true,
}) => {
  const formatData = () => {
    const labels = data.map((item) => {
      const date = new Date(item.timestamp);
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    });

    const values = data.map((item) => item.value);

    return {
      labels,
      datasets: [
        {
          label: 'Energy Consumption (kWh)',
          data: values,
          borderColor: color,
          backgroundColor: fill ? `${color.slice(0, -1)}, 0.2)` : 'transparent',
          tension: 0.4,
          fill,
          pointRadius: 2,
          pointHoverRadius: 5,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'kWh',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ flexGrow: 1, position: 'relative', minHeight: '300px' }}>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <CircularProgress />
          </Box>
        ) : data.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No data available
            </Typography>
          </Box>
        ) : (
          <Line data={formatData()} options={options} />
        )}
      </Box>
    </Paper>
  );
};

export default EnergyConsumptionChart;