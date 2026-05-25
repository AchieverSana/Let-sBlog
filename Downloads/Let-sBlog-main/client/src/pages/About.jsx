export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <h1 className='text-3xl font-semibold text-center my-7'>
          About{' '}
          <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
            Sana's
          </span>
          {' '}Blog
        </h1>
        <div className='text-md text-gray-500 flex flex-col gap-6'>
          <p>
            Hi, I'm <strong>Sana</strong> — a passionate developer on a mission to grow, build, and share. This blog is my personal space where I document everything I learn along the way, from cracking DSA problems to building full-stack web applications.
          </p>
          <p>
            Whether you're just starting your coding journey or leveling up your skills, you'll find articles here on <strong>web development</strong>, <strong>Data Structures and Algorithms</strong>, <strong>MERN stack</strong>, and practical tips from real project experience.
          </p>
          <p>
            I believe in learning in public — sharing not just the wins, but also the struggles and lessons. If even one post helps someone get unstuck or feel less alone in their journey, this blog has done its job.
          </p>
          <p>
            Feel free to explore, leave comments, and connect with me on
            {' '}<a href='https://github.com/AcheiverSana' target='_blank' rel='noopener noreferrer' className='text-purple-500 hover:underline'>GitHub</a>{' '}
            or
            {' '}<a href='https://www.linkedin.com/in/sana-parveen-499316325/' target='_blank' rel='noopener noreferrer' className='text-purple-500 hover:underline'>LinkedIn</a>.
            Let's grow together!
          </p>
        </div>
      </div>
    </div>
  );
}