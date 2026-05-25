import { Button } from 'flowbite-react';

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row border border-teal-500 rounded-2xl overflow-hidden'>
      <div className='flex-1 justify-center flex flex-col gap-4 p-6'>
        <h2 className='text-2xl font-semibold dark:text-white'>
          Want to solve DSA problems together?
        </h2>
        <p className='text-gray-500 dark:text-gray-400'>
          Check out my LeetCode profile where I solve and explain coding problems regularly.
        </p>
        
          href='https://leetcode.com/u/Achieversana/'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Button className='bg-gradient-to-r from-teal-400 to-cyan-500 border-0 w-full'>
            View my LeetCode Profile
          </Button>
        </a>
      </div>
      <div className='flex-1 p-6 flex flex-col gap-4 justify-center'>
        <h2 className='text-2xl font-semibold dark:text-white'>
          Explore my projects on GitHub
        </h2>
        <p className='text-gray-500 dark:text-gray-400'>
          Browse through my repositories and see what I've been building.
        </p>
        
          href='https://github.com/AcheiverSana'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Button className='bg-gradient-to-r from-teal-400 to-cyan-500 border-0 w-full'>
            View my GitHub
          </Button>
        </a>
      </div>
    </div>
  );
}