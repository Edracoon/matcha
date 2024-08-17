// import { useState, useEffect } from 'react';
// import { showNotification } from '../components/Notif';
// import apiService from '../services/apiService';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/authProvider';
import Navbar from '../components/Navbar';

export default function HomePage() {

	// const { user, logout } = useAuth();

	return (
		<>
			<Navbar />
			<h1>Home</h1>
		</>
	);
}