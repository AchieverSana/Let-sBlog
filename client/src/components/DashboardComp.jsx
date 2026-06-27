import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/getusers?limit=5`, { credentials: 'include' });
        const data = await res.json();
        if (res.ok) { setUsers(data.users); setTotalUsers(data.totalUsers); setLastMonthUsers(data.lastMonthUsers); }
      } catch (error) { console.log(error.message); }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/getposts?limit=5`, { credentials: 'include' });
        const data = await res.json();
        if (res.ok) { setPosts(data.posts); setTotalPosts(data.totalPosts); setLastMonthPosts(data.lastMonthPosts); }
      } catch (error) { console.log(error.message); }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/comment/getcomments?limit=5`, { credentials: 'include' });
        const data = await res.json();
        if (res.ok) { setComments(data.comments); setTotalComments(data.totalComments); setLastMonthComments(data.lastMonthComments); }
      } catch (error) { console.log(error.message); }
    };
    if (currentUser.isAdmin) { fetchUsers(); fetchPosts(); fetchComments(); }
  }, [currentUser]);

  return (
    <div className='p-3 md:mx-auto'>
      <div className='flex-wrap flex gap-4 justify-center'>
        {[{ label: 'Total Users', value: totalUsers, last: lastMonthUsers, Icon: HiOutlineUserGroup, color: 'bg-teal-600' },
          { label: 'Total Comments', value: totalComments, last: lastMonthComments, Icon: HiAnnotation, color: 'bg-indigo-600' },
          { label: 'Total Posts', value: totalPosts, last: lastMonthPosts, Icon: HiDocumentText, color: 'bg-lime-600' }]
          .map(({ label, value, last, Icon, color }) => (
          <div key={label} className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
            <div className='flex justify-between'>
              <div><h3 className='text-gray-500 text-md uppercase'>{label}</h3><p className='text-2xl'>{value}</p></div>
              <Icon className={`${color} text-white rounded-full text-5xl p-3 shadow-lg`} />
            </div>
            <div className='flex gap-2 text-sm'>
              <span className='text-green-500 flex items-center'><HiArrowNarrowUp />{last}</span>
              <div className='text-gray-500'>Last month</div>
            </div>
          </div>
        ))}
      </div>
      <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
        {[
          { title: 'Recent users', link: '/dashboard?tab=users', headers: ['User image', 'Username'], data: users, row: (u) => (<><TableCell><img src={u.profilePicture} alt='user' className='w-10 h-10 rounded-full bg-gray-500' /></TableCell><TableCell>{u.username}</TableCell></>) },
          { title: 'Recent comments', link: '/dashboard?tab=comments', headers: ['Comment content', 'Likes'], data: comments, row: (c) => (<><TableCell className='w-96'><p className='line-clamp-2'>{c.content}</p></TableCell><TableCell>{c.numberOfLikes}</TableCell></>) },
          { title: 'Recent posts', link: '/dashboard?tab=posts', headers: ['Post image', 'Post Title', 'Category'], data: posts, row: (p) => (<><TableCell><img src={p.image} alt='post' className='w-14 h-10 rounded-md bg-gray-500' /></TableCell><TableCell className='w-96'>{p.title}</TableCell><TableCell>{p.category}</TableCell></>) },
        ].map(({ title, link, headers, data, row }) => (
          <div key={title} className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
            <div className='flex justify-between p-3 text-sm font-semibold'>
              <h1 className='text-center p-2'>{title}</h1>
              <Link to={link} className='px-3 py-1 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-700 text-sm'>See all</Link>
            </div>
            <Table hoverable>
              <TableHead>{headers.map((h) => <TableHeadCell key={h}>{h}</TableHeadCell>)}</TableHead>
              {data && data.map((item) => (
                <TableBody key={item._id} className='divide-y'>
                  <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>{row(item)}</TableRow>
                </TableBody>
              ))}
            </Table>
          </div>
        ))}
      </div>
    </div>
  );
}
