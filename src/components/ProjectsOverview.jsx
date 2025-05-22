import { Box, Typography, Grid, Paper, Chip } from '@mui/material';
import { useEffect } from 'react';

const ProjectsOverview = ({ projects, onProjectClick, selectedProjectId }) => {
    useEffect(() => {
        if (projects.length > 0 && !selectedProjectId) {
            onProjectClick(projects[0].id);
        }
    }, [projects]);

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
                variant="h6"
                fontWeight="bold"
                sx={{
                    mb: 1,
                    fontSize: '1.7rem'
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
                        elevation={0}
                        sx={{
                            p: 1.5,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            minHeight: '90px',
                            minWidth: '250px',
                            flex: '1 0 0',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 2,
                            border: project.id === selectedProjectId
                                ? '2px solid #000'
                                : '1px solid #e0e0e0',
                            backgroundColor: '#ffffff',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }
                        }}
                        onClick={() => onProjectClick(project.id)}
                    >
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1
                        }}>
                            <Typography
                                fontWeight="600"
                                variant="subtitle2"
                                sx={{
                                    fontSize: '0.95rem',
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
                                    height: '22px',
                                    '& .MuiChip-label': {
                                        fontSize: '0.7rem',
                                        px: 1
                                    }
                                }}
                            />
                        </Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                fontSize: '0.75rem',
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
