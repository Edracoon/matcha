import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import { useParams } from 'react-router-dom';
import apiService from '../services/apiService';
import { useAuth } from '../contexts/authProvider';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/solid';

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ')
}

type TagType = {
	id: number;
	content: string;
}

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
	tags: TagType[]; // Array of TagType
	pictures: string[]; // Array of strings
	username: string;
	wantToMeet: string;
};

export default function ProfileView() {

	const { id } = useParams();
	const { cookies } = useAuth();
	const [mySelf, setMySelf] = useState<UserType | undefined>();
	const [profile, setProfile] = useState<UserType | undefined>();
	
	useEffect(() => {
		apiService({
			method: 'GET',
			path: '/account/user/' + id,
			token: cookies.accessToken,
			onSuccess: (data) => {
				console.log(data);
				setProfile(data.user);
			},
			onError: () => {}
		})

		apiService({
			method: 'GET',
			path: "/account/myself",
			token: cookies.accessToken,
			onSuccess: (data) => {
				setMySelf(data.user);
			},
			onError: () => {}
		})
	}, []);

	function tagContained(tag: TagType) {
		let ret = false;
		if (!mySelf || !profile)
			return false;
		// Check if the user has common tags with the profile
		mySelf.tags.forEach((t) => {
			if (t.id === tag.id)
				ret = true;
		});
		return ret
	}

	return (
		<>
			<Navbar />
			<div className='w-full flex sm:flex-row flex-col justify-center mt-8 gap-4'>
				{ profile && <Carousel urlsArray={profile?.pictures} isEdit={false}  /> }
				<div className="flex flex-col text-left gap-4">
					{ profile && <h1 className="text-2xl">@{profile.username}</h1> }
					<div className="text-xl font-normal flex flex-row gap-2 items-center">
						<ChevronDoubleLeftIcon className="h-5 w-5 inline text-indigo-400" />
						{profile?.bio}
						<ChevronDoubleRightIcon className="h-5 w-5 inline text-indigo-400" />
					</div>
					<div className="text-xl font-bold">
						{ profile?.tags.length && <div className="flex flex-wrap gap-4 w-60 overflow-y-auto py-2">
							{profile.tags.map((tag, index) => (
							<div key={index} className={classNames(tagContained(tag) ? "bg-indigo-500" : "bg-white/10", "flex flex-col gap-1 px-3 py-1 rounded-full text-sm")}>
								{tag.content}
							</div>
							))}
						</div>}
					</div>
				</div>
			</div>
		</>
	);
}