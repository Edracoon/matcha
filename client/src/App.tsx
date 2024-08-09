import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import VerifyAccount from './pages/VerifyAccount.tsx'
import Home from './pages/Home.tsx'

import './App.css'

import ProtectedLayout from './layouts/protected.layout.tsx'
import RedirectLayout from './layouts/redirect.layout.tsx'

function App() {
	return (
		<>
			<Routes>
				{/* Login */}
				<Route path="/" element={<RedirectLayout> <Login /> </RedirectLayout>}/>
				{/* Register */}
				<Route path="/register" element={<RedirectLayout> <Register /> </RedirectLayout>} />
				{/* VerifyAccount */}
				<Route path="/verify-account" element={<ProtectedLayout> <VerifyAccount /> </ProtectedLayout>} />
				{/* Home */}
				<Route path="/home" element={<ProtectedLayout> <Home /> </ProtectedLayout>} />

				{/* <Route path="/profile/:id" element={<Profile />} /> */}
			</Routes>
		</>
	)
}

export default App
