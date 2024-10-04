import { AdjustmentsHorizontalIcon, ArrowsUpDownIcon, ArrowDownIcon, ArrowUpIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { useState } from 'react';

type FilterComponentProps = {
	filters: {
		ageMin: number,
		ageMax: number,
		fameMin: number,
		fameMax: number,
		distance: number,
		selectedTags: string[],
	},
	onFilterChange: (filters: {
		ageMin?: number,
		ageMax?: number,
		fameMin?: number,
		fameMax?: number,
		distance?: number,
		selectedTags?: string[],
	}) => void,
	isOpen: boolean,
	setIsOpen: (isOpen: boolean) => void,
	sort: SortBy,
	setSort: (sort: SortBy) => void,
};

type SortBy = {
	by: 'age' | 'fame' | 'distance' | 'tag' | 'none';
	asc: boolean;
}

const FilterComponent = ({ filters, onFilterChange, isOpen, setIsOpen, sort, setSort }: FilterComponentProps) => {
    const { ageMin, ageMax, fameMin, fameMax, distance, selectedTags } = filters;
  
	const [isSortOpen, setIsSortOpen] = useState(false);

    // Fonction pour gérer la mise à jour des tags
    const toggleTagSelection = (tag: string) => {
      const newSelectedTags = selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag];
  
      onFilterChange({ selectedTags: newSelectedTags });
    };

	function onClickSort(sortBy: 'age' | 'fame' | 'distance' | 'tag' | 'none') {
		if (sort.by === sortBy)
			setSort({ by: sortBy, asc: !sort.asc });
		else
			setSort({ by: sortBy, asc: true });
	}

	return (
		<div className='w-full bg-indigo-500 mt-2 p-5'>
			<div className='flex flex-row justify-around items-center'>
				{/* <span className='justify-center text-white text-xl block'>Filters</span> */}
				<button onClick={() => {setIsOpen(!isOpen); setIsSortOpen(false)}}>
					<AdjustmentsHorizontalIcon className="h-6 w-6" />
				</button>
				<button onClick={() => {setIsSortOpen(!isSortOpen); setIsOpen(false)}}>
					<ArrowsUpDownIcon className="h-6 w-6" />
				</button>
			</div>


			{isOpen && !isSortOpen && (
			<div>
				<div className='flex flex-wrap justify-center'>
				<div className="mb-4 p-5">
					<span className='p-1 text-white'>Age range</span>
					<input
						type="number"
						className="w-20 rounded-md border-0 bg-white/5 px-4 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
						placeholder="Min" 
						value={ageMin} 
						onChange={(e) => onFilterChange({ ageMin: Number(e.target.value) })}
					/>
					<span className='p-1 text-white'>to</span>
					<input 
						type="number" 
						className="w-20 rounded-md border-0 bg-white/5 px-4 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
						placeholder="Max" 
						value={ageMax} 
						onChange={(e) => onFilterChange({ ageMax: Number(e.target.value) })}
					/>
				</div>
				<div className="mb-4 p-5">
					<span className='p-1 text-white'>Fame range</span>
					<input 
					type="number" 
					className="w-20 rounded-md border-0 bg-white/5 px-4 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
					placeholder="Min" 
					value={fameMin} 
					onChange={(e) => onFilterChange({ fameMin: Number(e.target.value) })}
					/>
					<span className='p-1 text-white'>to</span>
					<input 
					type="number" 
					className="w-20 rounded-md border-0 bg-white/5 px-4 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
					placeholder="Max" 
					value={fameMax} 
					onChange={(e) => onFilterChange({ fameMax: Number(e.target.value) })}
					/>
				</div>
				<div className="mb-4 p-5">
					<span className='p-1 text-white'>Distance</span>
					<input 
					type="number" 
					className="w-20 rounded-md border-0 bg-white/5 px-4 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
					placeholder="Max Distance (km)" 
					value={distance} 
					onChange={(e) => onFilterChange({ distance: Number(e.target.value) })}
					/>
				</div>
				</div>

				<div className="flex flex-wrap gap-2 justify-center">
					{[
					{ id: 11, content: "Animals" },
					{ id: 1, content: "Art" },
					{ id: 9, content: "Books" },
					{ id: 18, content: "DIY" },
					{ id: 16, content: "Fitness" },
					{ id: 6, content: "Food" },
					{ id: 8, content: "Games" },
					{ id: 17, content: "Health" },
					{ id: 7, content: "Movies" },
					{ id: 2, content: "Music" },
					{ id: 12, content: "Nature" },
					{ id: 3, content: "Photography" },
					{ id: 14, content: "Politics" },
					{ id: 13, content: "Science" },
					{ id: 4, content: "Sports" },
					{ id: 15, content: "Technology" },
					{ id: 5, content: "Travel" },
					{ id: 10, content: "TV" }
					].map((tag) => (
					<button
						key={tag.id}
						onClick={() => toggleTagSelection(tag.content)}
						className={`px-3 py-1 rounded-full text-sm ${
						selectedTags.includes(tag.content) ? 'bg-indigo-700 text-white' : 'bg-white text-gray-700'
						}`}
					>
						{/* classNames(tagContained(tag) ? "bg-indigo-500" : "bg-white/10", "flex flex-col gap-1 px-3 py-1 rounded-full text-sm")} */}
						{tag.content}
					</button>
					))}
				</div>
				</div>
			)}
			{isSortOpen && !isOpen && (
				<div>
					<div className='flex flex-wrap justify-center gap-2'>
						<span className='p-1 text-white'>Sort by </span>
						<button onClick={() => onClickSort('age')} className={`flex flex-row gap-1 items-center px-3 py-1 rounded-full text-sm ${sort.by === 'age' ? 'bg-indigo-700 text-white' : 'bg-white text-gray-700'}`}>
							<div>Age</div>
							{sort.by === 'age' && (sort.asc ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />)}
						</button>
						<button onClick={() => onClickSort('fame')} className={`flex flex-row gap-1 items-center px-3 py-1 rounded-full text-sm ${sort.by === 'fame' ? 'bg-indigo-700 text-white' : 'bg-white text-gray-700'}`}>
							<div>Fame</div>
							{sort.by === 'fame' && (sort.asc ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />)}
						</button>
						<button onClick={() => onClickSort('distance')} className={`flex flex-row gap-1 items-center px-3 py-1 rounded-full text-sm ${sort.by === 'distance' ? 'bg-indigo-700 text-white' : 'bg-white text-gray-700'}`}>
							<div>Distance</div>
							{sort.by === 'distance' && (sort.asc ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />)}
						</button>
						<button onClick={() => onClickSort('tag')} className={`flex flex-row gap-1 items-center px-3 py-1 rounded-full text-sm ${sort.by === 'tag' ? 'bg-indigo-700 text-white' : 'bg-white text-gray-700'}`}>
							<div>Tags</div>
							{sort.by === 'tag' && (sort.asc ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />)}
						</button>
						<button onClick={() => onClickSort('none')} className={`flex flex-row ml-4 items-center px-2 py-1 rounded-full text-sm ${sort.by === 'tag' ? 'bg-indigo-700 text-white' : 'bg-white text-gray-700'}`}>
							<XMarkIcon className="h-4 w-4" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
	
  export default FilterComponent;
  
