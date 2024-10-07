// src/components/Profile.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css'; // Import your CSS file for styling

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log("Fetching user data..."); // Debugging
                const response = await fetch('http://localhost:5000/api/auth/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Get token from local storage
                    },
                });

                if (!response.ok) {
                    console.log("Response not OK:", response.status, response.statusText); // Debugging
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                console.log("User data fetched successfully:", data); // Debugging
                setUser(data); // Set user data
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Failed to fetch user data. Please try again later.");
            }
        };

        fetchUserData();
    }, [navigate]);

    if (error) {
        return <div className="error">{error}</div>; // Display error message
    }

    if (!user) {
        return <div className="loading">Loading...</div>; // Optional loading state
    }

    return (
        <div className="profile-container">
            <h2 className="profile-heading">Profile Details</h2>
            <div className="profile-info">
                <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                {/* Add more user fields as necessary */}
            </div>
        </div>
    );
};

export default Profile;
