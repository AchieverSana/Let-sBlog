import { Alert, Modal, ModalBody, ModalHeader, Textarea } from 'flowbite-react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/comment/create`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: comment, postId, userId: currentUser._id }),
      });
      const data = await res.json();
      if (res.ok) { setComment(''); setCommentError(null); setComments([data, ...comments]); }
    } catch (error) { setCommentError(error.message); }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/comment/getPostComments/${postId}`);
        if (res.ok) { const data = await res.json(); setComments(data); }
      } catch (error) { console.log(error.message); }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) { navigate('/sign-in'); return; }
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/comment/likeComment/${commentId}`, { method: 'PUT', credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setComments(comments.map((c) => c._id === commentId ? { ...c, likes: data.likes, numberOfLikes: data.likes.length } : c));
      }
    } catch (error) { console.log(error.message); }
  };

  const handleEdit = (comment, editedContent) => {
    setComments(comments.map((c) => c._id === comment._id ? { ...c, content: editedContent } : c));
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) { navigate('/sign-in'); return; }
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/comment/deleteComment/${commentId}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) setComments(comments.filter((c) => c._id !== commentId));
    } catch (error) { console.log(error.message); }
  };

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ? (
        <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
          <p>Signed in as:</p>
          <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt='' />
          <Link to='/dashboard?tab=profile' className='text-xs text-cyan-600 hover:underline'>@{currentUser.username}</Link>
        </div>
      ) : (
        <div className='text-sm text-teal-500 my-5 flex gap-1'>
          You must be signed in to comment. <Link className='text-blue-500 hover:underline' to='/sign-in'>Sign In</Link>
        </div>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
          <Textarea placeholder='Add a comment...' rows='3' maxLength='200' onChange={(e) => setComment(e.target.value)} value={comment} />
          <div className='flex justify-between items-center mt-5'>
            <p className='text-gray-500 text-xs'>{200 - comment.length} characters remaining</p>
            <button type='submit' className='px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg text-sm hover:opacity-90'>Submit</button>
          </div>
          {commentError && <Alert color='failure' className='mt-5'>{commentError}</Alert>}
        </form>
      )}
      {comments.length === 0 ? (
        <p className='text-sm my-5'>No comments yet!</p>
      ) : (
        <>
          <div className='text-sm my-5 flex items-center gap-1'>
            <p>Comments</p>
            <div className='border border-gray-400 py-1 px-2 rounded-sm'><p>{comments.length}</p></div>
          </div>
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit}
              onDelete={(commentId) => { setShowModal(true); setCommentToDelete(commentId); }} />
          ))}
        </>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <ModalHeader />
        <ModalBody>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this comment?</h3>
            <div className='flex justify-center gap-4'>
              <button onClick={() => handleDelete(commentToDelete)} className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600'>Yes, I&apos;m sure</button>
              <button onClick={() => setShowModal(false)} className='px-4 py-2 bg-gray-200 text-gray-800 rounded-lg dark:bg-gray-600 dark:text-white'>No, cancel</button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

CommentSection.propTypes = {
  postId: PropTypes.string.isRequired,
};
