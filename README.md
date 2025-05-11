# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import ProjectsOverview from '../components/ProjectsOverview';
import MetricsCards from '../components/MetricsCards';
import CurrentVMSDisplays from '../components/CurrentVMSDisplays';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

function Dashboard({ data }) {
const [selectedProjectId, setSelectedProjectId] = useState(null);
const [analyticsData, setAnalyticsData] = useState(null);

    const projects = data.projects || [];
    const vmsDisplays = data.vmsDisplays || [];
    const metricDefinitions = data.metricDefinitions || [];

    useEffect(() => {
        if (vmsDisplays.length > 0) {
            // Calculate status distribution
            const statusCounts = vmsDisplays.reduce((acc, display) => {
                const status = display.status.toLowerCase();
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            }, {});

            // Calculate zone distribution
            const zoneCounts = vmsDisplays.reduce((acc, display) => {
                const zone = display.zone;
                acc[zone] = (acc[zone] || 0) + 1;
                return acc;
            }, {});

            // Map the counts to the analytics data structure
            const statusDistribution = data.analytics.statusDistribution.map(item => ({
                name: item.name,
                color: item.color,
                count: statusCounts[item.name.toLowerCase()] || 0,
                value: statusCounts[item.name.toLowerCase()] || 0 // Use actual count instead of percentage
            }));

            const zoneDistribution = data.analytics.zoneDistribution.map(item => ({
                name: item.name,
                color: item.color,
                count: zoneCounts[item.name] || 0,
                value: zoneCounts[item.name] || 0 // Use actual count instead of percentage
            }));

            setAnalyticsData({
                statusDistribution,
                zoneDistribution
            });
        }
    }, [vmsDisplays, data.analytics]);

    const handleProjectClick = (projectId) => {
        setSelectedProjectId(projectId);
    };

    const filteredDisplays = selectedProjectId
        ? vmsDisplays.filter((display) => display.projectId === selectedProjectId)
        : vmsDisplays;

    // 🔁 Dynamic metric values based on vmsDisplays
    const dynamicMetrics = metricDefinitions.map(def => {
        let value = 0;
        const allStatuses = vmsDisplays.map(d => d.status?.toLowerCase());

        if (def.type === "total") {
            value = vmsDisplays.length;
        } else if (def.type === "status") {
            value = allStatuses.filter(status => status === def.match.toLowerCase()).length;
        } else if (def.type === "status-multiple") {
            value = allStatuses.filter(status => def.matches.map(s => s.toLowerCase()).includes(status)).length;
        }

        return {
            id: def.id,
            title: def.title,
            value,
            change: 0,
            changeType: def.changeType,
            icon: def.icon
        };
    });

    // If analyticsData isn't loaded yet, show a loading state
    if (!analyticsData) {
        return <Typography variant="h6">Loading Analytics...</Typography>;
    }

    return (
        <Box sx={{
            flexGrow: 1,
            width: '100vw', // Full viewport width
            minHeight: '100vh',
            bgcolor: '#f5f5f5',
            margin: 0,
            padding: 0
        }}>
            <Container
                maxWidth={false}
                disableGutters // Removes default padding
                sx={{
                    py: 3,
                    px: 3, // Consistent padding
                    margin: 0,
                    width: '100%'
                }}
            >
                {/* Projects Overview */}
                <Box mb={1.7} sx={{ width: '100%' }}>
                    <ProjectsOverview projects={projects} onProjectClick={handleProjectClick} />
                </Box>

                {/* Metrics Cards */}
                <Box mb={1.7} sx={{ width: '100%' }}>
                    <MetricsCards metrics={dynamicMetrics} />
                </Box>

                {/* VMS Displays and Analytics Side by Side */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center', // Center the components
                    gap: 2,
                    width: '90%', // Match the width of other components
                    mx: 'auto' // Center the container
                }}>
                    {/* Current VMS Displays */}
                    <Box sx={{
                        width: '50%', // Set to 45% to match component internal width
                        borderRadius: 1,
                        p: 2
                        // Removed bgcolor: 'background.paper' and boxShadow: 1
                    }}>
                        <CurrentVMSDisplays displays={filteredDisplays} />
                    </Box>

                    {/* Analytics Dashboard */}
                    <Box sx={{
                        width: '50%', // Set to 45% to match component internal width
                        borderRadius: 1,
                        p: 2
                        // Removed bgcolor: 'background.paper' and boxShadow: 1
                    }}>
                        <AnalyticsDashboard
                            statusDistribution={analyticsData?.statusDistribution || []}
                            zoneDistribution={analyticsData?.zoneDistribution || []}
                        />
                    </Box>
                </Box>
            </Container>
        </Box>
    );

}

export default Dashboard;

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

dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import ProjectsOverview from '../components/ProjectsOverview';
import MetricsCards from '../components/MetricsCards';
import CurrentVMSDisplays from '../components/CurrentVMSDisplays';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

