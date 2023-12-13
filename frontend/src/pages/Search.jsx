import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    movement: 'automatic',
    isFullSet: true,
  });
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  console.log(listings);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchFromUrl = urlParams.get('searchTerm');
    const isFullSetfromUrl = urlParams.get('isFullSet');
    const movementFromUrl = urlParams.get('movement');

    if (searchFromUrl || isFullSetfromUrl || movementFromUrl) {
      setSidebarData({
        searchTerm: searchFromUrl || '',
        isFullSet: isFullSetfromUrl === 'true' ? true : false,
        movement: movementFromUrl || 'automatic',
      });
    }
    const fetchListings = async () => {
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setListings(data);
    };
    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'quartz' || e.target.id === 'automatic') {
      setSidebarData({ ...sidebarData, movement: e.target.id });
    }
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === 'isFullSet') {
      setSidebarData({
        ...sidebarData,
        [e.target.id]: e.target.checked,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('isFullSet', sidebarData.isFullSet);
    urlParams.set('movement', sidebarData.movement);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-6 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <input
              className="border p-3 w-full"
              type="text"
              placeholder="Etsi..."
              id="searchTerm"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex">
            <div className="flex gap-2 flex-wrap items-center p-3">
              <input
                type="checkbox"
                id="isFullSet"
                checked={sidebarData.isFullSet}
                onChange={handleChange}
              />
              <span>Full Set</span>
            </div>
            <div className="flex gap-2 flex-wrap items-center p-3">
              <input
                type="checkbox"
                id="quartz"
                checked={sidebarData.movement === 'quartz'}
                onChange={handleChange}
              />
              <span>Kvartsi</span>
            </div>
            <div className="flex gap-2 flex-wrap items-center p-3">
              <input
                type="checkbox"
                id="automatic"
                checked={sidebarData.movement === 'automatic'}
                onChange={handleChange}
              />
              <span>Automaatti</span>
            </div>
          </div>
          <button className="bg-slate-600 rounded-md text-white p-3 hover:opacity-80">
            ETSI
          </button>
        </form>
      </div>
      <div>
        <h1 className="text-2xl text-slate-700 m-4">
          Löytyi seuraavat kellot:
        </h1>
      </div>
    </div>
  );
}
