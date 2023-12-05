import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInSuccess, signInFailure } from '../redux/user/userSlice';

export default function Signin() {
  const [formData, setFormData] = useState({});
  const { error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center">Kirjautuminen</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
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
          KIRJAUDU SISÄÄN
        </button>
      </form>
      <div className="flex gap-2 mt-3">
        <p>Etkö vielä rekiströitynyt ? </p>
        <Link to={'/sign-up'}>
          <span className="text-blue-300">Rekiströidy</span>
        </Link>
      </div>
      {error && <p className="text-red-700">{error}</p>}
    </div>
  );
}
