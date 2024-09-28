import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import { useParams } from 'react-router-dom';
import apiService from '../services/apiService';
import { useAuth } from '../contexts/authProvider';

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
	lastname: string;
	latitude: number;
	longitude: number;
	tags: string[]; // Array of strings
	pictures: string[]; // Array of strings
	username: string;
	wantToMeet: string;
};

export default function ProfileView() {

	const { id } = useParams();
	const { cookies } = useAuth();
	const [profile, setProfile] = useState<UserType | undefined>();
	
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
	}, []);

	return (
		<>
			<Navbar />
			{profile &&
				<Carousel urlsArray={profile?.pictures} isEdit={false}  />
			}
		</>
	);
}