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
    <nav className="bg-slate-800 shadow-lg fixed top-0 left-0 w-full z-50 px-6 md:px-16 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Logo popcornApp */}
      <Link to="/" className="flex items-center gap-2 text-white">
        <GiPopcorn className="text-4xl" />
        <span className="text-2xl font-semibold">PopcornApp</span>
      </Link>

      {/* Search */}
      <SearchBar query={query} onChange={onChange} />

      {/* Nav Links */}
      <div className="flex items-center gap-5">
        {[
          { to: "/home", label: "Home" },
          { to: "/myList", label: "My List" },
          { to: "/about", label: "About" },
          { to: "/contact", label: "Contact" },
        ].map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="py-1 px-3 text-lg font-light text-white hover:text-sky-500 hover:bg-slate-700 rounded-2xl transition duration-300"
          >
            {label}
          </Link>
        ))}

        <Link
          to="/login"
          className="flex items-center gap-2 py-1 px-3 text-lg font-light text-white hover:text-sky-900 hover:bg-slate-700 rounded-2xl transition duration-300"
        >
          <CiLogin className="text-2xl" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
