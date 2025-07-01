import React, { ChangeEvent } from 'react';

type Props = {
  query: string;
  onChange: (value: string) => void;
};

const SearchBar: React.FC<Props> = ({ query, onChange }) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleInputChange}
      placeholder="Search movies..."
      className="w-full md:w-64 px-4 py-2 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-900 transition"
      aria-label="Search movies"
    />
  );
};

export default SearchBar;
