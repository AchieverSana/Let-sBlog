import { Alert, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutSuccess } from '../redux/user/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Cloudinary unsigned upload config.
// Falls back to this project's real values so production keeps working
// even without these env vars set — override via .env for your own account.
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dl8tnmgmf';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFile]);

  if (!currentUser) {
    return (
      <div className='max-w-lg mx-auto p-3 w-full text-center my-7'>
        Loading profile...
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = () => {
    setImageUploadError(null);
    setImageUploadProgress(0);

    const data = new FormData();
    data.append('file', imageFile);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open(
      'POST',
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setImageUploadProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        setImageFileUrl(response.secure_url);
        setFormData({ ...formData, profilePicture: response.secure_url });
        setImageUploadProgress(null);
      } else {
        setImageUploadError('Could not upload image (file may be too large)');
        setImageUploadProgress(null);
        setImageFile(null);
      }
    };

    xhr.onerror = () => {
      setImageUploadError('Could not upload image. Please try again.');
      setImageUploadProgress(null);
      setImageFile(null);
    };

    xhr.send(data);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) { setUpdateUserError('No changes made'); return; }
    if (imageUploadProgress !== null) { setUpdateUserError('Please wait for image to upload'); return; }
    try {
      dispatch(updateStart());
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/update/${currentUser._id}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) { dispatch(updateFailure(data.message)); setUpdateUserError(data.message); }
      else { dispatch(updateSuccess(data)); setUpdateUserSuccess("Profile updated successfully"); }
    } catch (error) { dispatch(updateFailure(error.message)); setUpdateUserError(error.message); }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/delete/${currentUser._id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (!res.ok) dispatch(deleteUserFailure(data.message));
      else dispatch(deleteUserSuccess(data));
    } catch (error) { dispatch(deleteUserFailure(error.message)); }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/signout`, { method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (!res.ok) console.log(data.message);
      else dispatch(signoutSuccess());
    } catch (error) { console.log(error.message); }
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}
        >
          {imageUploadProgress !== null && (
            <CircularProgressbar
              value={imageUploadProgress}
              text={`${imageUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageUploadProgress !== null && imageUploadProgress < 100 ? 'opacity-60' : ''
            }`}
          />
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange} />
        <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange} />
        <TextInput type='password' id='password' placeholder='password' onChange={handleChange} />
        <button type='submit' disabled={loading} className='w-full rounded-lg bg-gradient-to-r from-teal-400 to-cyan-500 text-white py-3 font-semibold hover:opacity-90 disabled:opacity-70'>
          {loading ? 'Loading...' : 'Update'}
        </button>
        {currentUser.isAdmin && (
          <Link to='/create-post'>
            <button type='button' className='w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 font-semibold hover:opacity-90'>
              Create a post
            </button>
          </Link>
        )}
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess && <Alert color='success' className='mt-5'>{updateUserSuccess}</Alert>}
      {updateUserError && <Alert color='failure' className='mt-5'>{updateUserError}</Alert>}
      {error && <Alert color='failure' className='mt-5'>{error}</Alert>}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <ModalHeader />
        <ModalBody>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
            <div className='flex justify-center gap-4'>
              <button onClick={handleDeleteUser} className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600'>Yes, I&apos;m sure</button>
              <button onClick={() => setShowModal(false)} className='px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-white'>No, cancel</button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
