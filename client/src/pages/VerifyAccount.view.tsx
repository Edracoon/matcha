import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authProvider';
import apiService from '../services/apiService';

export default function VerifyAccount() {

	const { user, logout, confirmEmailWithCode } = useAuth();
	const navigate = useNavigate();

	const [code, setCode] = useState('');

    // Refs to control each digit input element
    const inputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];

	// Reset all inputs and clear state
	const resetCode = () => {
		inputRefs.forEach(ref => {
			if (ref.current) {
				ref.current.value = '';
			}
		});
		inputRefs[0].current?.focus();
		setCode('');
	}

	// Call our callback when code = 6 chars
	useEffect(() => {
		if (code.length === 6) {
			console.log("Code: ", code);
			handleSubmit();
		}
	}, [code]); //eslint-disable-line

	// Handle input
	function handleInput(e, index) { 
		const input = e.target;
		const previousInput = inputRefs[index - 1];
		const nextInput = inputRefs[index + 1];

		// Update code state with single digit
		const newCode = [...code];
		// Convert lowercase letters to uppercase
		if (/^[a-z]+$/.test(input.value)) {
			const uc = input.value.toUpperCase();
			newCode[index] = uc;
			inputRefs[index].current.value = uc;
		} else {
			newCode[index] = input.value;
		}
		setCode(newCode.join(''));

		input.select();

		if (input.value === '') {
			// If the value is deleted, select previous input, if exists
			if (previousInput) {
				previousInput.current.focus();
			}
		} else if (nextInput) {
			// Select next input on entry, if exists
			nextInput.current.select();
		}
	}

	// Select the contents on focus
	function handleFocus(e) {
		e.target.select();
	}

	// Handle backspace key
	function handleKeyDown(e, index) {
		const input = e.target;
		const previousInput = inputRefs[index - 1];
		const nextInput = inputRefs[index + 1];

		if ((e.keyCode === 8 || e.keyCode === 46) && input.value === '') {
			e.preventDefault();
			setCode((prevCode) => prevCode.slice(0, index) + prevCode.slice(index + 1));
			if (previousInput) {
				previousInput.current.focus();
			}
		}
	}

	// Capture pasted characters
	const handlePaste = (e) => {
		const pastedCode = e.clipboardData.getData('text');
		if (pastedCode.length === 6) {
			setCode(pastedCode);
			inputRefs.forEach((inputRef, index) => {
				if (inputRef.current)
					inputRef.current.value = pastedCode.charAt(index);
			});
		}
	};

	const handleSubmit = () => {
		console.log("Submit code");
		confirmEmailWithCode(code);
	}

	const resendCode = () => {
		console.log("Resend code");
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
					Confirm your email
				</h2>
			</div>

			<div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
				<p>We sent the code to 
					<span className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">
					{user?.email}
					</span>
				</p>
				<div className="mb-6 flex justify-center">					
					<div id="digits" className="mt-6 flex flex-row">
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
				</div>

				<div>
					<button
					onClick={handleSubmit}
					type="submit"
					className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
					>
						Confirm
					</button>
				</div>
				<p className="mt-2 text-center text-sm text-gray-400">
				<button onClick={() => logout()}>
					<p className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">
						Logout
					</p>
				</button>
				</p>

				<p className="pt-2 text-center text-sm text-gray-400">
				You did not received the code?{' '}
				<button onClick={() => resendCode()}>
					<p className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">
						Send a new one !
					</p>
				</button>
			</p>
			</div>
		</div>
	);
}