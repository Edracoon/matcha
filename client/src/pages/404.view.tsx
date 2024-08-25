import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline'

export default function NotFound404View() {

	const nav = useNavigate();

	useEffect(() => {
	}, []);

	return (
		<div className='w-full flex flex-col justify-center gap-2 align-middle mt-4'>
			<h1 className="flex justify-center align-middle">404 Not Found</h1>
			<HomeIcon className="h-6 w-full flex justify-center cursor-pointer" onClick={() => nav("/home")} />
		</div>
	);
}