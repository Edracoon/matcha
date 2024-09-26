import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authProvider';
import { useSearchParams } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import apiService from '../../services/apiService';
import { showNotification, NotifType } from '../../components/Notif';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function StepBiography() {

	const { user, cookies } = useAuth();
	const [_, setSearchParams] = useSearchParams();
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	const [biography, setBiography] = useState('');

	const [alreadySet, setAlreadySet ] = useState(false);

	function onChangeBiography(e: React.ChangeEvent<HTMLTextAreaElement>) {
		if (e.target.value.length > 200)
			return ;
		setBiography(e.target.value);
	}

	function confirm() {
		if (biography.length === 0) {
			showNotification(NotifType.ERROR, 'Biography cannot be empty', '');
			setIsConfirmOpen(false);
			return;
		}
		apiService({
			method: 'POST',
			path: '/account/upsert-biography',
			token: cookies.accessToken,
			options: { data: { bio: biography } },
			onSuccess: () => {
				setSearchParams({ step: '4' });
				showNotification(NotifType.SUCCESS, 'Biography saved', '');
			},
			onError: () => {
				showNotification(NotifType.ERROR, 'Biography is not valid', '');
			}
		})
	}

	useEffect(() => {
		apiService({
			method: 'GET',
			path: '/account/biography',
			token: cookies.accessToken,
			onSuccess: (data) => {
				if (!data.bio || data.bio === '')
					return ;
				setBiography(data.bio);
				setAlreadySet(true);
			},
			onError: () => { setAlreadySet(false) }
		})
	}, []);

	return (
		<div className='flex py-4 flex-col gap-8 min-h-[400px] justify-center'>
			<h1 className="text-2xl">Introduce yourself in a few words { user?.username } !</h1>
			<div className='h-96 w-full !rounded-lg flex flex-col gap-4 justify-center'>
				<div className="flex sm:flex-row flex-col justify-center gap-4">
					<textarea value={biography} onChange={onChangeBiography} placeholder="..." name="biography" cols={40} rows={8} className="relative cursor-default rounded-md bg-[#505050] py-1 pl-3 pr-4 text-left text-white shadow-sm ring-1 ring-inset ring-gray-500/20 focus:outline-none focus:ring-2 focus:ring-gray-200/50 sm:text-sm sm:leading-6">

					</textarea>
				</div>
			
			</div>
			
			<div className='flex justify-center gap-2'>
				{<button className='bg-indigo-500 text-white rounded-lg text-sm' onClick={() => setSearchParams({ step: '2' })}>
					<ArrowLeftIcon className='rounded-md px-2 py-2 text-sm font-medium h-8 w-8 cursor-pointer' />
				</button>}
				<button className='bg-indigo-500 text-white px-8 py-2 rounded-lg text-sm' onClick={() => setIsConfirmOpen(true)}>
					Save
				</button>
				{alreadySet && <button className='bg-indigo-500 text-white rounded-lg text-sm' onClick={() => setSearchParams({ step: '4' })}>
					<ArrowRightIcon className='rounded-md px-2 py-2 text-sm font-medium h-8 w-8 cursor-pointer' />
				</button>}
			</div>
			<ConfirmModal
				isOpen={isConfirmOpen}
				text='Save your biography ?'
				littleText='You can always change it later'
				onConfirm={confirm}
				onCancel={() => setIsConfirmOpen(false)}
			/>
		</div>
	)
}