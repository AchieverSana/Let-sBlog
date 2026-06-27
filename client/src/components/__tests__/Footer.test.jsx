import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FooterCom from '../Footer';

describe('FooterCom', () => {
  it('links to the correct GitHub profile (regression guard for the AchieverSana spelling)', () => {
    render(
      <MemoryRouter>
        <FooterCom />
      </MemoryRouter>
    );
    const githubLinks = screen.getAllByRole('link', { name: /github/i });
    githubLinks.forEach((link) => {
      expect(link.getAttribute('href')).toBe('https://github.com/AchieverSana');
    });
  });

  it('links to the About and Projects pages', () => {
    render(
      <MemoryRouter>
        <FooterCom />
      </MemoryRouter>
    );
    expect(screen.getByText('About Me').getAttribute('href')).toBe('/about');
    expect(screen.getByText('Projects').getAttribute('href')).toBe('/projects');
  });
});
