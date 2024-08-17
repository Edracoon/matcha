import { useState, useEffect } from 'react';
// import { showNotification } from '../components/Notif';
// import apiService from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authProvider';
import { BellIcon, ArrowRightStartOnRectangleIcon, Cog6ToothIcon, UserCircleIcon, UsersIcon, HeartIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline'
import { Disclosure, Menu } from '@headlessui/react'

type navItem = {
	name: string;
	icon: any;
	path: string;
	current: boolean;
}

export default function Navbar() {
	const { logout } = useAuth();
	const navigate = useNavigate();

	const [navigation, setNavigation] = useState<navItem[]>([
		{ name: 'Home', icon: HeartIcon, path: '/home', current: true },
		{ name: 'Matchs', icon: UsersIcon, path: '/matchs', current: false },
		{ name: 'Chat', icon: ChatBubbleOvalLeftEllipsisIcon, path: '/chat', current: false },
	])

	function classNames(...classes: string[]) {
		return classes.filter(Boolean).join(' ')
	}

	useEffect(() => {
		const updated = navigation.map((item: navItem) => {
			item.current = false;
			if (window.location.pathname === item.path)
				item.current = true;
			return item;
		})
		
		// Update the state
		setNavigation(updated);
		
	}, [window.location.pathname]);

	return (
		<Disclosure as="nav" className="bg-indigo-500">
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
						aria-current={item.current ? 'page' : undefined}
						className={classNames(
						  item.current ? 'bg-indigo-800 text-white' : 'text-gray-300 hover:bg-indigo-700 hover:text-white',
						  'rounded-md px-2 py-2 text-sm font-medium h-10 w-10',
						)}
					  >
						{item.name}
					  </item.icon>
					))}
				  </div>
				</div>
			  </div>
			  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
				<button
				  type="button"
				  className="relative rounded-full bg-indigo-500 p-1 text-white hover:outline-none hover:ring-1 hover:ring-white hover:ring-offset-1"
				>
				  <span className="absolute -inset-1.5" />
				  <span className="sr-only">View notifications</span>
				  <BellIcon aria-hidden="true" className="h-6 w-6" />
				</button>
	
				{/* Profile dropdown */}
				<Menu as="div" className="relative ml-3">
				  <div>
					<Menu.Button className="relative flex rounded-full text-white bg-indigo-500 text-sm hover:outline-none hover:ring-1 hover:ring-white hover:ring-offset-1">
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
						<div onClick={() => navigate("/my-profile")} className='flex flex-row gap-2 px-4 py-2 text-gray-700 cursor-pointer'>
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
				  aria-current={item.current ? 'page' : undefined}
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