function Dashboard({ data }) {
const [selectedProjectId, setSelectedProjectId] = useState(null);
const [analyticsData, setAnalyticsData] = useState(null);

    // Simple data initialization with nullish coalescing
    const projects = data.projects || [];
    const vmsDisplays = data.vmsDisplays || [];
    const metricDefinitions = data.metricDefinitions || [];

    // Calculate analytics when VMS displays change
    useEffect(() => {
        if (vmsDisplays.length === 0) return;

        // Simple object to store status counts
        let statusCounts = {};
        let zoneCounts = {};

        // Count status and zones using simple for loop
        for (let display of vmsDisplays) {
            // Count statuses
            let status = display.status.toLowerCase();
            if (statusCounts[status]) {
                statusCounts[status]++;
            } else {
                statusCounts[status] = 1;
            }

            // Count zones
            let zone = display.zone;
            if (zoneCounts[zone]) {
                zoneCounts[zone]++;
            } else {
                zoneCounts[zone] = 1;
            }
        }

        // Create status distribution using simple mapping
        let statusDistribution = [];
        for (let item of data.analytics.statusDistribution) {
            statusDistribution.push({
                name: item.name,
                color: item.color,
                count: statusCounts[item.name.toLowerCase()] || 0,
                value: statusCounts[item.name.toLowerCase()] || 0
            });
        }

        // Create zone distribution using simple mapping
        let zoneDistribution = [];
        for (let item of data.analytics.zoneDistribution) {
            zoneDistribution.push({
                name: item.name,
                color: item.color,
                count: zoneCounts[item.name] || 0,
                value: zoneCounts[item.name] || 0
            });
        }

        // Update analytics data
        setAnalyticsData({
            statusDistribution,
            zoneDistribution
        });
    }, [vmsDisplays, data.analytics]);

    // Simple project click handler
    function handleProjectClick(projectId) {
        setSelectedProjectId(projectId);
    }

    // Filter displays using simple if statement
    let filteredDisplays = [];
    if (selectedProjectId) {
        for (let display of vmsDisplays) {
            if (display.projectId === selectedProjectId) {
                filteredDisplays.push(display);
            }
        }
    } else {
        filteredDisplays = vmsDisplays;
    }

    // Calculate metrics using simple loops and if-else
    let dynamicMetrics = [];
    for (let def of metricDefinitions) {
        let value = 0;
        let allStatuses = [];

        // Get all statuses
        for (let display of vmsDisplays) {
            if (display.status) {
                allStatuses.push(display.status.toLowerCase());
            }
        }

        // Calculate value based on type
        if (def.type === "total") {
            value = vmsDisplays.length;
        } else if (def.type === "status") {
            // Count matching statuses
            for (let status of allStatuses) {
                if (status === def.match.toLowerCase()) {
                    value++;
                }
            }
        } else if (def.type === "status-multiple") {
            // Count multiple matching statuses
            for (let status of allStatuses) {
                let matches = def.matches.map(m => m.toLowerCase());
                if (matches.includes(status)) {
                    value++;
                }
            }
        }

        // Create metric object
        dynamicMetrics.push({
            id: def.id,
            title: def.title,
            value: value,
            change: 0,
            changeType: def.changeType,
            icon: def.icon
        });
    }

    // Simple loading check
    if (!analyticsData) {
        return <Typography variant="h6">Loading Analytics...</Typography>;
    }

    return (
        <Box sx={{
            flexGrow: 1,
            width: '100vw', // Full viewport width
            minHeight: '100vh',
            bgcolor: '#f5f5f5',
            margin: 0,
            padding: 0
        }}>
            <Container
                maxWidth={false}
                disableGutters // Removes default padding
                sx={{
                    py: 3,
                    px: 3, // Consistent padding
                    margin: 0,
                    width: '100%'
                }}
            >
                {/* Projects Overview */}
                <Box mb={1.7} sx={{ width: '100%' }}>
                    <ProjectsOverview projects={projects} onProjectClick={handleProjectClick} />
                </Box>

                {/* Metrics Cards */}
                <Box mb={1.7} sx={{ width: '100%' }}>
                    <MetricsCards metrics={dynamicMetrics} />
                </Box>

                {/* VMS Displays and Analytics Side by Side */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center', // Center the components
                    gap: 2,
                    width: '90%', // Match the width of other components
                    mx: 'auto' // Center the container
                }}>
                    {/* Current VMS Displays */}
                    <Box sx={{
                        width: '50%', // Set to 45% to match component internal width
                        borderRadius: 1,
                        p: 2
                        // Removed bgcolor: 'background.paper' and boxShadow: 1
                    }}>
                        <CurrentVMSDisplays displays={filteredDisplays} />
                    </Box>

                    {/* Analytics Dashboard */}
                    <Box sx={{
                        width: '50%', // Set to 45% to match component internal width
                        borderRadius: 1,
                        p: 2
                        // Removed bgcolor: 'background.paper' and boxShadow: 1
                    }}>
                        <AnalyticsDashboard
                            statusDistribution={analyticsData?.statusDistribution || []}
                            zoneDistribution={analyticsData?.zoneDistribution || []}
                        />
                    </Box>
                </Box>
            </Container>
        </Box>
    );

}

export default Dashboard;

"metricDefinitions": [
{
"id": 1,
"title": "Total VMS Boards",
"type": "total",
"icon": "monitor",
"changeType": "neutral"
},
{
"id": 2,
"title": "Online",
"type": "status",
"match": "online",
"icon": "monitor",
"changeType": "increase"
},
{
"id": 3,
"title": "Offline",
"type": "status",
"match": "offline",
"icon": "monitor",
"changeType": "decrease"
},
{
"id": 4,
"title": "Needs Attention",
"type": "status-multiple",
"matches": ["faulty", "maintenance"],
"icon": "alert-triangle",
"changeType": "neutral"
}
],
