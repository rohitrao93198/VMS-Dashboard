import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Logo from '../assets/logo.jpg';

const Navbar = () => {
    return (
        <AppBar position="sticky" sx={{ width: '100%', height: '60px', mb: -2 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', padding: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        src={Logo}
                        alt="Logo"
                        sx={{ width: 40, height: 40, marginRight: 2 }}
                    />
                    <Typography variant="h6" fontWeight="bold">
                        VMS Dashboard
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton color="inherit" sx={{ marginRight: 2 }}>
                        <Badge color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <IconButton color="inherit" sx={{ marginRight: 2 }}>
                        <SettingsIcon />
                    </IconButton>

                    <IconButton color="inherit">
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                            <AccountCircleIcon />
                        </Avatar>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
