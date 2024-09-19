import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authProvider';
import { useSearchParams } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import apiService from '../../services/apiService';
import { showNotification, NotifType } from '../../components/Notif';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

type Tag = {
	id: number;
	content: string;
	isSelected?: boolean;
}

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ')
}

export default function StepInterests() {

	const { user, cookies } = useAuth();
	const [_, setSearchParams] = useSearchParams();
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	const [tagLists, setTagLists] = useState<Tag[]>([]);

	const [alreadySet, setAlreadySet ] = useState(false);

	function toggleSelectTag(tag: Tag) {
		const newTags = tagLists.map((t) => {
			if (t.id === tag.id)
				t.isSelected = !t.isSelected;
			return t;
		});
		setTagLists(newTags);
	}

	function confirm() {
		const selectedTags = tagLists.filter((t) => t.isSelected);
		apiService({
			method: 'POST',
			path: '/account/upsert-interest-tags',
			token: cookies.accessToken,
			options: { data: { tags: selectedTags } },
			onSuccess: () => {
				setSearchParams({ step: '5' });
				showNotification(NotifType.SUCCESS, 'Interests saved', '');
			},
			onError: () => {
				showNotification(NotifType.ERROR, 'Interests is not valid', '');
			}
		})
	}

	function getTagList(userTags: Tag[]) {
		apiService({
			method: 'GET',
			path: '/account/all-tags',
			token: cookies.accessToken,
			onSuccess: (data) => {
				for (let tag of data.tags) {
					if (userTags.find((t) => t.id === tag.id))
						tag.isSelected = true;
					else
						tag.isSelected = false;
				}
				console.log(data.tags);
				setTagLists(data.tags);
			},
			onError: () => {}
		})
	}

	function getUserTagsList() {
		apiService({
			method: 'GET',
			path: '/account/interest-tags',
			token: cookies.accessToken,
			onSuccess: (data) => {
				if (data.tags.length !== 0)
					setAlreadySet(true);
				getTagList(data.tags);
			},
			onError: () => { setAlreadySet(false) }
		})
	}

	useEffect(() => {
		getUserTagsList();
	}, []);

	return (
		<div className='flex py-4 flex-col gap-8 min-h-[400px] justify-center'>
			<h1 className="text-2xl">What are you interested in { user?.username } ?</h1>
			<div className='h-96 w-full !rounded-lg flex flex-col gap-4 justify-center'>
				<div className="flex sm:flex-row flex-col justify-center gap-4">
					{ tagLists.length && <div className="grid grid-cols-4 gap-4">
						{tagLists.map((tag, index) => (
						<div key={index} onClick={() => toggleSelectTag(tag)} className={classNames(tag.isSelected ? "bg-green-500/30" : "bg-white/10", "cursor-pointer flex flex-col gap-1  px-3 py-1 rounded-full text-sm")}>
							{tag.content}
						</div>
						))}
					</div>}
				</div>
			</div>
			
			<div className='flex justify-center gap-2'>
				{<button className='bg-indigo-500 text-white rounded-lg text-sm' onClick={() => setSearchParams({ step: '3' })}>
					<ArrowLeftIcon className='rounded-md px-2 py-2 text-sm font-medium h-8 w-8 cursor-pointer' />
				</button>}
				<button className='bg-indigo-500 text-white px-8 py-2 rounded-lg text-sm' onClick={() => setIsConfirmOpen(true)}>
					Save
				</button>
				{alreadySet && <button className='bg-indigo-500 text-white rounded-lg text-sm' onClick={() => setSearchParams({ step: '5' })}>
					<ArrowRightIcon className='rounded-md px-2 py-2 text-sm font-medium h-8 w-8 cursor-pointer' />
				</button>}
			</div>
			<ConfirmModal
				isOpen={isConfirmOpen}
				text='Save your interests ?'
				littleText='You can always change it later'
				onConfirm={confirm}
				onCancel={() => setIsConfirmOpen(false)}
			/>
		</div>
	)
}