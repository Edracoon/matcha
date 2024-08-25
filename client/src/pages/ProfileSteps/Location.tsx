import { useState, useEffect, useMemo } from 'react';
// import { showNotification } from '../components/Notif';
import apiService from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authProvider';
import { NotifType, showNotification } from '../../components/Notif';
import { useSearchParams } from 'react-router-dom';
import { CheckIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/solid'
import { ControlPosition, Map, MapControl, Marker } from '@vis.gl/react-google-maps';
import { AutocompleteLocation } from './AutocompleteLocation';

export default function StepLocation() {

	const [autoLocPos, setAutoLocPos] = useState<{lat: number, lng: number} | undefined>(undefined);
	const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);

	const [_, setSearchParams] = useSearchParams();

	async function success(pos: any) {
		setAutoLocPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
	}

	//  When error, ask for location again
	function errors(err: any) {
		// console.log(`ERROR(${err.code}): ${err.message}`);
	}

	function askForLocation() {
		if (!navigator.geolocation)
			return;
		navigator.geolocation.getCurrentPosition(success, errors, {enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
	}

	function confirm() {
		setSearchParams({ step: '2' });
		showNotification(NotifType.SUCCESS, 'Location set', '');
	}

	useEffect(() => {
		showNotification(NotifType.INFO, 'Please allow location access', "");
		askForLocation();
	}, [navigator]);

	const pos = useMemo(() => {
		return selectedPlace?.geometry?.location || autoLocPos;
	}, [selectedPlace, autoLocPos]);

	const googleMap = useMemo(() => {
		return (
			<Map
				className='h-96 w-full rounded-lg'
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
		);
	}, [pos]);

	return (
		<div className='flex py-4 flex-col gap-8 min-h-[400px] justify-center'>
			<h1 className="text-2xl">Welcome !</h1>
			<p>Let's start by setting up your location so we can find people near your area.</p>
				{googleMap}
				<div className='flex justify-center'>
					<button className='bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm' onClick={() => confirm()}>
						Confirm location
					</button>
				</div>
		</div>
	);
}