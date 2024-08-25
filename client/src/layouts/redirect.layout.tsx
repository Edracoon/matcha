// Auth Layout to protect routes from already logged users,
// and redirect them to the home View or the verify-account View if their email is not validated
// This layout will be used for all the routes like login and register that require no authentication

import { useEffect, useState } from 'react';	
import { useAuth } from '../contexts/authProvider';
import { useNavigate } from 'react-router-dom';
import { NotifType, showNotification } from '../components/Notif';

export default function RedirectLayout({ children }: { children: React.ReactNode }) {
	const { isLogged, user } = useAuth();
	const uNavigate = useNavigate();

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function checkLogged() {

			setLoading(true);

			const islogged = await isLogged();

			setLoading(false);

			// If the user is not logged in, we don't need to redirect him
			if (!islogged) return ;
		
			if (user?.emailValidated == false && window.location.pathname.startsWith("/verify-account") === false) {
				showNotification(NotifType.INFO, "Please verify your email to continue", "");
				return uNavigate("/verify-account");
			} else if (user?.emailValidated == true) {
				return uNavigate("/home");
			}
		}

		checkLogged();
	}, [user?.emailValidated]);

	return (
		<>
			{ loading ? <></> : children}
		</>
	);
}