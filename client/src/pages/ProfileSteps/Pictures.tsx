import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authProvider';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import apiService from '../../services/apiService';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Carousel from '../../components/Carousel';
import { showNotification, NotifType } from '../../components/Notif';

export default function StepPictures() {

	const { cookies } = useAuth();
	const navigate = useNavigate();

	const [_, setSearchParams] = useSearchParams();
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	const [pictures, setPictures] = useState<string[]>([]);

	function finish() {
		if (pictures.length <= 0) {
			showNotification(NotifType.ERROR, 'You must add at least one picture', '');
			setIsConfirmOpen(false);
			return;
		}
		navigate('/home');
	}

	function getPictureUrls() {
		apiService({
			method: 'GET',
			path: '/account/pictures',
			token: cookies.accessToken,
			onSuccess: (data) => {
				console.log(data);
				setPictures(data.pictures);
			},
			onError: () => { }
		})
	}

	function addPicture(pic: File) {
		const formData = new FormData();
		formData.append('picture', pic);
		apiService({
			method: 'POST',
			path: '/account/add-picture',
			token: cookies.accessToken,
			options: { data: formData, headers: { 'Content-Type': 'multipart/form-data' } },
			onSuccess: (data) => {
				getPictureUrls();
			},
			onError: () => { }
		})
	}

	function deletePicture(id: string) {
		apiService({
			method: 'DELETE',
			path: '/account/delete-picture/' + id.split("/").pop(),
			token: cookies.accessToken,
			onSuccess: (data) => {
				getPictureUrls();
			},
			onError: () => { }
		})
	}


	useEffect(() => {
		getPictureUrls();
	}, []);

	return (
		<div className='flex py-4 flex-col gap-8 min-h-[450px] justify-center'>
			<h1 className="text-2xl">Choose the best pictures to show you off !</h1>
			<div className='h-96 sm:h-[600px] w-full !rounded-lg flex flex-col gap-4 justify-center'>
				<div className="flex sm:flex-row flex-col justify-center gap-4 mt-8">
					<Carousel urlsArray={pictures} onAdd={addPicture} onDelete={deletePicture} />
				</div>
			
			</div>
			
			<div className='flex justify-center gap-2'>
				{<button className='bg-indigo-500 text-white rounded-lg text-sm' onClick={() => setSearchParams({ step: '4' })}>
					<ArrowLeftIcon className='rounded-md px-2 py-2 text-sm font-medium h-8 w-8 cursor-pointer' />
				</button>}
				<button className='bg-indigo-500 text-white px-8 py-2 rounded-lg text-sm' onClick={() => setIsConfirmOpen(true)}>
					Finish
				</button>
			</div>
			<ConfirmModal
				isOpen={isConfirmOpen}
				text='We are done setting up your profile !'
				littleText=''
				onConfirm={finish}
				onCancel={() => setIsConfirmOpen(false)}
			/>
		</div>
	)
}