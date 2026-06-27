import { Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DOMPurify from 'dompurify';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

export default function PostPage() {
  const { postSlug } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/post/getposts?slug=${postSlug}`
        );
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        setPost(data.posts[0]);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/post/getposts?limit=4`
        );
        const data = await res.json();
        if (res.ok) {
          // Exclude the current post from recent articles
          setRecentPosts(data.posts.filter((p) => p.slug !== postSlug));
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchRecentPosts();
  }, [postSlug]);

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );

  if (error || !post)
    return (
      <div className='flex flex-col gap-4 justify-center items-center min-h-screen text-center p-3'>
        <h1 className='text-2xl font-semibold'>Post not found</h1>
        <p className='text-gray-500 dark:text-gray-400'>
          This post may have been removed, or the link is incorrect.
        </p>
        <Link to='/search' className='text-teal-500 hover:underline'>
          Browse all posts
        </Link>
      </div>
    );

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post && post.title}
      </h1>
      <div className='flex items-center justify-center gap-3 mt-5'>
        <Link to={`/search?category=${post && post.category}`}>
          <button className='px-3 py-1 border border-gray-400 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'>
            {post && post.category}
          </button>
        </Link>
        {currentUser && currentUser.isAdmin && post && (
          <Link to={`/update-post/${post._id}`}>
            <button className='px-3 py-1 bg-teal-500 text-white rounded-full text-sm hover:bg-teal-600'>
              Edit Post
            </button>
          </Link>
        )}
      </div>
      <img
        src={post && post.image}
        alt={post && post.title}
        className='mt-10 p-3 max-h-[600px] w-full object-cover'
      />
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        {post && post.author && (
          <span className='font-semibold'>By {post.author.username}</span>
        )}
        <span className='italic'>
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{
          __html: post ? DOMPurify.sanitize(post.content) : '',
        }}
      ></div>
      <CommentSection postId={post._id} />
      {recentPosts && recentPosts.length > 0 && (
        <div className='flex flex-col justify-center items-center mb-5'>
          <h1 className='text-xl mt-5'>Recent articles</h1>
          <div className='flex flex-wrap gap-5 mt-5 justify-center'>
            {recentPosts.map((p) => (
              <PostCard key={p._id} post={p} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
