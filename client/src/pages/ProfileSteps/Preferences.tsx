import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authProvider';
import { useSearchParams } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import Select, { OptionType } from '../../components/Select';
import apiService from '../../services/apiService';
import { showNotification, NotifType } from '../../components/Notif';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function StepPreferences() {

	const { user, cookies } = useAuth();
	const [_, setSearchParams] = useSearchParams();
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	const [gender, setGender] = useState<OptionType | undefined>();
	const [wantToMeet, setWantToMeet] = useState<OptionType | undefined>();

	const [alreadySet, setAlreadySet ] = useState(false);

	const gendersOptions = [
		{ id: 0, value: 'man' },
		{ id: 1, value: 'woman' },
	]

	const wantToMeetOptions = [
		{ id: 0, value: 'men' },
		{ id: 1, value: 'women' },
		{ id: 2, value: 'anyone' },
	]

	function confirm() {
		if (!gender?.value || !wantToMeet?.value) {
			showNotification(NotifType.ERROR, 'You must fill all fields', '');
			setIsConfirmOpen(false);
			return;
		}
		apiService({
			method: 'POST',
			path: '/account/upsert-preferences',
			token: cookies.accessToken,
			options: { data: { gender: gender?.value, wantToMeet: wantToMeet?.value } },
			onSuccess: () => {
				setSearchParams({ step: '3' });
				showNotification(NotifType.SUCCESS, 'Preferences saved', '');
			},
			onError: () => {
				showNotification(NotifType.ERROR, 'Some preferences are not valid', '');
			}
		})
	}

	useEffect(() => {
		apiService({
			method: 'GET',
			path: '/account/preferences',
			token: cookies.accessToken,
			onSuccess: (data) => {
				if (!data.gender || !data.wantToMeet)
					return ;
				gendersOptions.forEach((g) => {
					if (g.value === data.gender)
						setGender(g);
				});
				wantToMeetOptions.forEach((w) => {
					if (w.value === data.wantToMeet)
						setWantToMeet(w);
				});
				setAlreadySet(true);
			},
			onError: () => { setAlreadySet(false) }
		})
	}, []);

	return (
		<div className='flex py-4 flex-col gap-8 min-h-[400px] justify-center'>
			<h1 className="text-2xl">What are your preferences, { user?.username } ?</h1>
			<div className='h-96 w-full !rounded-lg flex flex-col gap-4 justify-center'>
				<div className="flex sm:flex-row flex-col justify-center gap-4">
					{/* Sexual oriation select */}
					<p className="text-lg self-center">I am a</p>
					<Select value={gender} onChange={setGender} placeholder='...' options={gendersOptions} className='w-32 mt-0' />
					<p className="text-lg self-center">and</p>
				</div>
				<div className="flex sm:flex-row flex-col justify-center gap-4">
					{/* Sexual oriation select */}
					<p className="text-lg self-center">I would like to meet</p>
					<Select value={wantToMeet} onChange={setWantToMeet} placeholder='...' options={wantToMeetOptions} className='w-32 mt-0' />
					<p className="text-lg self-center">.</p>
				</div>
			</div>
			
			<div className='flex justify-center gap-2'>
				{<button className='bg-indigo-500 text-white rounded-lg text-sm' onClick={() => setSearchParams({ step: '1' })}>
					<ArrowLeftIcon className='rounded-md px-2 py-2 text-sm font-medium h-8 w-8 cursor-pointer' />
				</button>}
				<button className='bg-indigo-500 text-white px-8 py-2 rounded-lg text-sm' onClick={() => setIsConfirmOpen(true)}>
					Save
				</button>
				{alreadySet && <button className='bg-indigo-500 text-white rounded-lg text-sm' onClick={() => setSearchParams({ step: '3' })}>
					<ArrowRightIcon className='rounded-md px-2 py-2 text-sm font-medium h-8 w-8 cursor-pointer' />
				</button>}
			</div>
			<ConfirmModal
				isOpen={isConfirmOpen}
				text='Save your preferences ?'
				littleText='You can always change it later'
				onConfirm={confirm}
				onCancel={() => setIsConfirmOpen(false)}
			/>
		</div>
	)
}