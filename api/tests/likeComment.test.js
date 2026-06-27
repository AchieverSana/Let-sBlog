import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Comment model before importing the controller that uses it
vi.mock('../src/models/comment.model.js', () => ({
  default: {
    findById: vi.fn(),
  },
}));

const Comment = (await import('../src/models/comment.model.js')).default;
const { likeComment } = await import('../src/controllers/comment.controller.js');

function buildFakeComment(initialLikes = []) {
  return {
    likes: [...initialLikes],
    numberOfLikes: initialLikes.length,
    save: vi.fn().mockResolvedValue(true),
  };
}

describe('likeComment controller', () => {
  let req, res, next;

  beforeEach(() => {
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    next = vi.fn();
    req = { params: { commentId: 'c1' }, user: { id: 'user1' } };
  });

  it('adds a like when the user has not liked it yet', async () => {
    const fakeComment = buildFakeComment([]);
    Comment.findById.mockResolvedValue(fakeComment);

    await likeComment(req, res, next);

    expect(fakeComment.numberOfLikes).toBe(1);
    expect(fakeComment.likes).toContain('user1');
    expect(fakeComment.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('removes the like (toggles off) when the user already liked it', async () => {
    const fakeComment = buildFakeComment(['user1']);
    Comment.findById.mockResolvedValue(fakeComment);

    await likeComment(req, res, next);

    expect(fakeComment.numberOfLikes).toBe(0);
    expect(fakeComment.likes).not.toContain('user1');
  });

  it('calls next with a 404 error when the comment does not exist', async () => {
    Comment.findById.mockResolvedValue(null);

    await likeComment(req, res, next);

    expect(next).toHaveBeenCalled();
    const errArg = next.mock.calls[0][0];
    expect(errArg.statusCode).toBe(404);
  });
});
