import { useState, useEffect } from 'react';
import { showNotification } from '../components/Notif';
import apiService from '../services/apiService';
// import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authProvider';
import Navbar from '../components/Navbar';
import { useSearchParams } from 'react-router-dom';
import UserCard, { UserType } from '../components/UserCard';

export default function HomeView() {

	const { cookies } = useAuth();

	const [_, setSearchParams] = useSearchParams();
	const [loading, setLoading] = useState(true);
	const [users, setUsers] = useState<UserType[]>([]);

	useEffect(() => {
		setLoading(true);
		apiService({
			method: 'POST',
			path: '/search',
			token: cookies.accessToken,
			onSuccess: (data) => {
				setUsers(data.users);
				setLoading(false);
			},
			onError: () => { }
		})
	}, []);

	return (
		<>
			<Navbar />
			<div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
				{loading && <div>Loading...</div>}
				{!loading && users.map((u: UserType) => (
					<UserCard key={u.id} user={u} />
				))}
   			</div>
		</>
	);
}