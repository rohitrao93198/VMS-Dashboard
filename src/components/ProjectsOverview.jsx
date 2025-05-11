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
