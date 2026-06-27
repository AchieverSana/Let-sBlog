export default function CallToAction() {
  return (
    <div className='flex border border-teal-500 p-3 justify-center items-center rounded-tl-3xl rounded-br-3xl flex-col sm:flex-row text-center'>
      <div className='flex-1 justify-center flex flex-col'>
        <h2 className='text-2xl'>Want to learn HTML, CSS and JavaScript by building fun and engaging projects?</h2>
        <p className='text-gray-500 my-2'>Check our 100 js projects website and start building your own projects</p>
        <a href='https://www.100jsprojects.com/' target='_blank' rel='noopener noreferrer'>
          <button className='w-full rounded-tl-xl rounded-br-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 hover:opacity-90'>
            100 JS Projects Website
          </button>
        </a>
      </div>
      <div className='flex-1 p-7'>
        <img src='https://media.geeksforgeeks.org/wp-content/cdn-uploads/20221114110410/Top-10-JavaScript-Project-Ideas-For-Beginners-2023.png' />
      </div>
    </div>
  );
}
