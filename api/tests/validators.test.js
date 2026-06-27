import { describe, it, expect } from 'vitest';
import { validationResult } from 'express-validator';
import {
  signupValidation,
  signinValidation,
  createPostValidation,
  createCommentValidation,
} from '../src/middleware/validators.js';

// Runs every check in a validation chain array against a fake request object,
// the same way express would before validationResult() is read.
async function runValidation(chain, body) {
  const req = { body };
  for (const check of chain) {
    await check.run(req);
  }
  return validationResult(req);
}

describe('signupValidation', () => {
  it('rejects a too-short username', async () => {
    const result = await runValidation(signupValidation, {
      username: 'ab',
      email: 'a@b.com',
      password: 'password123',
    });
    expect(result.isEmpty()).toBe(false);
  });

  it('rejects an invalid email', async () => {
    const result = await runValidation(signupValidation, {
      username: 'validuser',
      email: 'not-an-email',
      password: 'password123',
    });
    expect(result.isEmpty()).toBe(false);
  });

  it('rejects a short password', async () => {
    const result = await runValidation(signupValidation, {
      username: 'validuser',
      email: 'a@b.com',
      password: '123',
    });
    expect(result.isEmpty()).toBe(false);
  });

  it('passes for valid signup data', async () => {
    const result = await runValidation(signupValidation, {
      username: 'validuser',
      email: 'a@b.com',
      password: 'password123',
    });
    expect(result.isEmpty()).toBe(true);
  });
});

describe('signinValidation', () => {
  it('rejects a missing password', async () => {
    const result = await runValidation(signinValidation, { email: 'a@b.com', password: '' });
    expect(result.isEmpty()).toBe(false);
  });

  it('passes for valid signin data', async () => {
    const result = await runValidation(signinValidation, {
      email: 'a@b.com',
      password: 'anything',
    });
    expect(result.isEmpty()).toBe(true);
  });
});

describe('createPostValidation', () => {
  it('rejects a too-short title', async () => {
    const result = await runValidation(createPostValidation, {
      title: 'Hi',
      content: 'This is some valid post content.',
    });
    expect(result.isEmpty()).toBe(false);
  });

  it('passes for a valid post', async () => {
    const result = await runValidation(createPostValidation, {
      title: 'A Valid Post Title',
      content: 'This is some valid post content.',
    });
    expect(result.isEmpty()).toBe(true);
  });
});

describe('createCommentValidation', () => {
  it('rejects an empty comment', async () => {
    const result = await runValidation(createCommentValidation, {
      content: '',
      postId: 'p1',
      userId: 'u1',
    });
    expect(result.isEmpty()).toBe(false);
  });

  it('passes for a valid comment', async () => {
    const result = await runValidation(createCommentValidation, {
      content: 'Nice post!',
      postId: 'p1',
      userId: 'u1',
    });
    expect(result.isEmpty()).toBe(true);
  });
});
