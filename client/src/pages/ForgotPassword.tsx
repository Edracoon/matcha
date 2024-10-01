import { useEffect, useState, useRef, ReactEventHandler } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import { showNotification, NotifType } from '../components/Notif';

export default function ForgotPassword() {

	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const code = queryParams.get('code');

	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [currCode, setCode] = useState('');

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

    // Refs to control each digit input element
    const inputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];

	useEffect(() => {
		if (code) {
			setCode(code);
			inputRefs.forEach((inputRef, index) => {
				if (inputRef.current)
					(inputRef.current as HTMLInputElement).value = code.charAt(index);
			});
		}
	}, [code]);

	// Reset all inputs and clear state
	function resetCode() {
		inputRefs.forEach(ref => {
			if (ref.current) {
				(ref.current as HTMLInputElement).value = '';
			}
		});
		(inputRefs[0].current as HTMLInputElement | null)?.focus();
		setCode('');
	}

	// Handle input
	function handleInput(e: React.ChangeEvent<HTMLInputElement>, index: number) {
		const input = e.target;
		const previousInput = inputRefs[index - 1];
		const nextInput = inputRefs[index + 1];

		// Update currCode state with single digit
		const newCode = [...currCode];
		newCode[index] = input.value;
		setCode(newCode.join(''));

		input.select();

		// If the value is deleted, select previous input, if exists
		if (input.value === '' && previousInput.current) {
			(previousInput.current as HTMLInputElement).focus();
		} else if (nextInput.current) {
			// Select next input on entry, if exists
			(nextInput.current as HTMLInputElement).select();
		}
	}

	// Select the contents on focus
	function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
		e.currentTarget.select();
	}

	// Handle backspace key
	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
		const input = e.currentTarget;
		const previousInput = inputRefs[index - 1];

		if ((e.key === 'Backspace' || e.key === 'Delete') && input.value === '') {
			e.preventDefault();
			setCode((prevCode) => prevCode.slice(0, index) + prevCode.slice(index + 1));
			if (previousInput.current) {
				(previousInput.current as unknown as HTMLInputElement).focus();
			}
		}
	}

	// Capture pasted characters
	function  handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
		const pastedCode = e.clipboardData.getData('text');
		if (pastedCode.length === 6) {
			setCode(pastedCode);
			inputRefs.forEach((inputRef, index) => {
				if (inputRef.current)
					(inputRef.current as HTMLInputElement).value = pastedCode.charAt(index);
			});
		}
	};

	function handleSubmit() {
		apiService({
			method: "POST",
			path: "/auth/reset-password",
			options: { data: { email, resetPasswordCode: currCode, password, confirmPassword } },
			onSuccess: () => {
				showNotification(NotifType.SUCCESS, 'Password changed !', 'You can now login');
				navigate('/');
			},
			onError: (error) => {
				showNotification(NotifType.ERROR, error.data.error, '');
				resetCode();
			}
		});
	}

	function sendResetCode() {
		apiService({
			method: "POST",
			path: "/auth/forgot-password",
			options: { data: { email } },
			onSuccess: () => {
				showNotification(NotifType.SUCCESS, 'Code sent', 'Check your mails');
			},
			onError: (error) => {
				showNotification(NotifType.ERROR, error.data.error, '');
			}
		});
	};

	return (
		<div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<img
				className="mx-auto h-24 w-auto"
				src="/matcha-logo.png"
				alt="Matcha"
				/>
				<h2 className="mt-4 text-center text-xl font-bold leading-9 tracking-tight text-white">
					Reset your password
				</h2>
			</div>

			<div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
				<div className="space-y-2">
					<div>
						<div className="flex flex-row justify-between">
							<label className="block text-sm font-medium leading-6 text-white">
							Your email
							</label>
						</div>
						<div className="mt-2">
							<input
								onChange={(e) => setEmail(e.target.value)}
								id="email"
								name="mail"
								type="mail"
								value={email}
								required
								className="block w-full rounded-md border-0 bg-white/5 px-4 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
							/>
						</div>
					</div>
				</div>
				<p className="pt-2 text-center text-sm text-gray-400">
					<button onClick={() => sendResetCode()} className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
						<p className="font-semibold leading-6 hover:text-indigo-300">
							Send code
						</p>
					</button>
				</p>
				<div className="mt-6 border-white border-[1px] rounded-full"></div>
				<div className="mb-6 flex flex-col justify-center pt-6">
					<div className="flex flex-row justify-center">
						<label className="block text-sm font-medium leading-6 text-white">
						Enter the code we sent you
						</label>
					</div>	
					<div id="digits" className="mt-2 flex flex-row justify-center">
					{[0, 1, 2, 3, 4, 5].map((index) => (
						<input
							className="text-2xl w-10 flex p-1 mx-1 text-center rounded-lg text-indigo-400 "
							key={index}
							type="text"
							maxLength={1}
							onChange={(e) => handleInput(e, index)}
							ref={inputRefs[index]}
							autoFocus={index === 0}
							onFocus={handleFocus}
							onKeyDown={(e) => handleKeyDown(e, index)}
							onPaste={handlePaste}
							// disabled={isLoading}
						/>
					))}
					</div>
					<div className="mt-2">
						<div className="flex items-center justify-between">
							<label className="block text-sm font-medium leading-6 text-white">
								New password
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
					<div className="mt-2">
						<div className="flex items-center justify-between">
							<label className="block text-sm font-medium leading-6 text-white">
								Confirm new password
							</label>
						</div>
						<div className="mt-2">
							<input
								onChange={(e) => setConfirmPassword(e.target.value)}
								id="confirmPassword"
								name="password"
								type="password"
								value={confirmPassword}
								autoComplete="current-password"
								required
								className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
							/>
						</div>
					</div>
				</div>

				<div>
					<button
					onClick={handleSubmit}
					type="submit"
					className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
					>
						Confirm reset password
					</button>
				</div>
				<p className="mt-2 text-center text-sm text-gray-400">
				</p>
			</div>
		</div>
	);
}