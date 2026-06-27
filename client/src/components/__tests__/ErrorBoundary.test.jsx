import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

function ThrowingComponent() {
  throw new Error('Simulated render crash');
}

describe('ErrorBoundary', () => {
  it('renders children normally when there is no error', () => {
    render(
      <ErrorBoundary>
        <p>Everything is fine</p>
      </ErrorBoundary>
    );
    expect(screen.getByText('Everything is fine')).toBeInTheDocument();
  });

  it('renders the fallback UI instead of crashing the whole page when a child throws', () => {
    // The component intentionally throws — silence the expected console.error noise
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.queryByText('Everything is fine')).not.toBeInTheDocument();

    spy.mockRestore();
  });
});
