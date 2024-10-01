import { useState, useEffect } from 'react';
// import { showNotification } from '../components/Notif';
import apiService from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authProvider';
import Navbar from '../components/Navbar';
import { NotifType, showNotification } from '../components/Notif';

export default function MyProfileView() {

	const { user } = useAuth();
    const { cookies } = useAuth();
    const [mySelf, setMySelf] = useState(null);

    const nav = useNavigate();

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        apiService({
			method: 'GET',
			path: "/account/myself",
			token: cookies.accessToken,
			onSuccess: (data) => {
                setFirstname(data.user.firstname);
                setLastname(data.user.lastname);
                setEmail(data.user.email);
                setUsername(data.user.username);
				setMySelf(data.user);
			},
			onError: () => {}
		});
    }, [cookies.accessToken]);


    function Submit() {
        apiService({
            method: 'POST',
            path: '/account/edit-account',
            token: cookies.accessToken,
            options: { data: { email, firstname, lastname, username } },
            onSuccess: () => {
                apiService({
                    method: 'GET',
                    path: "/account/myself",
                    token: cookies.accessToken,
                    onSuccess: (data) => {
                        setMySelf(data.user);
                    },
                    onError: () => {}
                });
            },
            onError: (e) => {
                showNotification(NotifType.ERROR, "Error", e.error);
            }
        });

        apiService({
            method: 'POST',
            path: '/account/edit-username',
            token: cookies.accessToken,
            options: { data: { username } },
            onSuccess: () => {
                apiService({
                    method: 'GET',
                    path: "/account/myself",
                    token: cookies.accessToken,
                    onSuccess: (data) => {
                        setMySelf(data.user);
                    },
                    onError: () => {}
                });
            },
            onError: (e) => {
                showNotification(NotifType.ERROR, "Error", e.error);
            }
        });
    }


	return (
		<div className='bg-indigo-400 h-screen'>
			<Navbar />
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<img
				className="mx-auto h-24 w-auto"
				src="/matcha-logo.png"
				alt="Matcha"
				/>
				<h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-white">
					Your profile
				</h2>
			</div>
            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm ">
				<div className="rounded-lg p-2 mb-4">
					<label className="block text-sm font-bold leading-6 text-white">
						Informations
					</label>
					<div className="space-y-2">
						<div>
							<div className="flex flex-row justify-between">
								<label className="block text-sm font-medium leading-6 text-white">
								Email
								</label>
							</div>
							<div className="mt-2">
								<input
									onChange={(e) => setEmail(e.target.value)}
									id="email"
									name="email"
									type="email"
									value={email}
									required
									className="block w-full rounded-md border-0 bg-white/5 px-4 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>
					</div>

					<div className="flex flex-row gap-4 mt-2">
						<div>
							<div className="flex flex-row justify-between">
								<label className="block text-sm font-medium leading-6 text-white">
								Firstname
								</label>
							</div>
							<div className="mt-2">
								<input
									onChange={(e) => setFirstname(e.target.value)}
									id="firstname"
									name="firstname"
									type="firstname"
									value={firstname}
									required
									className="block w-full rounded-md border-0 bg-white/5 px-4 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>

						<div>
							<div className="flex flex-row justify-between">
								<label className="block text-sm font-medium leading-6 text-white">
								Lastname
								</label>
							</div>
							<div className="mt-2">
								<input
									onChange={(e) => setLastname(e.target.value)}
									id="lastname"
									name="lastname"
									type="lastname"
									value={lastname}
									required
									className="block w-full rounded-md border-0 bg-white/5 px-4 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="rounded-lg p-2">
					<label className="block text-sm font-bold leading-6 text-white">
						Account
					</label>
					<div className="space-y-2">
						<div>
							<div className="flex flex-row justify-between">
								<label className="block text-sm font-medium leading-6 text-white">
								Username
								</label>
							</div>
							<div className="mt-2">
								<input
									onChange={(e) => setUsername(e.target.value)}
									id="username"
									name="username"
									type="username"
									value={username}
									required
									className="block w-full rounded-md border-0 bg-white/5 px-4 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>
					</div>

					<div className="pt-4">
						<button
						onClick={Submit}
						type="submit"
						className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
						>
							Register
						</button>
					</div>
                    <div className="pt-4">
						<button
						onClick={() => nav("/profile-steps")}
						type="submit"
						className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
						>
							Change your preferences
						</button>
					</div>
				</div>
			</div>
        </div>
	);
}