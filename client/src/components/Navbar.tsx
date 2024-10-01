import { useState, useEffect, useCallback } from 'react';
// import { showNotification } from '../components/Notif';
// import apiService from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authProvider';
import { BellIcon, ArrowRightStartOnRectangleIcon, Cog6ToothIcon, UserCircleIcon, UsersIcon, HeartIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline'
import { Disclosure, Menu } from '@headlessui/react'
import { useCookies } from 'react-cookie';
import { socket, handleDisconnectWithData } from '../socket';
import apiService from '../services/apiService';

type navItem = {
	name: string;
	icon: any;
	path: string;
	current: boolean;
}

export default function Navbar({ sx }: { sx?: string }) {
	const { logout } = useAuth();
	const navigate = useNavigate();
    const [cookies] = useCookies();
    const [isOpen, setIsOpen] = useState(false);
	type Notification = {
		notif: {
			category: string;
		};
		sender: {
			firstname: string;
			lastname: string;
		};
	};

	const [notifs, setNotifs] = useState<Notification[]>([]);

	const [navigation, setNavigation] = useState<navItem[]>([
		{ name: 'Home', icon: HeartIcon, path: '/home', current: false },
		// { name: 'Matchs', icon: UsersIcon, path: '/matchs', current: false },
		{ name: 'Chat', icon: ChatBubbleOvalLeftEllipsisIcon, path: '/chat', current: false },
	])

    const getNotificationMessage = (notif) => {

        // console.log("NotifFromGetMessage", notif.notif.category);
        
        // Fonction pour retourner un message personnalisé en fonction du type de notification
        switch (notif.notif.category) {
            case 'liked':
                return `${notif.sender.firstname} ${notif.sender.lastname} a aimé votre profil.`;
            case 'visited':
                return `${notif.sender.firstname} ${notif.sender.lastname} a visité votre profil.`;
            case 'message':
                return `${notif.sender.firstname} ${notif.sender.lastname} vous a envoyé un message.`;
            case 'liked_back':
                return `${notif.sender.firstname} ${notif.sender.lastname} a aimé votre profil en retour.`;
            case 'unliked':
                return `${notif.sender.firstname} ${notif.sender.lastname} n'aime plus votre profil.`;
            default:
                return 'Nouvelle notification';
        }
    }

	function classNames(...classes: string[]) {
		return classes.filter(Boolean).join(' ')
	}

    useEffect(() => {
        if (!isOpen) return;
        // console.log("Notif to update", notifs);
        apiService({
            method: 'POST',
            path: "/updateNotifs",
            token: cookies.accessToken,
            options: { data: { notifs: notifs } },
            onSuccess: (data) => {
                // console.log("New Notifs ->", data);
                setNotifs(data);
            },
            onError: (error) => {
                console.log(error);
            }
        })
    }, [cookies.accessToken, isOpen]); 

	useEffect(() => {
		const updated = navigation.map((item: navItem) => {
			item.current = false;
			if (window.location.pathname === item.path)
				item.current = true;
			return item;
		})
	
        apiService({
            method: 'GET',
            path: '/getNotifs',
            token: cookies.accessToken,
            onSuccess: (data) => {
                // console.log(data);
                setNotifs(data);
            },
            onError: () => { }
        });

        // console.log("Cookies", cookies);

        
        
		// Update the state
		setNavigation(updated);

	}, [window.location.pathname, cookies.accessToken]);

    useEffect(() => {
        socket.on('Notif', (data) => {
            console.log("Received notification", data);
            apiService({
                method: 'GET',
                path: '/getNotifs',
                token: cookies.accessToken,
                onSuccess: (data) => {
                    // console.log(data);
                    setNotifs(data);
                },
                onError: () => { }
            });
        });
    }, [cookies.accessToken]);



	return (
		<Disclosure as="div" className={"bg-indigo-600 " + sx} >
		  <div className="mx-auto max-w-7xl px-4">
			<div className="relative flex h-16 items-center justify-between">
			  {/* Mobile menu button*/}
			  {/* <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
				<Disclosure.Button className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
				  <span className="absolute -inset-0.5" />
				  <span className="sr-only">Open main menu</span>
				  <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
				  <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
				</Disclosure.Button>
			  </div> */}
			  <div className="flex flex-1 items-center justify-start">
				<div className="hidden sm:flex flex-shrink-0 items-center">
					<img
						className="mx-auto h-10 w-auto"
						src="/matcha-logo.png"
						alt="Matcha"
					/>
				</div>
				<div className="sm:ml-6 block">
				  <div className="flex space-x-4">
					{navigation.map((item: navItem) => (
					  <item.icon
						key={item.name}
						onClick={() => {item.current = true; navigate(item.path)}}
						aria-current={item.current ? 'View' : undefined}
						className={classNames(
						  item.current ? 'bg-indigo-800 text-white' : 'text-gray-300 hover:bg-indigo-700 hover:text-white',
						  'rounded-md px-2 py-2 text-sm font-medium h-10 w-10 cursor-pointer',
						)}
					  >
						{item.name}
					  </item.icon>
					))}
				  </div>
				</div>
			  </div>
			  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
				{/* <button
				  type="button"
				  className="relative rounded-full bg-indigo-600 p-1 text-white hover:outline-none hover:ring-1 hover:ring-white hover:ring-offset-1"
				>
				  <span className="absolute -inset-1.5" />
				  <span className="sr-only">View notifications</span>
				  <BellIcon aria-hidden="true" className="h-6 w-6" />
				</button> */}
                    
                    <Menu as="div" className="relative ml-3">
                        <div>
                            {/* <Menu.Button className="relative flex rounded-full text-white bg-indigo-600 text-sm hover:outline-none hover:ring-1 hover:ring-white hover:ring-offset-1">
                                <span className="absolute -inset-1.5" />
                                <span className="sr-only">Open user menu</span>
                                <BellIcon aria-hidden="true" className="h-6 w-6" />
                            </Menu.Button> */}
                            <Menu.Button 
                                className="relative flex rounded-full text-white bg-indigo-600 text-sm hover:outline-none hover:ring-1 hover:ring-white hover:ring-offset-1"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <span className="absolute -inset-1.5" />
                                <span className="sr-only">Open user menu</span>
                                
                                {/* Bell Icon with Notification Count */}
                                <div className="relative">
                                    <BellIcon aria-hidden="true" className="h-6 w-6" />
                                    
                                    {/* Badge with the number of unread notifications */}
                                    {notifs.filter((notif) => !notif.notif.seen).length > 0 && (
                                        <span className="absolute bottom-4 left-3 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                            {notifs.filter((notif) => !notif.notif.seen).length}
                                        </span>
                                    )}
                                </div>
                            </Menu.Button>
							
								<Menu.Items
									className="absolute h-60 overflow-y-scroll right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                    key={notifs.length}
                                >
                                    {notifs.map((notif) => (
                                        <Menu.Item key={notif.notif.id} >
                                            <div key={notif.notif.id} className='flex flex-row gap-2 px-4 py-2 text-gray-700 cursor-pointer border-solid border-b-2 border-gray-300'>
                                                {/* <Cog6ToothIcon className="h-5 w-5 " aria-hidden="true" /> */}
                                                <a key={notif.notif.id} className="block text-sm data-[focus]:bg-gray-100">
                                                    {getNotificationMessage(notif)}
                                                </a>
                                            </div>
                                        </Menu.Item>
                                ))}
								</Menu.Items>
                        </div>
                    </Menu>    
				{/* Profile dropdown */}
				<Menu as="div" className="relative ml-3">
				  <div>
					<Menu.Button className="relative flex rounded-full text-white bg-indigo-600 text-sm hover:outline-none hover:ring-1 hover:ring-white hover:ring-offset-1">
					  <span className="absolute -inset-1.5" />
					  <span className="sr-only">Open user menu</span>
					  <UserCircleIcon aria-hidden="true" className="h-8 w-8" />
					</Menu.Button>
				  </div>
				  <Menu.Items
					// transition
					className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
				  >
					<Menu.Item>
						<div onClick={() => navigate("/profile-steps")} className='flex flex-row gap-2 px-4 py-2 text-gray-700 cursor-pointer'>
							<Cog6ToothIcon className="h-5 w-5 " aria-hidden="true" />
							<a className="block text-sm data-[focus]:bg-gray-100">
							Profile
							</a>
						</div>
					</Menu.Item>
					<Menu.Item>
						<div className='flex flex-row gap-2 px-4 py-2 text-gray-700 cursor-pointer' onClick={() => logout()} >
							<ArrowRightStartOnRectangleIcon className="h-5 w-5 " aria-hidden="true" />
							<a className=" block text-sm data-[focus]:bg-gray-100">
								Sign out
							</a>
						</div>
					</Menu.Item>
				  </Menu.Items>
				</Menu>
			  </div>
			</div>
		  </div>
	
		  {/* <Disclosure.Panel className="sm:hidden">
			<div className="space-y-1 px-2 pb-3 pt-2">
			  {navigation.map((item) => (
				<Disclosure.Button
				  key={item.name}
				  as="button"
				  onClick={() => {item.current = true; navigate(item.path)}}
				  aria-current={item.current ? 'View' : undefined}
				  className={classNames(
					item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
					'block rounded-md px-3 py-2 text-base font-medium',
				  )}
				>
				  {item.name}
				</Disclosure.Button>
			  ))}
			</div>
		  </Disclosure.Panel> */}
		</Disclosure>
	  )
}