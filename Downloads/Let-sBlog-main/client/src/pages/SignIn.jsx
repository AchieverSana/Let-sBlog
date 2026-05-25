import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='w-full max-w-4xl flex flex-col md:flex-row gap-10 items-center'>
        {/* Left */}
        <div className='flex-1 flex flex-col gap-4'>
          <Link to='/'>
            <span className='text-4xl font-extrabold dark:text-white'>
              <span className='px-2 py-1 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500 rounded-lg text-white'>
                Sana's
              </span>{' '}
              Blog
            </span>
          </Link>
          <p className='text-gray-500 dark:text-gray-400 text-sm leading-relaxed mt-2'>
            Welcome back! Sign in to explore articles on web development, DSA, and the journey of becoming a better developer.
          </p>
          <div className='flex gap-3 mt-2'>
            <span className='text-xs bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full'>#WebDev</span>
            <span className='text-xs bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 px-3 py-1 rounded-full'>#DSA</span>
            <span className='text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full'>#MERN</span>
          </div>
        </div>

        {/* Right */}
        <div className='flex-1 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700'>
          <h2 className='text-2xl font-bold mb-6 dark:text-white'>Sign In</h2>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Email' className='text-sm font-medium' />
              <TextInput
                type='email'
                placeholder='name@example.com'
                id='email'
                onChange={handleChange}
                className='mt-1'
              />
            </div>
            <div>
              <Label value='Password' className='text-sm font-medium' />
              <TextInput
                type='password'
                placeholder='••••••••••'
                id='password'
                onChange={handleChange}
                className='mt-1'
              />
            </div>
            <Button
              type='submit'
              disabled={loading}
              className='bg-gradient-to-r from-teal-400 to-cyan-500 border-0 mt-2'
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Signing in...</span>
                </>
              ) : 'Sign In'}
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5 text-gray-500'>
            <span>Don't have an account?</span>
            <Link to='/sign-up' className='text-teal-500 hover:underline font-medium'>
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className='mt-4' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}