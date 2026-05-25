import {
  Footer,
  FooterTitle,
  FooterLinkGroup,
  FooterLink,
  FooterDivider,
  FooterCopyright,
  FooterIcon,
} from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsGithub, BsLinkedin } from 'react-icons/bs';
import { SiLeetcode } from 'react-icons/si';

export default function FooterCom() {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          <div className='mt-5'>
            <Link
              to='/'
              className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'
            >
              <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                Sana's
              </span>
              Blog
            </Link>
            <p className='mt-3 text-sm text-gray-500 dark:text-gray-400 max-w-xs'>
              Sharing knowledge on web development, DSA, and the developer journey — one post at a time.
            </p>
          </div>
          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
            <div>
              <FooterTitle title='About' />
              <FooterLinkGroup col>
                <FooterLink href='/about'>
                  About Me
                </FooterLink>
                <FooterLink href='/projects'>
                  Projects
                </FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title='Find Me' />
              <FooterLinkGroup col>
                <FooterLink
                  href='https://github.com/AcheiverSana'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  GitHub
                </FooterLink>
                <FooterLink
                  href='https://www.linkedin.com/in/sana-parveen-499316325/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  LinkedIn
                </FooterLink>
                <FooterLink
                  href='https://leetcode.com/u/Achieversana/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  LeetCode
                </FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title='Legal' />
              <FooterLinkGroup col>
                <FooterLink href='#'>Privacy Policy</FooterLink>
                <FooterLink href='#'>Terms &amp; Conditions</FooterLink>
              </FooterLinkGroup>
            </div>
          </div>
        </div>
        <FooterDivider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <FooterCopyright href='#' by="Sana's Blog" year={new Date().getFullYear()} />
          <div className='flex gap-6 sm:mt-0 mt-4 sm:justify-center'>
            <FooterIcon
              href='https://github.com/AcheiverSana'
              target='_blank'
              icon={BsGithub}
            />
            <FooterIcon
              href='https://www.linkedin.com/in/sana-parveen-499316325/'
              target='_blank'
              icon={BsLinkedin}
            />
            <FooterIcon
              href='https://leetcode.com/u/Achieversana/'
              target='_blank'
              icon={SiLeetcode}
            />
          </div>
        </div>
      </div>
    </Footer>
  );
}