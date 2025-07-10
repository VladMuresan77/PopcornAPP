import type { ChangeEvent } from 'react';

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
      className="w-full px-2 py-1 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-800 transition md:w-64 md:px-4 md:py-2 md:text-base"
      aria-label="Search movies"
    />
  );
};

export default SearchBar;
