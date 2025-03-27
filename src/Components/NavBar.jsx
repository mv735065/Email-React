import React from 'react'

const NavBar = ({activeFilter,handleFilter,handleSearchQuery}) => {
  return (
    <div className="mx-8 mb-4 flex flex-row gap-4">
    <p className="px-4 py-1">Filter</p>
    {["All", "Read", "Unread", "Favourite", "SortByTime"].map((filter) => (
      <button
        key={filter}
        className={`cursor-pointer px-4 py-1 rounded-md ${
          activeFilter === filter
            ? "border border-[#CFD2DC] bg-[#E1E4EA]"
            : "border-transparent"
        }`}
        onClick={() => handleFilter(filter)}
      >
        {filter}
      </button>
    ))}
    <input
      className="ml-auto border border-[#CFD2DC] w-2/5 pl-4"
      placeholder="Search by name"
      onChange={handleSearchQuery}
    />
  </div>
  )
}

export default NavBar