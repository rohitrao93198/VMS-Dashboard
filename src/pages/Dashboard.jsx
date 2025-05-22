import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
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
        if (vmsDisplays.length === 0) return;

        let statusCounts = {};
        let zoneCounts = {};

        for (let i = 0; i < vmsDisplays.length; i++) {
            let display = vmsDisplays[i];
            let status = display.status.toLowerCase();
            let zone = display.zone;

            if (statusCounts[status]) {
                statusCounts[status]++;
            } else {
                statusCounts[status] = 1;
            }

            if (zoneCounts[zone]) {
                zoneCounts[zone]++;
            } else {
                zoneCounts[zone] = 1;
            }
        }

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

        setAnalyticsData({
            statusDistribution,
            zoneDistribution
        });
    }, [vmsDisplays, data.analytics]);

    function handleProjectClick(projectId) {
        setSelectedProjectId(projectId);
    }

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

    let dynamicMetrics = [];
    for (let i = 0; i < metricDefinitions.length; i++) {
        let def = metricDefinitions[i];
        let value = 0;
        let allStatuses = [];

        for (let j = 0; j < vmsDisplays.length; j++) {
            if (vmsDisplays[j].status) {
                allStatuses.push(vmsDisplays[j].status.toLowerCase());
            }
        }

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
            width: '100%',
            minHeight: '100vh',
            bgcolor: '#f5f5f5',
            margin: 0,
            padding: 0,
            overflowX: 'hidden'
        }}>
            <Container
                maxWidth={false}
                disableGutters
                sx={{
                    py: 3,
                    px: 3,
                    margin: 0,
                    width: '100%'
                }}
            >
                <Box mb={1.7} sx={{ width: '100%' }}>
                    <ProjectsOverview
                        projects={projects}
                        onProjectClick={handleProjectClick}
                        selectedProjectId={selectedProjectId}
                    />
                </Box>

                <Box mb={1.7} sx={{ width: '100%' }}>
                    {isMetricsDataValid ? (
                        <MetricsCards metrics={dynamicMetrics} />
                    ) : (
                        <NoDataMessage title="Metrics Overview" />
                    )}
                </Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    width: '90%',
                    mx: 'auto'
                }}>
                    <Box sx={{
                        width: '50%',
                        borderRadius: 1,
                        p: 2
                    }}>
                        {isDisplaysDataValid ? (
                            <CurrentVMSDisplays displays={filteredDisplays} />
                        ) : (
                            <NoDataMessage title="VMS Displays" />
                        )}
                    </Box>

                    <Box sx={{
                        width: '50%',
                        borderRadius: 1,
                        p: 2
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
