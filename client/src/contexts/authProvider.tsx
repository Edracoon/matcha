import { createContext, useContext, useState, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { showNotification, NotifType } from '../components/Notif';
import { ReactNode } from 'react';

import apiService from '../services/apiService';

interface User {
	id: number,
	bio: string,
	gender: string,
	city: string,
	country: string,
	email: string,
	emailValidated: boolean,
	firstname: string,
	lastname: string,
	wantToMeet: string,
	username: string,
	longitude: number,
	latitude: number,
}

type ProfileNotComplete = {
	key: string,
	message: string
} | null;

interface AuthContextType {
	user: User | undefined,
	cookies: { [key: string]: string },
	login: (username: string, password: string) => Promise<unknown>,
	logout: () => void,
	register: (data: { email: string, firstname: string, lastname: string, age: number, username: string, password: string, confirmPassword: string }) => void,
	confirmEmailWithCode: () => {},
	isLogged: () => Promise<boolean>,
	isProfileNotComplete: () => Promise<ProfileNotComplete>
}

const AuthContext = createContext<AuthContextType>({
	user: undefined,
	cookies: {},
	login: async () => {},
	logout: () => {},
	register: async () => {},
	confirmEmailWithCode: async () => {},
	isLogged: async () => false,
	isProfileNotComplete: async () => null
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [cookies, setCookies, removeCookie] = useCookies();
	const [user, setUser] = useState<User | undefined>(undefined);

	const login = async (username: string, password: string ) => {
		await apiService({
			method: "POST",
			path: "/auth/sign-in",
			token: cookies.accessToken,
			options: { data: { username, password } },
			onSuccess: (data) => {
				setCookies('accessToken', data.accessToken);
				setUser(data.user);
				showNotification(NotifType.SUCCESS, "You are logged in !", "");
				if (!data.user.emailValidated)
					return navigate('/verify-account');
				navigate('/home');
			},
			onError: (error) => {
				console.log(error);
				return showNotification(NotifType.ERROR, "Error", error.data.error);
			}
		});
	};

    const logout = () => {
        ['accessToken'].forEach(str => removeCookie(str)); // remove data save in cookies
		setUser(undefined);
        navigate('/');
    };

	const register = (
		{ email, firstname, lastname, age, username, password, confirmPassword }:
		{ email: string, firstname: string, lastname: string, age: number, username: string, password: string, confirmPassword: string }
	) => {
		apiService({
			method: "POST",
			path: "/auth/sign-up",
			options: { data: { email, firstname, lastname, age, username, password, confirmPassword } },
			onSuccess: (data) => {
				console.log(data);
				setUser(data.user);
				setCookies('accessToken', data.accessToken);
				showNotification(NotifType.SUCCESS, "Successfully registered !", "");
				navigate("/verify-account");
			},
			onError: (error) => {
				console.log("onError: ", error);
				showNotification(NotifType.ERROR, "Couldn't register", error.data.error);
			},
		});
	}

	const confirmEmailWithCode = async (emailValidationCode: string) => {
		await apiService({
			method: "POST",
			path: "/auth/confirm-email",
			token: cookies.accessToken,
			options: { data: { emailValidationCode } },
			onSuccess: (data) => {
				console.log(data);
				showNotification(NotifType.SUCCESS, 'Welcome to Matcha !', 'You can now complete your profile');
				navigate("/profile-steps?step=1");
			},
			onError: (error) => {
				console.log("onError: ", error);
				showNotification(NotifType.ERROR, "Wrong code", error.data.error);
			},
		})
	}

	const isLogged = async () => {
		let logged = false;
		await apiService({
			method: "GET",
			path: "/auth/verify-token",
			token: cookies.accessToken,
			onSuccess: (data) => {
				logged = true
				setUser(data.user as User);
			},
			onError: () => { logged = false }
		});
		return logged;
	};

	const isProfileNotComplete = async () : Promise<ProfileNotComplete> => {
		let profileComplete = null;
		await apiService({
			method: "GET",
			path: "/auth/profile-complete",
			token: cookies.accessToken,
			onSuccess: () => { profileComplete = null },
			onError: (error) => { profileComplete = error.data }
		});
		return profileComplete as ProfileNotComplete;
	}

    const value = useMemo(
        () => ({
			user,
            cookies,
            login,
            logout,
			register,
			confirmEmailWithCode,
			isLogged,
			isProfileNotComplete
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user, cookies]
    );

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext)
};
