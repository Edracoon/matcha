// Auth Layout to protect routes from unauthorized access
// This layout will be used for all the routes that require authentication

import { useEffect , useState} from 'react';	
import { useAuth } from '../contexts/authProvider';
import { useNavigate } from 'react-router-dom';
import { showNotification, NotifType } from '../components/Notif';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
	const { isLogged, isProfileNotComplete, user } = useAuth();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function checkLogged() {

			setLoading(true);

			const islogged = await isLogged();
			const isNotComplete = await isProfileNotComplete();

			setLoading(false);

			if (!islogged)
				navigate("/");

			else if (user?.emailValidated == false && window.location.pathname.startsWith("/verify-account") === false) {
				showNotification(NotifType.INFO, "Please verify your email to continue", "")
				navigate("/verify-account");
			}

			else if (isNotComplete) {
				navigate("/profile-steps?step=" + isNotComplete.key);
			}

			else if (user?.emailValidated == true && window.location.pathname.startsWith("/verify-account") === true) {
				navigate("/home");
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