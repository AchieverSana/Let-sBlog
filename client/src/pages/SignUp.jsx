import { Alert, Label, Spinner } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

const inputStyle = {
  width: '100%',
  marginTop: '4px',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid #4b5563',
  backgroundColor: '#374151',
  color: '#f9fafb',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
};

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) navigate('/sign-in');
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen mt-20 dark:bg-[rgb(16,23,42)]'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        <div className='flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
              Sana's
            </span>{' '}
            Blog
          </Link>
          <p className='text-sm mt-5 dark:text-gray-300'>
            This is a demo project. You can sign up with your email and password
            or with Google.
          </p>
        </div>
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your username' className='dark:text-gray-200' />
              <input type='text' placeholder='Username' id='username' onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <Label value='Your email' className='dark:text-gray-200' />
              <input type='email' placeholder='name@company.com' id='email' onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <Label value='Your password' className='dark:text-gray-200' />
              <input type='password' placeholder='••••••••••' id='password' onChange={handleChange} style={inputStyle} />
            </div>
            <button
              type='submit'
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(to right, #a855f7, #ec4899)',
                color: 'white',
                fontWeight: '600',
                fontSize: '15px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span>Loading...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5 dark:text-gray-300'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
          </div>
          {errorMessage && (
            <Alert className='mt-5' color='failure'>{errorMessage}</Alert>
          )}
        </div>
      </div>
    </div>
  );
}
