import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const AnalyticsDashboard = ({ statusDistribution, zoneDistribution }) => {
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);

    const STATUS_COLORS = {
        'Online': '#4caf50',
        'Offline': '#f44336',
        'Faulty': '#ff9800',
        'Maintenance': '#2196f3'
    };

    const ZONE_COLORS = {
        'North': '#3f51b5',
        'South': '#009688',
        'East': '#e91e63',
        'Central': '#673ab7'
    };

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return percent > 0 ? (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="12px"
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        ) : null;
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <Paper sx={{ p: 1.5, boxShadow: 2 }}>
                    <Typography fontWeight="bold">{data.name}</Typography>
                    <Typography>Count: {data.count}</Typography>
                </Paper>
            );
        }
        return null;
    };

    const handlePieClick = (data, type) => {
        if (type === 'status') {
            setSelectedStatus(data.name === selectedStatus ? null : data.name);
        } else {
            setSelectedZone(data.name === selectedZone ? null : data.name);
        }
    };

    const renderLegend = (colors, selected, onClick) => (
        <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
            {Object.entries(colors).map(([name, color]) => (
                <Box
                    key={name}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        cursor: 'pointer',
                        bgcolor: '#f0f0f0',
                        opacity: selected && selected !== name ? 0.5 : 1
                    }}
                    onClick={() => onClick({ name })}
                >
                    <Box
                        sx={{
                            width: 10,
                            height: 10,
                            bgcolor: color,
                            mr: 0.8,
                            borderRadius: '50%'
                        }}
                    />
                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{name}</Typography>
                </Box>
            ))}
        </Box>
    );

    return (
        <Box sx={{
            width: '100%',
            maxHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            mx: 'auto'

        }}>
            <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                    mb: 0,
                    fontSize: '1.1rem'
                }}
            >
                Analytics Dashboard
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
                {/* Status Distribution */}
                <Paper
                    elevation={0}
                    sx={{
                        flex: 1,
                        px: 2,
                        pt: 1,
                        height: '300px',
                        display: 'flex',
                        flexDirection: 'column',
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
                    <Typography
                        variant="subtitle2"
                        fontWeight="600"
                        align="center"
                        sx={{
                            mb: 1,
                            fontSize: '0.95rem'
                        }}
                    >
                        VMS Status Distribution
                    </Typography>
                    {selectedStatus && (
                        <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'center' }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 1,
                                    bgcolor: '#f5f5f5',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 1
                                }}
                            >
                                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                                    {selectedStatus}: <strong>
                                        {statusDistribution.find(s => s.name === selectedStatus)?.count || 0}
                                    </strong>
                                </Typography>
                            </Paper>
                        </Box>
                    )}
                    <Box sx={{ flex: 1, minHeight: 180 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusDistribution}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={0}
                                    outerRadius={80}
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    onClick={(data) => handlePieClick(data, 'status')}
                                >
                                    {statusDistribution.map((entry, index) => (
                                        <Cell
                                            key={`status-cell-${index}`}
                                            fill={STATUS_COLORS[entry.name]}
                                            opacity={selectedStatus && selectedStatus !== entry.name ? 0.5 : 1}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                    {renderLegend(STATUS_COLORS, selectedStatus, (d) => handlePieClick(d, 'status'))}
                </Paper>

                {/* Zone Distribution */}
                <Paper
                    elevation={0}
                    sx={{
                        flex: 1,
                        px: 2,
                        pt: 1,
                        height: '300px',
                        display: 'flex',
                        flexDirection: 'column',
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
                    <Typography
                        variant="subtitle2"
                        fontWeight="600"
                        align="center"
                        sx={{
                            mb: 1,
                            fontSize: '0.95rem'
                        }}
                    >
                        VMS by Zone
                    </Typography>
                    {selectedZone && (
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                            <Paper sx={{ p: 1, bgcolor: '#f5f5f5' }}>
                                <Typography variant="body2">
                                    {selectedZone}: <strong>
                                        {zoneDistribution.find(z => z.name === selectedZone)?.count || 0}
                                    </strong>
                                </Typography>
                            </Paper>
                        </Box>
                    )}
                    <Box sx={{ flex: 1, minHeight: 180 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={zoneDistribution}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={0}
                                    outerRadius={80}
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    onClick={(data) => handlePieClick(data, 'zone')}
                                >
                                    {zoneDistribution.map((entry, index) => (
                                        <Cell
                                            key={`zone-cell-${index}`}
                                            fill={ZONE_COLORS[entry.name]}
                                            opacity={selectedZone && selectedZone !== entry.name ? 0.5 : 1}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                    {renderLegend(ZONE_COLORS, selectedZone, (d) => handlePieClick(d, 'zone'))}
                </Paper>
            </Box>
        </Box>
    );

};

export default AnalyticsDashboard;