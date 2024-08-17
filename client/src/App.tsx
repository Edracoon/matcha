import { Routes, Route } from 'react-router-dom'
import './App.css'

import ProtectedLayout from './layouts/protected.layout.tsx'
import RedirectLayout from './layouts/redirect.layout.tsx'
import LoginPage from './pages/Login.tsx'
import RegisterPage from './pages/Register.tsx'
import VerifyAccountPage from './pages/VerifyAccount.tsx'
import HomePage from './pages/Home.tsx'
import MyProfilePage from './pages/MyProfile.tsx'
import NotFound404Page from './pages/404.tsx'
import ProfilePage from './pages/Profile.tsx'
import MatchsPage from './pages/Matchs.tsx'
import ChatPage from './pages/Chat.tsx'

function App() {
	return (
		<>
			<Routes>
				{/* Login */}
				<Route path="/" element={<RedirectLayout> <LoginPage /> </RedirectLayout>}/>
				
				{/* Register */}
				<Route path="/register" element={<RedirectLayout> <RegisterPage /> </RedirectLayout>} />
				
				{/* VerifyAccount */}
				<Route path="/verify-account" element={<ProtectedLayout> <VerifyAccountPage /> </ProtectedLayout>} />
				
				{/* Home */}
				<Route path="/home" element={<ProtectedLayout> <HomePage /> </ProtectedLayout>} />
				
				{/* Matchs */}
				<Route path="/matchs" element={<ProtectedLayout> <MatchsPage /> </ProtectedLayout>} />

				{/* Chat */}
				<Route path="/chat" element={<ProtectedLayout> <ChatPage /> </ProtectedLayout>} />
				
				{/* My Profile */}
				<Route path="/my-profile" element={<ProtectedLayout> <MyProfilePage /> </ProtectedLayout>} />
				
				{/* Profile */}
				<Route path="/profile/:id" element={<ProtectedLayout> <ProfilePage /> </ProtectedLayout>} />

				{/* 404 */}
				<Route path="*" element={<NotFound404Page />} />
			</Routes>
		</>
	)
}

export default App
