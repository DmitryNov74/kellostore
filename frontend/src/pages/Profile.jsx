import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';

export default function Profile() {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  console.log(formData);
  console.log(filePerc);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
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
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center mt-5">Profiili</h1>
      <form className="flex flex-col gap-4">
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
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input
          className="border p-3"
          type="text"
          placeholder="Käyttäjänimi"
          id="username"
        />
        <input
          className="border p-3"
          type="email"
          placeholder="Sähköposti"
          id="email"
        />
        <input
          className="border p-3"
          type="password"
          placeholder="Salasana"
          id="password"
        />
        <button className="bg-slate-400 rounded-md text-white p-3 hover:opacity-70">
          PÄIVITÄ PROFIILI
        </button>
      </form>
      <div className="flex justify-between mt-2">
        <span className="text-red-700 cursor-pointer">Poista Tili</span>
        <span className="text-green-700 cursor-pointer">Kirjaudu Ulos</span>
      </div>
    </div>
  );
}

//firebase rools
/* allow read;
      allow write:if
      request.resource.size < 2 * 1024 * 1024 &&
      request.resource.contentType.matches('image/.*') */
