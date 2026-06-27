import { Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, NavbarCollapse, NavbarToggle, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/signout`, {
        method: 'POST', credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) console.log(data.message);
      else dispatch(signoutSuccess());
    } catch (error) { console.log(error.message); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <Navbar className='border-b-2'>
      <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500 rounded-lg text-white'>Sana&apos;s</span>{' '}Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput type='text' placeholder='Search...' rightIcon={AiOutlineSearch} className='hidden lg:inline' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </form>
      <button className='w-12 h-10 lg:hidden flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600' onClick={() => navigate('/search')}>
        <AiOutlineSearch />
      </button>
      <div className='flex gap-2 md:order-2'>
        <button className='w-12 h-10 hidden sm:flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600' onClick={() => dispatch(toggleTheme())}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
        {currentUser ? (
          <Dropdown arrowIcon={false} inline label={<Avatar alt='user' img={currentUser.profilePicture} rounded />}>
            <DropdownHeader>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
            </DropdownHeader>
            <Link to='/dashboard?tab=profile'><DropdownItem>Profile</DropdownItem></Link>
            <DropdownDivider />
            <DropdownItem onClick={handleSignout}>Sign out</DropdownItem>
          </Dropdown>
        ) : (
          <Link to='/sign-in'>
            <button className='px-4 py-2 bg-gradient-to-r from-teal-400 to-cyan-500 text-white rounded-lg text-sm font-medium hover:opacity-90'>Sign In</button>
          </Link>
        )}
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <Link to='/' className={`px-3 py-2 rounded-md text-sm font-medium ${path === '/' ? 'text-cyan-500 font-semibold underline underline-offset-4' : 'text-gray-700 dark:text-gray-300 hover:text-cyan-500'}`}>Home</Link>
        <Link to='/about' className={`px-3 py-2 rounded-md text-sm font-medium ${path === '/about' ? 'text-cyan-500 font-semibold underline underline-offset-4' : 'text-gray-700 dark:text-gray-300 hover:text-cyan-500'}`}>About</Link>
        <Link to='/projects' className={`px-3 py-2 rounded-md text-sm font-medium ${path === '/projects' ? 'text-cyan-500 font-semibold underline underline-offset-4' : 'text-gray-700 dark:text-gray-300 hover:text-cyan-500'}`}>Projects</Link>
      </NavbarCollapse>
    </Navbar>
  );
}
