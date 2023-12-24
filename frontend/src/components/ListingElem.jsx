import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingElem({ listing }) {
  return (
    <div className="shadow-sm hover:shadow-md overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 rounded-md"
          src={listing.imageUrls[0]}
        />
        <div className="p-3 flex flex-row gap-2">
          <h3 className="text-lg font-semibold text-slate-800">
            {listing.name}
          </h3>
          <h3 className="text-lg font-semibold text-slate-600 truncate">
            {listing.modelOf}
          </h3>
        </div>
        <div className="p-3 flex flex-row gap-2">
          <p className="text-lg font-semibold text-slate-800">
            {listing.price.toLocaleString('fi-FI')} €
          </p>
          <MdLocationOn className="h-5 w-5 ml-3" />
          <p className="truncate">{listing.locationOf}</p>
        </div>
      </Link>
    </div>
  );
}
