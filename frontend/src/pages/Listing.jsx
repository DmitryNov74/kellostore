import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSelector } from 'react-redux';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { GiWatch } from 'react-icons/gi';
import { IoPricetagsOutline } from 'react-icons/io5';
import ContactUser from '../components/ContactUser';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [watchListing, setWatchListing] = useState(null);
  const [error, setError] = useState(false);
  const [contactUser, setContactUser] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          return;
        }
        setError(false);
        setWatchListing(data);
      } catch (error) {
        setError(true);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {watchListing && !error && (
        <div>
          <Swiper navigation>
            {watchListing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{ background: `url(${url}) center no-repeat` }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      <div className="flex flex-col max-w-2xl mx-auto p-3 my-2 gap-2">
        <div className="flex flex-row gap-2 text-3xl text-slate-800">
          <p>Brändi: {watchListing?.name}</p>
          <p>{watchListing?.modelOf}</p>
        </div>
        <div className="flex flex-col gap-2 text-2xl text-slate-700">
          <p>Hinta: {watchListing?.price.toLocaleString('fi-FI')} €</p>
          <p>Valmistuvuosi: {watchListing?.year}</p>
          <p>Koneisto: {watchListing?.movement}</p>
          <p>Full Set: {watchListing?.isFullSet}</p>
          <p>Sijainti: {watchListing?.locationOf}</p>
          <p>Kunto: {watchListing?.condition}</p>
        </div>
        <div>
          <p>{watchListing?.description}</p>
        </div>
        {currentUser &&
          watchListing?.userRef !== currentUser._id &&
          !contactUser && (
            <button
              onClick={() => setContactUser(true)}
              className="bg-slate-600 rounded-md text-white p-3 hover:opacity-30"
            >
              OTA YHTEYTTÄ KELLON OMISTAJAAN
            </button>
          )}
        {contactUser && <ContactUser watchListing={watchListing} />}
      </div>
    </main>
  );
}
