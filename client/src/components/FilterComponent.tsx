const FilterComponent = ({ filters, onFilterChange, isOpen, setIsOpen }) => {
    const { ageMin, ageMax, fameMin, fameMax, distance, selectedTags } = filters;
  
    // Fonction pour gérer la mise à jour des tags
    const toggleTagSelection = (tag) => {
      const newSelectedTags = selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag];
  
      onFilterChange({ selectedTags: newSelectedTags });
    };
  
    return (
      <div className='w-full bg-indigo-500 mt-2 p-5'>
        <div className='flex flex-row justify-around items-center'>
          <span className='justify-center text-white text-xl mb-4 block'>Filters</span>
            <button onClick={() => setIsOpen(!isOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-9.75 0h9.75" />
                </svg>
          </button>
        </div>
  

        {isOpen && (
          <div>
            <div className='flex flex-wrap'>
              <div className="mb-4 p-5">
                <span className='p-1 text-white'>Set an age gap</span>
                <input 
                  type="number" 
                  className="w-20 p-2 border border-gray-300 rounded-md" 
                  placeholder="Min" 
                  value={ageMin} 
                  onChange={(e) => onFilterChange({ ageMin: Number(e.target.value) })}
                />
                <span className='p-1 text-white'>to</span>
                <input 
                  type="number" 
                  className="w-20 p-2 border border-gray-300 rounded-md" 
                  placeholder="Max" 
                  value={ageMax} 
                  onChange={(e) => onFilterChange({ ageMax: Number(e.target.value) })}
                />
              </div>
              <div className="mb-4 p-5">
                <span className='p-1 text-white'>Set a fame gap</span>
                <input 
                  type="number" 
                  className="w-20 p-2 border border-gray-300 rounded-md" 
                  placeholder="Min" 
                  value={fameMin} 
                  onChange={(e) => onFilterChange({ fameMin: Number(e.target.value) })}
                />
                <span className='p-1 text-white'>to</span>
                <input 
                  type="number" 
                  className="w-20 p-2 border border-gray-300 rounded-md" 
                  placeholder="Max" 
                  value={fameMax} 
                  onChange={(e) => onFilterChange({ fameMax: Number(e.target.value) })}
                />
              </div>
              <div className="mb-4 p-5">
                <span className='p-1 text-white'>Distance</span>
                <input 
                  type="number" 
                  className="w-20 p-2 border border-gray-300 rounded-md" 
                  placeholder="Max Distance (km)" 
                  value={distance} 
                  onChange={(e) => onFilterChange({ distance: Number(e.target.value) })}
                />
              </div>
            </div>
  
            <div className="mt-4">
              <span className='p-1 text-white block'>Select Tags</span>
              <div className="flex flex-wrap mt-2">
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
                    className={`m-1 p-2 rounded-md border ${
                      selectedTags.includes(tag.content) ? 'bg-indigo-700 text-white' : 'bg-white text-gray-700'
                    }`}
                  >
                    {tag.content}
                  </button>
                ))}
              </div>
            </div>
  
            {/* Liste des tags sélectionnés */}
            <div className="mt-4">
              <span className='p-1 text-white block'>Selected Tags</span>
              <div className="flex flex-wrap mt-2">
                {selectedTags.length === 0 ? (
                  <p className='text-white'>No tags selected</p>
                ) : (
                  selectedTags.map((tag, index) => (
                    <span key={index} className='m-1 p-2 bg-indigo-700 text-white rounded-md'>
                      {tag}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default FilterComponent;
  
