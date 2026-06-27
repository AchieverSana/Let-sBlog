import {
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/comment/getcomments`,
          { credentials: 'include' }
        );
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchComments();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/comment/getcomments?startIndex=${comments.length}`,
        { credentials: 'include' }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/comment/deleteComment/${commentIdToDelete}`,
        { method: 'DELETE', credentials: 'include' }
      );
      const data = await res.json();
      if (res.ok)
        setComments((prev) => prev.filter((c) => c._id !== commentIdToDelete));
      else console.log(data.message);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {!currentUser.isAdmin && (
        <p className='mb-4 text-sm text-gray-500 dark:text-gray-400'>
          Showing comments you&apos;ve left on posts.
        </p>
      )}
      {comments.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <TableHead>
              <TableHeadCell>Date</TableHeadCell>
              <TableHeadCell>Comment</TableHeadCell>
              <TableHeadCell>Post</TableHeadCell>
              <TableHeadCell>Commenter</TableHeadCell>
              <TableHeadCell>Likes</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
            </TableHead>
            {comments.map((comment) => (
              <TableBody key={comment._id} className='divide-y'>
                <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <TableCell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{comment.content}</TableCell>
                  <TableCell>{comment.postTitle || 'Untitled'}</TableCell>
                  <TableCell>
                    {comment.author ? (
                      <span>
                        {comment.author.username}{' '}
                        {comment.author.isAdmin && (
                          <span className='ml-1 px-2 py-0.5 rounded-full bg-teal-500 text-white text-[10px] font-semibold'>
                            Admin
                          </span>
                        )}
                      </span>
                    ) : (
                      'Unknown user'
                    )}
                  </TableCell>
                  <TableCell>{comment.numberOfLikes}</TableCell>
                  <TableCell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>
          {currentUser.isAdmin
            ? 'You have no comments yet!'
            : "You haven't left any comments yet!"}
        </p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <ModalHeader />
        <ModalBody>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <button
                onClick={handleDeleteComment}
                className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600'
              >
                Yes, I&apos;m sure
              </button>
              <button
                onClick={() => setShowModal(false)}
                className='px-4 py-2 bg-gray-200 text-gray-800 rounded-lg dark:bg-gray-600 dark:text-white'
              >
                No, cancel
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
