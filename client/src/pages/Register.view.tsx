import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authProvider';
import { showNotification, NotifType } from '../components/Notif';

export default function Register() {

	const { register } = useAuth();

	const [email, setEmail] = useState("edgar.pfennig@gmail.com");

	const [firstname, setFirstname] = useState("Edgar");
	const [lastname, setLastname] = useState("Pfennig");

	const [age, setAge] = useState(18);
	const [username, setUsername] = useState("Edracoon");
	const [password, setPassword] = useState("password");

	const uNavigate = useNavigate();

	async function handleSubmit() {
		if (age < 18) {
			showNotification(NotifType.ERROR, 'You must be at least 18 years old to register', '');
			return ;
		}
		register({ email, firstname, lastname, age, username, password, confirmPassword: password });
	}

	function navigate(path: string) {
		uNavigate(path);
	}

	useEffect(() => {
	}, []);

	return (
	<>
		<div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<img
				className="mx-auto h-24 w-auto"
				src="/matcha-logo.png"
				alt="Matcha"
				/>
				<h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-white">
					Register to matcha
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
						<div>
							<div className="flex flex-row justify-between">
								<label className="block text-sm font-medium leading-6 text-white">
								Age
								</label>
							</div>
							<div className="mt-2">
								<input
									onChange={(e) => setAge(e.target.value as unknown as number)}
									id="age"
									name="age"
									type="age"
									value={age}
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

					<div className="mt-2">
						<div className="flex items-center justify-between">
							<label className="block text-sm font-medium leading-6 text-white">
								Password
							</label>
						</div>
						<div className="mt-2">
							<input
								onChange={(e) => setPassword(e.target.value)}
								id="password"
								name="password"
								type="password"
								value={password}
								autoComplete="current-password"
								required
								className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
							/>
						</div>
					</div>

					<div className="pt-4">
						<button
						onClick={handleSubmit}
						type="submit"
						className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
						>
							Register
						</button>
					</div>
				</div>
			</div>

			<p className="pt-4 text-center text-sm text-gray-400">
				Already have an account?{' '}
				<button onClick={() => navigate("/")}>
					<p className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">
						Sign in !
					</p>
				</button>
			</p>
		</div>
	</>
	)
}