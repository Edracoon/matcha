import { useEffect } from 'react';
import apiService from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authProvider';
import { HeartIcon, XMarkIcon } from '@heroicons/react/24/solid';


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
	const nav = useNavigate();

	useEffect(() => {
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
			<div onClick={() => nav("/profile/" + user.id)} className="rounded-lg bg-indigo-500 p-4 text-left">
				<img alt="" className="w-full rounded-lg aspect-[13/14] object-cover overflow-hidden" src={user.pictures[0]} />
				<div className='flex flex-row justify-center w-full gap-4 pt-2'>
					<button onClick={(e) => {e.stopPropagation(); onInteraction(false)}} className="text-indigo-500 bg-white p-2 rounded-full text-lg sm:!w-auto !gap-0">
						<XMarkIcon className="h-3 w-3 sm:h-6 sm:w-6" />
					</button>
					<button onClick={(e) => {e.stopPropagation(); onInteraction(true)}} className="text-red-500 bg-white p-2 rounded-full text-lg sm:!w-auto !gap-0">
						<HeartIcon className="h-3 w-3 sm:h-6 sm:w-6" />
					</button>
				</div>
				<div className='flex flex-col sm:flex-row justify-between w-full'>
					<div className='flex flex-row align-middle gap-1'>
						<h3 className="text-sm sm:text-lg font-semibold leading-8 tracking-tight text-white">{user.firstname},</h3>
						<p className="text-sm sm:text-lg leading-8 text-white font-medium">{user.age}</p>
					</div>
					<p className="text-sm leading-8 text-gray-200 font-semibold">{user.CommonTags} 🤝</p>
				</div>
				<div className='flex flex-row justify-between w-full'>
					<p className="text-sm leading-6 text-gray-300">{Math.round(user.Distance)} km</p>
					<p className="text-sm leading-6 text-gray-200 font-semibold">{Math.round(user.fameRating * 100)} 🔥</p>
				</div>
   			</div>
		</>
	);
}