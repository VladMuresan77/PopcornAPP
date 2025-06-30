import React from "react";
import {GiPopcorn} from "react-icons/gi"
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { CiLogin } from "react-icons/ci";


type Props={
    query: string
    onChange: (value:string) => void;
}

const Navbar = ({query, onChange}:Props) => {
  return (
    <nav className="bg-slate-800 shadow-lg flex flex-col md:flex-row items-center justify-between py-4 px-6 md:px-16 fixed top-0 left-0 w-full z-50">
        <Link to="/">
        <span className="font-semibold text-lg flex items-center gap-1 text-gray-200">
           <GiPopcorn className="text-5xl" />
           <span className="font-semibold text-2xl">PopcornApp</span>
        </span>
        </Link>

      
    <SearchBar  query={query} onChange={onChange} />

        <div className="flex items-center gap-5 text-black">

        <Link to="/home" className="py-1 px-3 text-lg font-light text-white hover:text-sky-300 rounded-2xl hover:bg-slate-700 transition duration-300">
        Home
        </Link>
         <Link to="/myList" className="py-1 px-3 text-lg font-light text-white hover:text-sky-300 rounded-2xl hover:bg-slate-700 transition duration-300">
        My List
        </Link>
         <Link to="/about" className="py-1 px-3 text-lg font-light text-white hover:text-sky-300 rounded-2xl hover:bg-slate-700 transition duration-300">
        About
        </Link>
         <Link to="/contact" className="py-1 px-3 text-lg font-light text-white hover:text-sky-300 rounded-2xl hover:bg-slate-700 transition duration-300">
        Contact
        </Link>
        <Link
  to="/login"
  className="py-1 px-3 text-lg font-light text-white hover:text-sky-300 rounded-2xl hover:bg-slate-700 transition duration-300 flex items-center gap-2"
>
  <CiLogin className="text-2xl" />
  
</Link>


        </div>
    </nav>
  )
}

export default Navbar