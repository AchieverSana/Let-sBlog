import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../src/utils/verifyUser.js';

describe('verifyToken middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { cookies: {} };
    res = {};
    next = vi.fn();
    process.env.JWT_SECRET = 'test_secret';
  });

  it('calls next with a 401 error when no token cookie is present', () => {
    verifyToken(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    const errArg = next.mock.calls[0][0];
    expect(errArg.statusCode).toBe(401);
  });

  it('calls next with a 401 error when the token is invalid', () => {
    req.cookies.access_token = 'not-a-real-token';
    verifyToken(req, res, next);
    const errArg = next.mock.calls[0][0];
    expect(errArg.statusCode).toBe(401);
  });

  it('attaches the decoded user and calls next() with no error for a valid token', () => {
    const token = jwt.sign({ id: 'user123', isAdmin: false }, process.env.JWT_SECRET);
    req.cookies.access_token = token;
    verifyToken(req, res, next);
    expect(req.user.id).toBe('user123');
    expect(next).toHaveBeenCalledWith();
  });
});
