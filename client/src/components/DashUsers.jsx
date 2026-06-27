import { Modal, ModalBody, ModalHeader, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/getusers`, { credentials: 'include' });
        const data = await res.json();
        if (res.ok) { setUsers(data.users); if (data.users.length < 9) setShowMore(false); }
      } catch (error) { console.log(error.message); }
    };
    if (currentUser.isAdmin) fetchUsers();
  }, [currentUser._id, currentUser.isAdmin]);

  const handleShowMore = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/getusers?startIndex=${users.length}`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) { setUsers((prev) => [...prev, ...data.users]); if (data.users.length < 9) setShowMore(false); }
    } catch (error) { console.log(error.message); }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/delete/${userIdToDelete}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (res.ok) { setUsers((prev) => prev.filter((u) => u._id !== userIdToDelete)); setShowModal(false); }
      else console.log(data.message);
    } catch (error) { console.log(error.message); }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <TableHead>
              <TableHeadCell>Date created</TableHeadCell>
              <TableHeadCell>User image</TableHeadCell>
              <TableHeadCell>Username</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Admin</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
            </TableHead>
            {users.map((user) => (
              <TableBody key={user._id} className='divide-y'>
                <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell><img src={user.profilePicture} alt={user.username} className='w-10 h-10 object-cover bg-gray-500 rounded-full' /></TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.isAdmin ? <FaCheck className='text-green-500' /> : <FaTimes className='text-red-500' />}</TableCell>
                  <TableCell><span onClick={() => { setShowModal(true); setUserIdToDelete(user._id); }} className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span></TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
          {showMore && <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>Show more</button>}
        </>
      ) : (<p>You have no users yet!</p>)}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <ModalHeader />
        <ModalBody>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this user?</h3>
            <div className='flex justify-center gap-4'>
              <button onClick={handleDeleteUser} className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600'>Yes, I&apos;m sure</button>
              <button onClick={() => setShowModal(false)} className='px-4 py-2 bg-gray-200 text-gray-800 rounded-lg dark:bg-gray-600 dark:text-white'>No, cancel</button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
