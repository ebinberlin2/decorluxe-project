// src/components/Profile.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './Profile.css'; // Import your custom CSS file for additional styling

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [address, setAddress] = useState('');
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
                    address,
                    phone,
                    dateOfBirth,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save user details');
            }

            setAddress('');
            setPhone('');
            setDateOfBirth('');
            alert("User details saved successfully!");
        } catch (error) {
            console.error("Error saving user details:", error);
            setError("Failed to save user details. Please try again later.");
        }
    };

    if (error) {
        return <div className="alert alert-danger text-center">{error}</div>;
    }

    if (!user) {
        return <div className="text-warning text-center">Loading...</div>;
    }

    return (
        <div className="container mt-5 profile-container">
            <div className="card shadow-sm">
                <div className="card-header text-center">
                    <h2>Profile Details</h2>
                </div>
                <div className="card-body">
                    <h5 className="card-title">User Information</h5>
                    <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>

                    <form onSubmit={handleSubmit}>
                        <h5 className="mt-4">Add User Details</h5>
                        <div className="mb-3">
                            <label className="form-label">Address:</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={address} 
                                onChange={(e) => setAddress(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Phone:</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Date of Birth:</label>
                            <input 
                                type="date" 
                                className="form-control" 
                                value={dateOfBirth} 
                                onChange={(e) => setDateOfBirth(e.target.value)} 
                            />
                        </div>
                        <button type="submit" className="btn btn-success">Save Details</button>
                    </form>
                    <button className="btn btn-outline-danger mt-3" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
