import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, Chip } from '@mui/material';
import { Budget } from '../../types';

interface BudgetProgressCardProps {
  budget: Budget;
  onClick?: () => void;
}

const BudgetProgressCard: React.FC<BudgetProgressCardProps> = ({ budget, onClick }) => {
  const progress = (budget.currentUsage / budget.limit) * 100;
  const isOverBudget = progress > 100;
  
  const getProgressColor = () => {
    if (progress >= 100) return 'error';
    if (progress >= 75) return 'warning';
    return 'success';
  };

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
            {budget.name}
          </Typography>
          <Chip 
            size="small"
            label={budget.period}
            color="primary"
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Usage
            </Typography>
            <Typography variant="body2" color={isOverBudget ? 'error.main' : 'text.primary'}>
              {budget.currentUsage} / {budget.limit} kWh
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={Math.min(progress, 100)} 
            color={getProgressColor()}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {isOverBudget ? 'Over budget' : `${Math.round(progress)}% used`}
          </Typography>
          <Typography variant="body2" color={isOverBudget ? 'error.main' : 'success.main'}>
            {isOverBudget 
              ? `+${(budget.currentUsage - budget.limit).toFixed(1)} kWh over` 
              : `${(budget.limit - budget.currentUsage).toFixed(1)} kWh remaining`}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BudgetProgressCard;