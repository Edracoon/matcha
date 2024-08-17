import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authProvider';

export default function LoginPage() {

	const { login } = useAuth();

	const [username, setUsername] = useState("Edracoon");
	const [password, setPassword] = useState("@larette2EDGAR!");

	const uNavigate = useNavigate();

	async function handleSubmit() {
		await login(username, password);
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
				Sign in to your account
			</h2>
		</div>

		<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
			<div className="space-y-6">
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

			<div>
				<div className="flex items-center justify-between">
				<label className="block text-sm font-medium leading-6 text-white">
					Password
				</label>
				<div className="text-sm">
					<a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
					Forgot password?
					</a>
				</div>
				</div>
				<div className="mt-2">
				<input
					onChange={(e) => setPassword(e.target.value)}
					id="password"
					name="password"
					type="password"
					autoComplete="current-password"
					value={password}
					required
					className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
				/>
				</div>
			</div>

			<div>
				<button
				onClick={handleSubmit}
				type="submit"
				className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
				>
				Sign in
				</button>
			</div>
			</div>

			<p className="mt-10 text-center text-sm text-gray-400">
			No account yet?{' '}
			<button onClick={() => uNavigate("/register")}>
				<p className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">
					Create one !
				</p>
			</button>
			</p>
		</div>
	</div>
	</>
	)
}