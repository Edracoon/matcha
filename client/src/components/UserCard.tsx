import { useState, useEffect } from 'react';
import { showNotification } from '../components/Notif';
import apiService from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authProvider';
import Navbar from '../components/Navbar';
import { useSearchParams } from 'react-router-dom';
import { CameraIcon, PlusCircleIcon, PlusIcon, XMarkIcon, HeartIcon } from '@heroicons/react/24/outline';

export type UserType = {
	CommonTags: number;
	Distance: number;
	Score: number | null;
	age: number;
	bio: string;
	email: string;
	emailValidated: boolean; // Converted from 1/0 to boolean for better clarity
	fameRating: number;
	firstname: string;
	gender: "man" | "woman" | string; // You can adapt the gender field as needed
	id: number;
	isFake: boolean; // Converted from 1/0 to boolean
	lastConnection: string | null; // Assuming a string for date-time or null if not available
	lastname: string;
	latitude: number;
	longitude: number;
	tags: string[]; // Array of strings
	pictures: string[]; // Array of strings
	username: string;
	wantToMeet: string;
};

export default function UserCard({ user }: { user: UserType; }) {

	const { cookies } = useAuth();

	useEffect(() => {
		console.log(user.pictures);
	}, []);

	function onInteraction(liked: boolean) {
		apiService({
			method: 'POST',
			path: '/like',
			token: cookies.accessToken,
			options: { data: { type: liked ? "like" : "reject", receiverId: user.id } },
			onSuccess: () => {
			},
			onError: () => {
			}
		})
	}

	return (
		<>
			<div className="rounded-lg bg-indigo-500 p-4 text-left">
				<img alt="test" className="aspect-[14/13] w-full rounded-lg object-cover" src={user.pictures[0]} />
				<div className='flex flex-row justify-center w-full gap-4 pt-2'>
					<button onClick={() => onInteraction(false)} className="text-red-400 bg-white p-2 rounded-full text-sm sm:!w-auto z-10 !gap-0 z-1">
						<XMarkIcon className="h-6 w-6" />
					</button>
					<button onClick={() => onInteraction(true)} className="text-green-400 bg-white p-2 rounded-full text-sm sm:!w-auto z-10 !gap-0 z-1">
						<HeartIcon className="h-6 w-6" />
					</button>
				</div>
				<div className='flex flex-row justify-between w-full'>
					<div className='flex flex-row align-middle gap-1'>
						<h3 className=" text-lg font-semibold leading-8 tracking-tight text-white">{user.firstname},</h3>
						<p className=" text-lg leading-8 text-white font-medium">{user.age}</p>
					</div>
					<p className=" text-sm leading-8 text-gray-200 font-semibold">{user.CommonTags} 🤝</p>
				</div>
				<div className='flex flex-row justify-between w-full'>
					<p className="text-sm leading-6 text-gray-300">{Math.round(user.Distance)} km</p>
					<p className="text-sm leading-6 text-gray-200 font-semibold">{Math.round(user.fameRating * 100)} 🔥</p>
				</div>
   			</div>
		</>
	);
}