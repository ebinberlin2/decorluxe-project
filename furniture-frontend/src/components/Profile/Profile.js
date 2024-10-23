// src/components/Profile.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Paper,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
    CssBaseline,
    createTheme,
    ThemeProvider,
} from '@mui/material';

const theme = createTheme({
    palette: {
        mode: 'dark', // Set to dark theme
    },
});

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [state, setState] = useState('');
    const [phone, setPhone] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/auth/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/login');
                    } else {
                        throw new Error('Failed to fetch user data');
                    }
                }

                const data = await response.json();
                setUser(data);
                setFullName(`${data.firstName} ${data.lastName}`);
                setAddress(data.address || '');
                setCity(data.city || '');
                setDistrict(data.district || '');
                setState(data.state || '');
                setPhone(data.phone || '');
                setDateOfBirth(data.dateOfBirth || '');
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Failed to fetch user data. Please try again later.");
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/userDetails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({
                    userId: user.id,
                    fullName,
                    address,
                    city,
                    district,
                    state,
                    phone,
                    dateOfBirth,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save user details');
            }

            alert("User details saved successfully!");
        } catch (error) {
            console.error("Error saving user details:", error);
            setError("Failed to save user details. Please try again later.");
        }
    };

    if (error) {
        return <Typography color="error" align="center">{error}</Typography>;
    }

    if (!user) {
        return <Typography color="warning" align="center">Loading...</Typography>;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container component="main" maxWidth={false} sx={{ height: '100vh', padding: 0 }}>
                <Grid container spacing={2} sx={{ height: '100%' }}>
                    <Grid item xs={12} md={3}>
                        <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
                            <Typography variant="h6" align="center">Profile Menu</Typography>
                            <Divider />
                            <List>
                                <ListItem button>
                                    <ListItemText primary="Profile Details" />
                                </ListItem>
                                <Divider />
                                <ListItem button>
                                    <ListItemText primary="Order History" />
                                </ListItem>
                                <Divider />
                                <ListItem button>
                                    <ListItemText primary="Settings" />
                                </ListItem>
                                <Divider />
                                <ListItem button onClick={handleLogout}>
                                    <ListItemText primary="Logout" sx={{ color: 'red' }} />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Paper elevation={3} sx={{ padding: 3, height: '100%' }}>
                            <Typography variant="h5" align="center">Profile Details</Typography>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Full Name"
                                    variant="outlined"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Address"
                                    variant="outlined"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="City"
                                    variant="outlined"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="District"
                                    variant="outlined"
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="State"
                                    variant="outlined"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Phone"
                                    variant="outlined"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Date of Birth"
                                    type="date"
                                    variant="outlined"
                                    value={dateOfBirth}
                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
                                    Save Details
                                </Button>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
};

export default Profile;
