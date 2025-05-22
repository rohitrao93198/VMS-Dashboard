import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import MonitorIcon from '@mui/icons-material/Monitor';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const iconMap = {
    monitor: <MonitorIcon fontSize="large" color="primary" />,
    'alert-triangle': <WarningAmberIcon fontSize="large" color="warning" />,
};

const MetricsCards = ({ metrics }) => {
    return (
        <Box sx={{
            width: '100%',
            borderRadius: 2,
            p: 1,
            mx: 'auto',
            my: 0,
            maxWidth: '90%'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                width: '100%',
                overflowX: 'auto'
            }}>
                {metrics.map((metric) => (
                    <Paper
                        key={metric.id}
                        elevation={0}
                        sx={{
                            p: 1.5,
                            minHeight: '90px',
                            minWidth: '250px',
                            flex: '1 0 0',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            borderRadius: 2,
                            border: '1px solid #e0e0e0',
                            backgroundColor: '#ffffff',
                            transition: 'all 0.2s',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }
                        }}
                    >
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                            <Typography
                                fontWeight="600"
                                variant="subtitle2"
                                sx={{
                                    fontSize: '0.95rem',
                                    lineHeight: 1.4
                                }}
                            >
                                {metric.title}
                            </Typography>
                            {iconMap[metric.icon]}
                        </Box>
                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                mb={0.5}
                                sx={{
                                    fontSize: '1.5rem'
                                }}
                            >
                                {metric.value}
                            </Typography>
                            <Typography
                                variant="body2"
                                color={metric.changeType === 'increase' ? 'success.main' :
                                    metric.changeType === 'decrease' ? 'error.main' :
                                        'text.secondary'}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '0.75rem',
                                    opacity: 0.8
                                }}
                            >
                                {metric.changeType === 'increase' ? '↑' :
                                    metric.changeType === 'decrease' ? '↓' : ''}
                                {metric.change}% {metric.changeType}
                            </Typography>
                        </Box>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};

export default MetricsCards;
