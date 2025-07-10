import React from "react";
import { GiPopcorn } from "react-icons/gi";
import { CiLogin } from "react-icons/ci";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

type Props = {
  query: string;
  onChange: (value: string) => void;
};

const Navbar: React.FC<Props> = ({ query, onChange }) => {
  return (
    <nav className="bg-zinc-900 shadow-lg fixed top-0 left-0 w-full z-50 px-4 md:px-16 py-2 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Logo popcornApp */}
      <Link to="/" className="flex items-center gap-2 text-white">
        <GiPopcorn className="text-4xl" />
        <span className="text-white font-semibold text-lg md:text-2xl">PopcornApp</span>
      </Link>

      {/* Search */}
      <div className="w-full md:w-64 ml-2">
      <SearchBar query={query} onChange={onChange} />
      </div>

      {/* Nav Links */}
      <div className="flex items-center gap-1 md:gap-2 text-sm md:text-base">
        {[
          { to: "/home", label: "Home" },
          { to: "/myList", label: "My List" },
          { to: "/about", label: "About" },
          { to: "/contact", label: "Contact" },
        ].map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="py-1 px-3 text-lg font-light text-white hover:text-red-800 hover:bg-zinc-700 rounded-2xl transition duration-300"
          >
            {label}
          </Link>
        ))}

        <Link
          to="/login"
          className="flex items-center gap-0.5 py-1 px-5 text-lg font-light text-white hover:text-red-800 hover:bg-zinc-700 rounded-2xl transition duration-300"
        >
          <CiLogin className="text-2xl" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
