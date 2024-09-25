import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'

import './App.css'

import ProtectedLayout from './layouts/protected.layout'
import RedirectLayout from './layouts/redirect.layout'
import LoginView from './pages/Login.view.tsx'
import RegisterView from './pages/Register.view'
import VerifyAccountView from './pages/VerifyAccount.view'
import HomeView from './pages/Home.view'
import MyProfileView from './pages/MyProfile.view'
import NotFound404View from './pages/404.view'
import ProfileView from './pages/Profile.view'
import MatchsView from './pages/Matchs.view'
import ChatView from './pages/Chat.view'
import ProfileSteps from './pages/ProfileSteps/ProfileSteps.view'

// Socket.io
import { socket } from './socket';

function App() {

	useEffect(() => {
		socket.on('connect', () => {
			console.log('[socketIO] Connected to server');
		});

		socket.on('disconnect', () => {
			console.log('[socketIO] Disconnected from server');
		});
	}, []);

	return (
		<>
			<Routes>
				{/* Login */}
				<Route path="/" element={<RedirectLayout> <LoginView /> </RedirectLayout>}/>
				
				{/* Register */}
				<Route path="/register" element={<RedirectLayout> <RegisterView /> </RedirectLayout>} />
				
				{/* VerifyAccount */}
				<Route path="/verify-account" element={<ProtectedLayout> <VerifyAccountView /> </ProtectedLayout>} />
				
				{/* Profile Steps Completion */}
				<Route path="/profile-steps" element={<ProtectedLayout> <ProfileSteps /> </ProtectedLayout>} />

				{/* Home */}
				<Route path="/home" element={<ProtectedLayout> <HomeView /> </ProtectedLayout>} />
				
				{/* Matchs */}
				<Route path="/matchs" element={<ProtectedLayout> <MatchsView /> </ProtectedLayout>} />

				{/* Chat */}
				<Route path="/chat" element={<ProtectedLayout> <ChatView /> </ProtectedLayout>} />
				
				{/* My Profile */}
				<Route path="/my-profile" element={<ProtectedLayout> <MyProfileView /> </ProtectedLayout>} />
				
				{/* Profile */}
				<Route path="/profile/:id" element={<ProtectedLayout> <ProfileView /> </ProtectedLayout>} />

				{/* 404 */}
				<Route path="*" element={<NotFound404View />} />
			</Routes>
		</>
	)
}

export default App
