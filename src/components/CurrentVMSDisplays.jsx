import React from 'react';
import { Paper, Typography, Box, Grid, Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const CurrentVMSDisplays = ({ displays }) => {
    return (
        <Box sx={{
            height: 'auto',
            maxHeight: '500px',
            overflowY: 'auto',
            width: '100%',
            mx: 'auto',
            maxWidth: '100%'
        }}>
            <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                    mb: 1,
                    fontSize: '1.1rem'
                }}
            >
                Current VMS Displays
            </Typography>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 2,
                width: '100%'
            }}>
                {displays.map((display) => (
                    <Paper
                        key={display.id}
                        elevation={0}
                        sx={{
                            p: 1.5,
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            height: 'auto',
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
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box display="flex" alignItems="center" gap={1}>
                                <LocationOnIcon fontSize="small" sx={{ opacity: 0.8 }} />
                                <Typography
                                    fontWeight="600"
                                    variant="subtitle2"
                                    sx={{
                                        fontSize: '0.95rem',
                                        lineHeight: 1.4
                                    }}
                                >
                                    {display.location}
                                </Typography>
                            </Box>
                            <Chip
                                label={display.status}
                                color={display.statusColor}
                                size="small"
                                sx={{
                                    height: '22px',
                                    '& .MuiChip-label': {
                                        fontSize: '0.7rem',
                                        px: 1
                                    }
                                }}
                            />
                        </Box>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 1,
                                my: 1.5,
                                bgcolor: '#f5f5f5',
                                border: '1px solid #e0e0e0',
                                borderRadius: 1
                            }}
                        >
                            <Typography variant="body2">{display.message}</Typography>
                        </Paper>
                        <Typography
                            variant="body2"
                            sx={{
                                fontSize: '0.75rem',
                                opacity: 0.8,
                                mb: 0.5
                            }}
                        >
                            <strong>Chainage:</strong> {display.chainage}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                fontSize: '0.75rem',
                                opacity: 0.8,
                                mb: 0.5
                            }}
                        >
                            <strong>Type:</strong> {display.type}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                fontSize: '0.75rem',
                                opacity: 0.8,
                                mb: 0.5
                            }}
                        >
                            <strong>Zone:</strong> {display.zone}
                        </Typography>
                        <Typography
                            variant="body2"
                            display="flex"
                            alignItems="center"
                            gap={0.5}
                            sx={{
                                fontSize: '0.75rem',
                                opacity: 0.8
                            }}
                        >
                            <AccessTimeIcon fontSize="small" /> Last Updated: {display.lastUpdated}
                        </Typography>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};

export default CurrentVMSDisplays;
