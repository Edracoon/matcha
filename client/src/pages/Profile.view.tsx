import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import { useParams } from 'react-router-dom';
import apiService from '../services/apiService';
import { useAuth } from '../contexts/authProvider';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/solid';
import { HeartIcon, XMarkIcon, NoSymbolIcon, FlagIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import { socket } from '../socket';

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
    isConnected: boolean;
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
    const [hasLiked, setHasLiked] = useState(false);
    const [isMatch, setIsMatch] = useState(false);

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

        apiService({
            method: 'POST',
            path: '/hasLiked',
            token: cookies.accessToken,
            options: { data: { receiverId: Number(id) } },
            onSuccess: (data) => {
                if (data.hasLiked)
                    setHasLiked(data.hasLiked);
            },
            onError: () => {}
        });

        apiService({
            method: 'POST',
            path: "/isMatch",
            token: cookies.accessToken,
            options: { data: { receiverId: Number(id) } },
            onSuccess: (data) => {
                setIsMatch(data.isMatch);
            },
            onError: () => {}
        });
	}, []);


    useEffect(() => {
        // TODO
        socket.on('userDisconnected', (data) => {
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
        });

        socket.on('userConnected', (data) => {
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
        });
    });

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

    function ReportInteraction() {
        apiService({
            method: 'POST',
            path: "/report",
            token: cookies.accessToken,
            options: { data: { reportedId: profile.id } },
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (e) => {
                console.log(e);
            }
        });
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

	function formatLastConnection(lastConnection: any) {
		const lastDate = new Date(lastConnection);
		
		const day = String(lastDate.getDate()).padStart(2, '0');
		const month = String(lastDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
		const year = lastDate.getFullYear();
		
		const hours = String(lastDate.getHours()).padStart(2, '0');
		const minutes = String(lastDate.getMinutes()).padStart(2, '0');
	
		return `${day}/${month}/${year} at ${hours}:${minutes}`;
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
                    <span>{profile?.firstname} {profile?.lastname}</span>
                    <span>I am a {profile?.gender}</span>
                    <span>I am looking for {profile?.wantToMeet}</span>
                    <span>I am {profile?.age} years old</span>
                    { hasLiked && <div className="text-xl font-bold text-red-300">This user has liked your profile </div> }
                    { profile && profile.isConnected ? 
                        <div className="mt-1 flex items-center gap-x-1.5">
                            <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            </div>
                            <p className="text-xs leading-5 text-gray-400">Online</p>
                        </div> 
                      :
                        <div className="mt-1 flex items-center gap-x-1.5">
                            <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            </div>
                            <p className="text-xs leading-5 text-gray-400">Offline</p>
                            { profile?.lastConnection &&
                            <p className="text-xs leading-5 text-gray-400">
                                since {formatLastConnection(profile.lastConnection)}
                            </p>
                            }
                        </div>
                      }
                      {
                        isMatch === true &&
                        <div>
                            <p className="text-xl font-bold text-red-500">It's a match!</p>
                        </div>
                      }
                      <p className="text-sm leading-6 text-gray-200 font-semibold">{Math.round(profile?.fameRating * 100)} 🔥</p>
				</div>
			</div>
            <div className='flex flex-row justify-center mt-8 gap-3'>
                { isMatch === true ?
                <>
                    <button className="text-red-500 bg-white p-2 rounded-full text-lg sm:!w-auto !gap-0" title="Bloquer cet utilisateur" onClick={blockInteraction}>
                        <NoSymbolIcon className="h-3 w-3 sm:h-6 sm:w-6" />
                    </button>
                    <button className="text-orange-500 bg-white p-2 rounded-full text-lg sm:!w-auto !gap-0" title="Signaler cet utilisateur" onClick={ReportInteraction}>
                        <FlagIcon className="h-3 w-3 sm:h-6 sm:w-6" />
                    </button>
                </>
                :
                <>
                    <button onClick={() => { onInteraction(false); } } className="text-indigo-500 bg-white p-2 rounded-full text-lg sm:!w-auto !gap-0">
                        <XMarkIcon className="h-3 w-3 sm:h-6 sm:w-6" />
                    </button><button onClick={() => { onInteraction(true); } } className="text-red-500 bg-white p-2 rounded-full text-lg sm:!w-auto !gap-0">
                        <HeartIcon className="h-3 w-3 sm:h-6 sm:w-6" />
                    </button><button className="text-red-500 bg-white p-2 rounded-full text-lg sm:!w-auto !gap-0" title="Bloquer cet utilisateur" onClick={blockInteraction}>
                        <NoSymbolIcon className="h-3 w-3 sm:h-6 sm:w-6" />
                    </button>
                    <button className="text-orange-500 bg-white p-2 rounded-full text-lg sm:!w-auto !gap-0" title="Signaler cet utilisateur" onClick={ReportInteraction}>
                        <FlagIcon className="h-3 w-3 sm:h-6 sm:w-6" />
                    </button>
                </>
                }   
            </div>
            
		</>
	);
}