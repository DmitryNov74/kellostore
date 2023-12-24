import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingElem from '../components/ListingElem';

export default function Search() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const fetchListings = async () => {
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      }
      setListings(data);
    };
    fetchListings();
  }, [location.search]);

  const onShowMore = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 8) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7">
        <h1 className="text-2xl text-slate-700 m-4">
          Löytyi seuraavat kellot:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {listings.length === 0 && <span>Hakemasi kelloja ei löytynyt</span>}
          {listings &&
            listings.map((listing) => (
              <ListingElem key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <button className="text-blue-400 w-full" onClick={onShowMore}>
              Näytä Lisää
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
//25 isful set
