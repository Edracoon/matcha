import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import { useParams } from 'react-router-dom';
import apiService from '../services/apiService';
import { useAuth } from '../contexts/authProvider';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/solid';
import { HeartIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';

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
    const nav = useNavigate();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
            method: 'POST',
            path: '/view',
            token: cookies.accessToken,
            options: { data: { receiverId: Number(id) } },
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (e) => {
                console.log(e);
            }
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


    function onInteraction(liked: boolean) {
		apiService({
			method: 'POST',
			path: '/like',
			token: cookies.accessToken,
			options: { data: { type: liked ? "like" : "reject", receiverId: profile.id } },
			onSuccess: () => {
			},
			onError: () => {
			}
		});
        nav("/home");
	}

    function blockInteraction() {
        apiService({
			method: 'POST',
			path: '/block',
			token: cookies.accessToken,
			options: { data: { receiverId: profile.id } },
			onSuccess: () => {
			},
			onError: () => {
			}
		});
        nav("/home");
    }

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
            <div className='flex flex-row justify-center mt-8 gap-3'>
                <button onClick={() => {onInteraction(false)}} className="text-indigo-500 bg-white p-2 rounded-full text-lg sm:!w-auto !gap-0">
                    <XMarkIcon className="h-3 w-3 sm:h-6 sm:w-6" />
                </button>
                <button onClick={() => {onInteraction(true)}} className="text-red-500 bg-white p-2 rounded-full text-lg sm:!w-auto !gap-0">
                    <HeartIcon className="h-3 w-3 sm:h-6 sm:w-6" />
                </button>
                <button className="text-red-500 bg-white p-2 rounded-full text-lg sm:!w-auto !gap-0" title="Bloquer cet utilisateur" onClick={blockInteraction}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                </button>
            </div>
            
		</>
	);
}