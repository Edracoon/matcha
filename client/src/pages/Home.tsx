import { useState, useEffect } from 'react';
import { showNotification } from '../components/Notif';
import apiService from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authProvider';

export default function Home() {

	const { user, logout } = useAuth();

	useEffect(() => {
		console.log("User: ", user);
	}, []);

	return (
		<>
			<h1>Home</h1>
			<button onClick={logout}>Logout</button>
		</>
	);
}