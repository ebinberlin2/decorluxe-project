import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { GoHeart } from "react-icons/go";
import { IoBagHandleOutline } from "react-icons/io5";
import { AiOutlineSearch } from "react-icons/ai";
import logo1 from '../assets/logo1.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';
import { useNavigate } from 'react-router-dom';



const Dropdown = ({ isOpen, toggleDropdown, loggedIn, handleLogout }) => (
    <div className="dropdown-container">
        <div className="dropbtn" onClick={toggleDropdown}>
            <CgProfile size={20} />
            <span className="icon-label">PROFILE</span>
        </div>
        {isOpen && (
            <div className="dropdown-content">
                {loggedIn ? (
                    <>
                        <button onClick={handleLogout} className="dropdown-item">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="dropdown-item">Login</Link>
                        <Link to="/signup" className="dropdown-item">Signup</Link>
                    </>
                )}
            </div>
        )}
    </div>
);

const Header = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Check login status from localStorage on component mount
    useEffect(() => {
        const isLoggedIn = !!localStorage.getItem('authToken');  // Auth token stored in localStorage
        setLoggedIn(isLoggedIn);
    }, []);

    // Handle logout functionality
    const handleLogout = () => {
        localStorage.removeItem('authToken');  // Remove the auth token from localStorage
        setLoggedIn(false);  // Update the state to reflect the user is logged out
        navigate('/login');
    };

    return (
        <header className="header-container navbar navbar-expand-lg navbar-light">
            <div className="container d-flex align-items-center justify-content-between">
                {/* Left Side: Logo */}
                <div className="navbar-brand">
                    <Link to="/" className="logo-link">
                        <img src={logo1} alt="Company Logo" className="logo" />
                    </Link>
                </div>

                {/* Center: Navigation Links */}
                <nav className="navbar-nav mx-auto">
                    <ul className="nav d-flex align-items-center">
                        <li className="nav-item">
                            <Link to="/products" className="nav-link">FURNITURE</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/lighting" className="nav-link">LIGHTING</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/decoration" className="nav-link">DECORATION</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/beds" className="nav-link">BEDS & MATTRESSES</Link>
                        </li>
                    </ul>
                </nav>

                {/* Right Side: Search Bar and Icons */}
                <div className="d-flex align-items-center">
                    <form className="search-bar">
                        <AiOutlineSearch size={20} className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search for products, brands and more"
                        />
                    </form>
                    <ul className="navbar-nav ml-auto d-flex align-items-center">
                        <li className="nav-item text-center">
                            <Dropdown
                                isOpen={isDropdownOpen}
                                toggleDropdown={toggleDropdown}
                                loggedIn={loggedIn}
                                handleLogout={handleLogout}
                            />
                        </li>
                        <li className="nav-item text-center">
                            <Link to="/wishlist" className="nav-link">
                                <GoHeart size={20} />
                                <span className="icon-label">Wishlist</span>
                            </Link>
                        </li>
                        <li className="nav-item text-center">
                            <Link to="/cart" className="nav-link">
                                <IoBagHandleOutline size={20} />
                                <span className="icon-label">Bag</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header;
