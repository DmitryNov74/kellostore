import React, { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const [imageUploadError, setImageUploadError] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    modelOf: '',
    isFullSet: true,
    movement: 'automatic',
    locationOf: '',
    year: '',
    condition: '',
    price: 0,
    description: '',
  });

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 6) {
      const pictures = [];
      for (let i = 0; i < files.length; i++) {
        pictures.push(imageStore(files[i]));
      }
      Promise.all(pictures).then((urls) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        setImageUploadError(false);
      });
    } else {
      setImageUploadError('Kuvia pitää olla vähintään 1 ja enintään 5 ');
    }
  };

  const imageStore = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((url, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'quartz' || e.target.id === 'automatic') {
      setFormData({ ...formData, movement: e.target.id });
    }
    if (e.target.id === 'isFullSet') {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-5">
        Luo uusi ilmoitus
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-col gap-3 flex-1 ">
          <input
            className="border p-3"
            type="text"
            placeholder="Brändi"
            id="name"
            minLength="1"
            maxLength="30"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <input
            className="border p-3"
            type="text"
            placeholder="Malli"
            id="modelOf"
            minLength="1"
            maxLength="30"
            required
            onChange={handleChange}
            value={formData.modelOf}
          />
          <input
            className="border p-3"
            type="text"
            placeholder="Kellon kunto"
            id="condition"
            minLength="1"
            maxLength="200"
            required
            onChange={handleChange}
            value={formData.condition}
          />
          <input
            className="border p-3"
            type="text"
            placeholder="Kellon sijainti"
            id="locationOf"
            minLength="1"
            maxLength="100"
            required
            onChange={handleChange}
            value={formData.locationOf}
          />
          <textarea
            className="border p-3"
            type="text"
            placeholder="Kuvaus..."
            id="description"
            minLength="1"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <div className="flex gap-5 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="quartz"
                className="w-5"
                onChange={handleChange}
                checked={formData.movement === 'quartz'}
              />
              <span>Quartsi</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="automatic"
                className="w-5"
                onChange={handleChange}
                checked={formData.movement === 'automatic'}
              />
              <span>Automaatti</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="isFullSet"
                className="w-5"
                onChange={handleChange}
                checked={formData.isFullSet}
              />
              <span>Full Set</span>
            </div>
          </div>
          <div className=" flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <input
                className="p-3 border rounded-md"
                type="number"
                id="price"
                min="1"
                required
                onChange={handleChange}
                checked={formData.price}
              />
              <label>Hintapyyntö</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border rounded-md"
                type="text"
                id="year"
                min="1"
                required
                onChange={handleChange}
                checked={formData.year}
              />
              <label>Vuosimalli</label>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-3">
          <p className="font-semibold p-3">Lisää kuvat</p>
          <div className="flex gap-5">
            <input
              className="p-3 w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              onClick={handleImageSubmit}
              className="p-3 border text-gray-700 hover:opacity-50 rounded-md border-slate-600"
              type="button"
            >
              LATAA KUVAT
            </button>
          </div>
          <span className="text-red-800">
            {imageUploadError && imageUploadError}
          </span>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between border border-slate-200 rounded-md p-3"
              >
                <img src={url} className="w-20 h-20 rounded-md" />
                <button
                  onClick={() => handleDeleteImage(index)}
                  className="hover:text-blue-400"
                >
                  Poista kuva
                </button>
              </div>
            ))}
          <button className="p-3 bg-slate-500 text-white rounded-md hover:opacity-50">
            LUO ILMOITUS
          </button>
        </div>
      </form>
    </main>
  );
}
