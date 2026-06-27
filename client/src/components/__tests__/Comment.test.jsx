import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Comment from '../Comment';

const baseComment = {
  _id: 'comment1',
  userId: 'author1',
  content: 'A test comment',
  likes: [],
  numberOfLikes: 0,
  createdAt: new Date().toISOString(),
};

function renderWithUser(currentUser) {
  const store = configureStore({
    reducer: { user: () => ({ currentUser }) },
  });
  return render(
    <Provider store={store}>
      <Comment comment={baseComment} onLike={() => {}} onEdit={() => {}} onDelete={() => {}} />
    </Provider>
  );
}

beforeEach(() => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ username: 'author1', profilePicture: '' }),
  });
});

describe('Comment edit/delete permissions', () => {
  it('shows both Edit and Delete to the comment author', async () => {
    renderWithUser({ _id: 'author1', isAdmin: false });
    expect(await screen.findByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('hides both Edit and Delete from an unrelated regular user', async () => {
    renderWithUser({ _id: 'someoneElse', isAdmin: false });
    // wait for the async user fetch to resolve before asserting absence
    await screen.findByText('A test comment');
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('lets an admin Delete but NOT Edit someone else\'s comment', async () => {
    renderWithUser({ _id: 'admin1', isAdmin: true });
    expect(await screen.findByText('Delete')).toBeInTheDocument();
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });
});
