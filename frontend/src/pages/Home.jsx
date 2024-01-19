import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import ListingElem from '../components/ListingElem';

export default function Home() {
  const [rolexWatch, setRolexWatch] = useState([]);
  const [paneraiWatch, setPaneraiWatch] = useState([]);
  const [omegaWatch, setOmegaWatch] = useState([]);
  const slides = [
    'https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?cs=srgb&dl=pexels-pixabay-280250.jpg&fm=jpg',
    'https://c8.alamy.com/zooms/9/de0ab2b6da644063823f1610033e530d/kwyjf6.jpg',
  ];
  SwiperCore.use([Navigation]);
  useEffect(() => {
    const fetchPanerai = async () => {
      try {
        const res = await fetch('/api/listing/get?searchTerm=panerai&limit=3');
        const data = await res.json();
        setPaneraiWatch(data);
        fetchRolex();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRolex = async () => {
      try {
        const res = await fetch('/api/listing/get?searchTerm=rolex&limit=3');
        const data = await res.json();
        setRolexWatch(data);
        fetchOmega();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchOmega = async () => {
      try {
        const res = await fetch('/api/listing/get?searchTerm=omega&limit=3');
        const data = await res.json();
        setOmegaWatch(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPanerai();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-3 p-20 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-600 font-bold text-3xl italic">
          Osto <span className="text-5xl">Vaihto</span>Myytni
        </h1>
        <div>cnccnncncncncncncncnc</div>
      </div>

      <Swiper navigation>
        {slides.length > 0 &&
          slides.map((slide) => (
            <SwiperSlide key={slide}>
              <div
                style={{
                  background: `url(${slide}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {paneraiWatch && paneraiWatch.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-500">Panerai</h2>
              <Link
                className="text-blue-300 hover:underline"
                to={'/search?searchTerm=panerai'}
              >
                Kaikki Panerai kellot...
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {paneraiWatch.map((listing) => (
                <ListingElem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {omegaWatch && omegaWatch.length > 0 && (
          <div className="bg-slate-50 items-center">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-500">Omega</h2>
              <Link
                className="text-blue-300 hover:underline"
                to={'/search?searchTerm=omega'}
              >
                Kaikki Omega kellot...
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {omegaWatch.map((listing) => (
                <ListingElem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rolexWatch && rolexWatch.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-500">Rolex</h2>
              <Link
                className="text-blue-300 hover:underline"
                to={'/search?searchTerm=rolex'}
              >
                Kaikki Rolex kelot...
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rolexWatch.map((listing) => (
                <ListingElem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
