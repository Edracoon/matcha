import { useState, useEffect } from 'react';
import apiService from '../services/apiService';
// import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authProvider';
import Navbar from '../components/Navbar';
import UserCard, { UserType } from '../components/UserCard';
import FilterComponent from '../components/FilterComponent';

export default function HomeView() {

	const { cookies } = useAuth();

	const [loading, setLoading] = useState(true);
	const [users, setUsers] = useState<UserType[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [tags, setTags] = useState([]);

	useEffect(() => {
		setLoading(true);
		apiService({
			method: 'POST',
			path: '/search',
			token: cookies.accessToken,
			onSuccess: (data) => {
				setUsers(data.users);
				setLoading(false);
			},
			onError: () => { }
		})

        apiService({
			method: 'GET',
			path: '/account/all-tags',
			token: cookies.accessToken,
			onSuccess: (data) => {
                console.log(data);
				setTags(data.tags);
			},
			onError: () => {}
		})
	}, []);

	const [filters, setFilters] = useState({
		ageMin: 18,
		ageMax: 100,
		fameMin: 1,
		fameMax: 100,
		distance: 100,
		selectedTags: [],
	});

	useEffect(() => {
		if (!isFilterOpen){
            setLoading(true);
            apiService({
                method: 'POST',
                path: '/search',
                token: cookies.accessToken,
                onSuccess: (data) => {
                    setUsers(data.users);
                    setLoading(false);
                },
                onError: () => { }
            })
            return ;
        }
		apiService({
			method: 'POST',
			path: '/search',
			token: cookies.accessToken,
			options: { 
                data: {
                    ageGap: {
                        min: filters.ageMin, 
                        max: filters.ageMax
                    }, 
                    fameGap: {
                        min: filters.fameMin / 100,
                        max: filters.fameMax / 100
                    },
                    distanceGap: {
                        min: 0, 
                        max: filters.distance
                    }, 
                    tags: filters.selectedTags 
                }
            },
			onSuccess: (data) => {
                console.log("Refresh data with filters : ", data);
				setUsers(data.users);
				setLoading(false);
			},
			onError: () => { }
		})
	}, [cookies.accessToken, filters.ageMax, filters.ageMin, filters.distance, filters.fameMax, filters.fameMin, filters.selectedTags, isFilterOpen]);

      const handleFilterChange = (newFilters) => {
        setFilters((prevFilters) => ({
          ...prevFilters,
          ...newFilters, // Met à jour uniquement les parties modifiées du filtre
        }));
      };

	return (
		<>
			<Navbar />
            <FilterComponent filters={filters} onFilterChange={handleFilterChange} isOpen={isFilterOpen} setIsOpen={setIsFilterOpen}/>
			<div className="p-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 ">
				{loading && 
					Array.from({ length: 12 }).map(() => (
						<div className='animate-pulse rounded-lg bg-indigo-500 p-4 text-left'>
							<img alt="" className="animate-pulse aspect-[13/13] w-full rounded-lg object-cover" src={""} />
							<div className='flex flex-row justify-center w-full gap-4 pt-2'>
								<button className="text-red-400 bg-white p-2 rounded-full text-lg sm:!w-auto z-10 !gap-0 z-1">
								</button>
								<button className="text-green-400 bg-white p-2 rounded-full text-lg sm:!w-auto z-10 !gap-0 z-1">
								</button>
							</div>
							<div className='flex flex-col sm:flex-row justify-between w-full'>
								<div className='flex flex-row align-middle gap-1'>
									<h3 className="text-sm sm:text-lg font-semibold leading-8 tracking-tight text-white">...,</h3>
									<p className="text-sm sm:text-lg leading-8 text-white font-medium">...</p>
								</div>
								<p className="text-sm leading-8 text-gray-200 font-semibold">... 🤝</p>
							</div>
							<div className='flex flex-row justify-between w-full'>
								<p className="text-sm leading-6 text-gray-300">... km</p>
								<p className="text-sm leading-6 text-gray-200 font-semibold">... 🔥</p>
							</div>
						</div>
					))
				}
				{!loading && users.map((u: UserType) => (
					<UserCard key={u.id} user={u} />
				))}
                {users.length === 0 && !loading && <div className="text-white text-2xl">No users found</div>}
   			</div>
		</>
	);
}