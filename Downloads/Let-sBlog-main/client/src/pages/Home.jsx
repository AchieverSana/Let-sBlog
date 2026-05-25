import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/getPosts`);
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className='flex flex-col gap-6 px-6 py-20 max-w-5xl mx-auto'>
        <div className='flex items-center gap-2'>
          <span className='w-8 h-1 bg-teal-500 rounded-full inline-block'></span>
          <span className='text-teal-500 text-sm font-semibold tracking-widest uppercase'>Developer Blog</span>
        </div>
        <h1 className='text-4xl font-extrabold lg:text-6xl dark:text-white leading-tight'>
          Learn. Build.{' '}
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500'>
            Grow.
          </span>
        </h1>
        <p className='text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-xl leading-relaxed'>
          Hi, I'm Sana — a developer sharing my journey through web development, DSA, and the MERN stack. Whether you're a beginner or leveling up, there's something here for you.
        </p>
        <div className='flex gap-4 flex-wrap'>
          <Link
            to='/search'
            className='px-6 py-2.5 bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-semibold rounded-lg hover:opacity-90 transition text-sm'
          >
            View all posts →
          </Link>
          <Link
            to='/about'
            className='px-6 py-2.5 border border-teal-500 text-teal-500 font-semibold rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900 transition text-sm'
          >
            About me
          </Link>
        </div>
        <div className='flex gap-3 flex-wrap mt-2'>
          <span className='text-xs bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full'>#WebDev</span>
          <span className='text-xs bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 px-3 py-1 rounded-full'>#DSA</span>
          <span className='text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full'>#MERN</span>
          <span className='text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full'>#OpenSource</span>
        </div>
      </div>

      {/* Call to Action */}
      <div className='max-w-5xl mx-auto px-6 pb-10'>
        <div className='p-6 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl border border-teal-100 dark:border-slate-600'>
          <CallToAction />
        </div>
      </div>

      {/* Recent Posts */}
      <div className='max-w-5xl mx-auto px-6 pb-20 flex flex-col gap-8'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-2xl font-bold dark:text-white'>Recent Posts</h2>
              <Link to='/search' className='text-sm text-teal-500 hover:underline font-medium'>
                View all →
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}