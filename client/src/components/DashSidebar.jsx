import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const handleSignout = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/signout`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!currentUser) return null;

  return (
    <Sidebar className='w-full md:w-56'>
      <SidebarItems>
        <SidebarItemGroup className='flex flex-col gap-1'>
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=dash'>
              <SidebarItem
                active={tab === 'dash' || !tab}
                icon={HiChartPie}
                as='div'
              >
                Dashboard
              </SidebarItem>
            </Link>
          )}
          <Link to='/dashboard?tab=profile'>
            <SidebarItem
              active={tab === 'profile'}
              icon={HiUser}
              label={currentUser.isAdmin ? 'Admin' : 'User'}
              labelColor='dark'
              as='div'
            >
              Profile
            </SidebarItem>
          </Link>
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=posts'>
              <SidebarItem
                active={tab === 'posts'}
                icon={HiDocumentText}
                as='div'
              >
                Posts
              </SidebarItem>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=users'>
              <SidebarItem
                active={tab === 'users'}
                icon={HiOutlineUserGroup}
                as='div'
              >
                Users
              </SidebarItem>
            </Link>
          )}
          <Link to='/dashboard?tab=comments'>
            <SidebarItem
              active={tab === 'comments'}
              icon={HiAnnotation}
              as='div'
            >
              Comments
            </SidebarItem>
          </Link>
          <SidebarItem
            icon={HiArrowSmRight}
            className='cursor-pointer'
            onClick={handleSignout}
          >
            Sign Out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
