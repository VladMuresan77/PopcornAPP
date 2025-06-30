type Props={
    query: string
    onChange: (value:string) => void;
}

const SearchBar = ({query,onChange}: Props) =>{
    return (
        <input
        type= "text"
        value={query}
        onChange={(e)=> onChange(e.target.value)}
        placeholder="Search movies..." 
        className="w-full md:w-64 px-4 py-2 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-sky-500 transition"/>
            )
}

export default SearchBar