import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserSuccess,
  signoutUserFailure,
  signoutUserSuccess,
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [userListings, setUserListings] = useState([]);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [formData, setFormData] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
    handleShowListings();
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setProfileUpdated(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess(data));
    } catch (error) {
      next(error);
    }
  };

  const handleShowListings = async () => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      setUserListings(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center mt-5">Profiili</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          accept="images/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          className="rounded-full h-24 w-24 self-center mt-5"
          src={formData.avatar || currentUser.avatar}
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Virhe latauksessa (kuvan pitää olla enintään 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Ladataan... ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Kuva on ladattu!</span>
          ) : (
            ''
          )}
        </p>
        <input
          className="border p-3"
          type="text"
          placeholder="Käyttäjänimi"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          className="border p-3"
          type="email"
          placeholder="Sähköposti"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          className="border p-3"
          type="password"
          placeholder="Salasana"
          id="password"
          onChange={handleChange}
        />
        <button className="bg-slate-400 rounded-md text-white p-3 hover:opacity-70">
          PÄIVITÄ PROFIILI
        </button>
        <Link
          className="bg-blue-400 text-white rounded-md p-3 text-center"
          to={'/create-listing'}
        >
          LISÄÄ KELLO
        </Link>
      </form>
      {profileUpdated && (
        <p className="text-green-500">Tilisi on päivitetty!</p>
      )}
      <div className="flex justify-between mt-2">
        {userListings.length === 0 && (
          <button
            onClick={handleDeleteUser}
            className="text-red-700 cursor-pointer"
          >
            Poista Tili
          </button>
        )}

        <span onClick={handleSignOut} className="text-green-700 cursor-pointer">
          Kirjaudu Ulos
        </span>
      </div>

      {userListings &&
        userListings.length > 0 &&
        userListings.map((listing) => (
          <div
            key={listing._id}
            className="border p-3 rounded-md flex justify-between items-center mt-5 gap-3"
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                className="w-10 h-10 rounded-lg"
              />
            </Link>
            <Link
              to={`/listing/${listing._id}`}
              className="font-semibold truncate"
            >
              <p>
                {listing.name} {listing.modelOf}
              </p>
            </Link>
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleListingDelete(listing._id)}
                className="text-red-800"
              >
                Poista
              </button>
              <Link to={`/update-listing/${listing._id}`}>
                <button className="text-yellow-300">Muokkaa</button>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
}

//firebase sääntö koskien kuvia
/* allow read;
      allow write:if
      request.resource.size < 2 * 1024 * 1024 &&
      request.resource.contentType.matches('image/.*') */
