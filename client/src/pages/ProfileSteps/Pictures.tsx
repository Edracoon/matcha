import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authProvider';
import { useSearchParams } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import apiService from '../../services/apiService';
import { showNotification, NotifType } from '../../components/Notif';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import DropComponent from '../../components/DropComponent';
import Carousel from '../../components/Carousel';

export default function StepPictures() {

	const { cookies } = useAuth();
	const [_, setSearchParams] = useSearchParams();
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	const [biography, setPictures] = useState('');

	const [alreadySet, setAlreadySet ] = useState(false);

	function onChangePictures(e: React.ChangeEvent<HTMLTextAreaElement>) {
		if (e.target.value.length > 200)
			return ;
		setPictures(e.target.value);
	}

	function confirm() {
		console.log(biography);
		apiService({
			method: 'POST',
			path: '/account/upsert-pictures',
			token: cookies.accessToken,
			options: { data: { bio: biography } },
			onSuccess: () => {
				setSearchParams({ step: '4' });
				showNotification(NotifType.SUCCESS, 'Pictures saved', '');
			},
			onError: () => {
				showNotification(NotifType.ERROR, 'Pictures is not valid', '');
			}
		})
	}

	useEffect(() => {
		apiService({
			method: 'GET',
			path: '/account/pictures',
			token: cookies.accessToken,
			onSuccess: (data) => {
				if (!data.bio || data.bio === '')
					return ;
				setPictures(data.bio);
				setAlreadySet(true);
			},
			onError: () => { setAlreadySet(false) }
		})
	}, []);

	return (
		<div className='flex py-4 flex-col gap-8 min-h-[450px] justify-center'>
			<h1 className="text-2xl">Choose the best pictures to show you off !</h1>
			<div className='h-96 w-full !rounded-lg flex flex-col gap-4 justify-center'>
				<div className="flex sm:flex-row flex-col justify-center gap-4">
					<Carousel urlsArray={[]} />
					{/* <DropComponent id={1} onDropped={(files) => console.log(files)} /> */}
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