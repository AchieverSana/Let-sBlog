import { describe, it, expect } from 'vitest';
import { errorHandler } from '../src/utils/error.js';

describe('errorHandler', () => {
  it('returns an Error instance', () => {
    const err = errorHandler(404, 'Not found');
    expect(err).toBeInstanceOf(Error);
  });

  it('attaches the given statusCode', () => {
    const err = errorHandler(403, 'Forbidden');
    expect(err.statusCode).toBe(403);
  });

  it('attaches the given message', () => {
    const err = errorHandler(400, 'Bad request');
    expect(err.message).toBe('Bad request');
  });
});
