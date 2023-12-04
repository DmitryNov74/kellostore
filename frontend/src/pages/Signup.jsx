import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center">Rekiströintilomake</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
        <input
          type="text"
          placeholder="Käyttäjänimi"
          className="border p-3"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Sähköposti"
          className="border p-3"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Salasana"
          className="border p-3"
          id="password"
          onChange={handleChange}
        />
        <button className="bg-slate-400 rounded-md text-white p-3 hover:opacity-70">
          REKISTRÖIDY
        </button>
      </form>
      <div className="flex gap-2 mt-3">
        <p>Joko olet rekiströitynyt ? </p>
        <Link to={'/sign-in'}>
          <span className="text-blue-300">Kirjaudu sisään</span>
        </Link>
      </div>
      {error && <p className="text-red-700">{error}</p>}
    </div>
  );
}
