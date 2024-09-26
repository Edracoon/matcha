import { useState, useEffect, useMemo } from 'react';
import apiService from '../../services/apiService';
import { useAuth } from '../../contexts/authProvider';
import { NotifType, showNotification } from '../../components/Notif';
import { useSearchParams } from 'react-router-dom';
import { ControlPosition, Map, MapControl } from '@vis.gl/react-google-maps';
import { AutocompleteLocation } from './AutocompleteLocation';
import ConfirmModal from '../../components/ConfirmModal';
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function StepLocation() {

	const { cookies } = useAuth();

	const [autoLocPos, setAutoLocPos] = useState<{lat: number, lng: number} | undefined>(undefined);
	const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [alreadySet, setAlreadySet] = useState(false);

	const [_, setSearchParams] = useSearchParams();

	async function success(pos: any) {
		setAutoLocPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
	}

	//  When error, force find location with ip-api
	function errors() {
		apiService({
			method: 'GET',
			path: 'http://ip-api.com/json/',
			onSuccess: (data) => {
				setAutoLocPos({ lat: data.lat, lng: data.lon })
			},
			onError: () => {}
		})
	}

	function askForLocation() {
		if (!navigator.geolocation || autoLocPos)
			return;
		navigator.geolocation.getCurrentPosition(success, errors, {enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
	}

	function confirm() {
		if (!pos) {
			showNotification(NotifType.ERROR, 'You must select a location', '');
			setIsConfirmOpen(false);
			return
		}
		apiService({
			method: 'POST',
			path: '/account/location',
			token: cookies.accessToken,
			options: { data: { lat: pos?.lat, lng: pos?.lng } },
			onSuccess: () => {
				setSearchParams({ step: '2' });
				showNotification(NotifType.SUCCESS, 'Location set', '');
			},
			onError: (error) => {
				console.log(error);
			}
		})
	}

	useEffect(() => {
		apiService({
			method: 'GET',
			path: '/account/myself',
			token: cookies.accessToken,
			onSuccess: ({ user }) => {
				if (user.latitude && user.longitude) {
					setAutoLocPos({ lat: user.latitude, lng: user.longitude });
					setAlreadySet(true);
				}
				else
					askForLocation();
			},
			onError: () => {
				askForLocation();
			}
		})
	}, [navigator]);

	const pos = useMemo(() => {
		const googleLoc = selectedPlace?.geometry?.location;
		const location = googleLoc ? { lng: googleLoc.lng(), lat: googleLoc.lat() } : autoLocPos
		return location;
	}, [selectedPlace, autoLocPos]);

	const googleMap = useMemo(() => {
		return (
			<>
				<Map
					className='h-96 w-full !rounded-lg'
					defaultCenter={{ lat: 46.7, lng: 1.7 }}
					defaultZoom={5}
					gestureHandling={'greedy'}
					disableDefaultUI={true}
					center={pos}
					zoom={pos ? 13 : 5}
					mapId={'49ae42fed52588c3'}
					draggable={false}
				>
					<MapControl position={ControlPosition.TOP_CENTER}>
						<AutocompleteLocation onPlaceSelect={setSelectedPlace} />
					</MapControl>
				</Map>
			</>
		);
	}, [pos]);

	return (
		<div className='flex py-4 flex-col gap-8 min-h-[400px] justify-center'>
			<h1 className="text-xl">Let's start by setting up your location so we can find people near your area !</h1>
			{googleMap}
			<div className='flex justify-center gap-2'>
				<button className='bg-indigo-500 text-white px-8 py-2 rounded-lg text-sm' onClick={() => setIsConfirmOpen(true)}>
					Save
				</button>
				{alreadySet && <button className='bg-indigo-500 text-white rounded-lg text-sm' onClick={() => setSearchParams({ step: '2' })}>
					<ArrowRightIcon className='rounded-md px-2 py-2 text-sm font-medium h-8 w-8 cursor-pointer' />
				</button>}
			</div>
			<ConfirmModal
				isOpen={isConfirmOpen}
				text='Are you sure you want to set this location ?'
				littleText='You can always change it later'
				onConfirm={confirm}
				onCancel={() => setIsConfirmOpen(false)}
			/>
		</div>
	);
}