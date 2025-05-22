# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

import { Box, Typography, Grid, Paper, Chip } from '@mui/material';
import { useEffect, useState } from 'react';

const ProjectsOverview = ({ projects, onProjectClick }) => {
const [selectedProjectId, setSelectedProjectId] = useState(null);

    useEffect(() => {
        // Select first project on initial load if projects exist
        if (projects.length > 0 && !selectedProjectId) {
            setSelectedProjectId(projects[0].id);
            onProjectClick(projects[0].id);
        }
    }, [projects]);

    const handleProjectClick = (projectId) => {
        setSelectedProjectId(projectId);
        onProjectClick(projectId);
    };

    return (
        <Box
            sx={{
                width: '100%',
                borderRadius: 2,
                p: 1,
                mx: 'auto',
                my: 0,
                maxWidth: '90%'
            }}
        >
            <Typography
                variant="h6" // Changed from h5 to h6
                fontWeight="bold"
                sx={{
                    mb: 1,
                    fontSize: '1.7rem' // Reduced font size
                }}
            >
                Projects Overview
            </Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                width: '100%',
                overflowX: 'auto'
            }}>
                {projects.map((project) => (
                    <Paper
                        key={project.id}
                        elevation={0} // Changed from 1 to 0
                        sx={{
                            p: 1.5,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            minHeight: '90px', // Reduced from 100px
                            minWidth: '250px',
                            flex: '1 0 0',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 2, // Increased border radius
                            border: project.id === selectedProjectId
                                ? '2px solid #000'
                                : '1px solid #e0e0e0', // Added light border
                            backgroundColor: '#ffffff',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)' // Softer shadow
                            }
                        }}
                        onClick={() => handleProjectClick(project.id)}
                    >
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center', // Changed from flex-start
                            mb: 1
                        }}>
                            <Typography
                                fontWeight="600" // Changed from bold
                                variant="subtitle2" // Changed from subtitle1
                                sx={{
                                    fontSize: '0.95rem', // Reduced from 1.125rem
                                    lineHeight: 1.4,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1
                                }}
                            >
                                {project.title}
                            </Typography>
                            <Chip
                                label={project.status}
                                color={project.statusColor}
                                size="small"
                                sx={{
                                    ml: 1,
                                    height: '22px', // Reduced chip height
                                    '& .MuiChip-label': {
                                        fontSize: '0.7rem', // Smaller font for chip
                                        px: 1
                                    }
                                }}
                            />
                        </Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                fontSize: '0.75rem', // Smaller font for description
                                opacity: 0.8
                            }}
                        >
                            Click to view VMS signs
                        </Typography>
                    </Paper>
                ))}
            </Box>
        </Box>
    );

};

