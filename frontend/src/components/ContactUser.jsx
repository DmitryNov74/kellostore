import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ContactUser({ watchListing }) {
  const [watchOwner, setWatchOwner] = useState(null);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const res = await fetch(`/api/user/${watchListing.userRef}`);
        const data = await res.json();
        setWatchOwner(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOwner();
  }, [watchListing.userRef]);
  const onChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <>
      {watchOwner && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span>{watchOwner.username}</span>
          </p>
          <textarea
            name="message"
            id="message"
            onChange={onChange}
            placeholder="Kirjoita vieti tähän..."
            className="w-full border p-3 rounded-md"
          ></textarea>
          <Link
            to={`mailto:${watchOwner.email}?subject=Regarding ${watchListing.name}&body=${message}`}
            className="bg-slate-500 text-white text-center p-3 rounded-md"
          >
            LÄHETÄ
          </Link>
        </div>
      )}
    </>
  );
}
