// TS LESSON: typing component props with interface
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

const SearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search movies...",
}: SearchBarProps) => {
  // TS : typing keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch();
  };

  // TS LESSON: typing change events
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex gap-2 w-full max-w-xl">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400"
      />
      <button
        onClick={onSearch}
        className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition-colors"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