export default ProjectsOverview;

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
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

        // Count status and zones using traditional for loop
        for (let i = 0; i < vmsDisplays.length; i++) {
            let display = vmsDisplays[i];
            let status = display.status.toLowerCase();
            let zone = display.zone;

            // Count statuses
            if (statusCounts[status]) {
                statusCounts[status]++;
            } else {
                statusCounts[status] = 1;
            }

            // Count zones
            if (zoneCounts[zone]) {
                zoneCounts[zone]++;
            } else {
                zoneCounts[zone] = 1;
            }
        }

        // Create status distribution using traditional for loop
        let statusDistribution = [];
        for (let i = 0; i < data.analytics.statusDistribution.length; i++) {
            let item = data.analytics.statusDistribution[i];
            statusDistribution.push({
                name: item.name,
                color: item.color,
                count: statusCounts[item.name.toLowerCase()] || 0,
                value: statusCounts[item.name.toLowerCase()] || 0
            });
        }

        // Create zone distribution using traditional for loop
        let zoneDistribution = [];
        for (let i = 0; i < data.analytics.zoneDistribution.length; i++) {
            let item = data.analytics.zoneDistribution[i];
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

    // Filter displays using if-else
    let filteredDisplays = [];
    if (selectedProjectId) {
        for (let i = 0; i < vmsDisplays.length; i++) {
            if (vmsDisplays[i].projectId === selectedProjectId) {
                filteredDisplays.push(vmsDisplays[i]);
            }
        }
    } else {
        filteredDisplays = vmsDisplays;
    }

    // Calculate metrics using traditional for loops
    let dynamicMetrics = [];
    for (let i = 0; i < metricDefinitions.length; i++) {
        let def = metricDefinitions[i];
        let value = 0;
        let allStatuses = [];

        // Get all statuses
        for (let j = 0; j < vmsDisplays.length; j++) {
            if (vmsDisplays[j].status) {
                allStatuses.push(vmsDisplays[j].status.toLowerCase());
            }
        }

        // Calculate value based on type
        if (def.type === "total") {
            value = vmsDisplays.length;
        } else if (def.type === "status") {
            for (let k = 0; k < allStatuses.length; k++) {
                if (allStatuses[k] === def.match.toLowerCase()) {
                    value++;
                }
            }
        } else if (def.type === "status-multiple") {
            for (let k = 0; k < allStatuses.length; k++) {
                let status = allStatuses[k];
                let isMatch = false;
                for (let m = 0; m < def.matches.length; m++) {
                    if (status === def.matches[m].toLowerCase()) {
                        isMatch = true;
                        break;
                    }
                }
                if (isMatch) {
                    value++;
                }
            }
        }

        dynamicMetrics.push({
            id: def.id,
            title: def.title,
            value: value,
            change: 0,
            changeType: def.changeType,
            icon: def.icon
        });
    }

    // Simple loading states
    const isMetricsDataValid = dynamicMetrics && dynamicMetrics.length > 0;
    const isDisplaysDataValid = filteredDisplays && filteredDisplays.length > 0;
    const isAnalyticsDataValid = analyticsData &&
        analyticsData.statusDistribution &&
        analyticsData.zoneDistribution;

    // Simple error component
    const NoDataMessage = ({ title }) => (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                textAlign: 'center',
                border: '1px dashed #ccc',
                borderRadius: 2,
                bgcolor: '#fafafa'
            }}
        >
            <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mb: 1 }}
            >
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                No data available at the moment. Please try again later.
            </Typography>
        </Paper>
    );

    return (
        <Box sx={{
            flexGrow: 1,
            width: '100%', // Changed from 100vw to 100%
            minHeight: '100vh',
            bgcolor: '#f5f5f5',
            margin: 0,
            padding: 0,
            overflowX: 'hidden' // Added to prevent horizontal scroll
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

                {/* Metrics Cards with Error Handling */}
                <Box mb={1.7} sx={{ width: '100%' }}>
                    {isMetricsDataValid ? (
                        <MetricsCards metrics={dynamicMetrics} />
                    ) : (
                        <NoDataMessage title="Metrics Overview" />
                    )}
                </Box>

                {/* VMS Displays and Analytics Side by Side */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center', // Center the components
                    gap: 2,
                    width: '90%', // Changed from 90% to 100%
                    mx: 'auto' // Center the container
                }}>
                    {/* Current VMS Displays with Error Handling */}
                    <Box sx={{
                        width: '50%', // Set to 45% to match component internal width
                        borderRadius: 1,
                        p: 2
                        // Removed bgcolor: 'background.paper' and boxShadow: 1
                    }}>
                        {isDisplaysDataValid ? (
                            <CurrentVMSDisplays displays={filteredDisplays} />
                        ) : (
                            <NoDataMessage title="VMS Displays" />
                        )}
                    </Box>

                    {/* Analytics Dashboard with Error Handling */}
                    <Box sx={{
                        width: '50%', // Set to 45% to match component internal width
                        borderRadius: 1,
                        p: 2
                        // Removed bgcolor: 'background.paper' and boxShadow: 1
                    }}>
                        {isAnalyticsDataValid ? (
                            <AnalyticsDashboard
                                statusDistribution={analyticsData.statusDistribution}
                                zoneDistribution={analyticsData.zoneDistribution}
                            />
                        ) : (
                            <NoDataMessage title="Analytics Dashboard" />
                        )}
                    </Box>
                </Box>
            </Container>
        </Box>
    );

}

export default Dashboard;
