import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PostCard from '../PostCard';

const basePost = {
  _id: '1',
  slug: 'my-test-post',
  title: 'My Test Post',
  category: 'javascript',
  image: 'https://example.com/image.png',
};

function renderWithRouter(post) {
  return render(
    <MemoryRouter>
      <PostCard post={post} />
    </MemoryRouter>
  );
}

describe('PostCard', () => {
  it('renders the post title and category', () => {
    renderWithRouter(basePost);
    expect(screen.getByText('My Test Post')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
  });

  it('shows the author when author info is present', () => {
    renderWithRouter({ ...basePost, author: { username: 'sana' } });
    expect(screen.getByText('By sana')).toBeInTheDocument();
  });

  it('does not crash or show "By" when author info is missing', () => {
    renderWithRouter(basePost);
    expect(screen.queryByText(/^By /)).not.toBeInTheDocument();
  });

  it('links to the correct post slug', () => {
    renderWithRouter(basePost);
    const link = screen.getByText('Read article');
    expect(link.getAttribute('href')).toBe('/post/my-test-post');
  });
});
