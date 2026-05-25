import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsGithub, BsLinkedin } from 'react-icons/bs';
import { SiLeetcode } from 'react-icons/si';

export default function FooterCom() {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          <div className='mt-5'>
            <Link to='/' className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
              <span className='px-2 py-1 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500 rounded-lg text-white'>
                Sana's
              </span>
              {' '}Blog
            </Link>
            <p className='mt-3 text-sm text-gray-500 dark:text-gray-400 max-w-xs'>
              Sharing knowledge on web development, DSA, and the developer journey — one post at a time.
            </p>
          </div>
          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
            <div>
              <Footer.Title title='About' />
              <Footer.LinkGroup col>
                <Footer.Link href='/about'>About Me</Footer.Link>
                <Footer.Link href='/projects'>Projects</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Find Me' />
              <Footer.LinkGroup col>
                <Footer.Link href='https://github.com/AcheiverSana' target='_blank'>GitHub</Footer.Link>
                <Footer.Link href='https://www.linkedin.com/in/sana-parveen-499316325/' target='_blank'>LinkedIn</Footer.Link>
                <Footer.Link href='https://leetcode.com/u/Achieversana/' target='_blank'>LeetCode</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Legal' />
              <Footer.LinkGroup col>
                <Footer.Link href='#'>Privacy Policy</Footer.Link>
                <Footer.Link href='#'>Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <Footer.Copyright href='#' by="Sana's Blog" year={new Date().getFullYear()} />
          <div className='flex gap-6 sm:mt-0 mt-4 sm:justify-center'>
            <Footer.Icon href='https://github.com/AcheiverSana' icon={BsGithub} />
            <Footer.Icon href='https://www.linkedin.com/in/sana-parveen-499316325/' icon={BsLinkedin} />
            <Footer.Icon href='https://leetcode.com/u/Achieversana/' icon={SiLeetcode} />
          </div>
        </div>
      </div>
    </Footer>
  );
}
