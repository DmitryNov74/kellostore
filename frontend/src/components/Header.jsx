import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-gray-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-700">Käytetyt</span>
            <span className="text-slate-950">KELLOT</span>
          </h1>
        </Link>

        <form>
          <input type="text" placeholder="Etsi..." />
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline">Home</li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7"
                src={currentUser.avatar}
                alt={currentUser.name}
              />
            ) : (
              <li className="sm:inline">Kirjaudu</li>
            )}
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline">Meistä</li>
          </Link>
        </ul>
      </div>
    </header>
  );
}
