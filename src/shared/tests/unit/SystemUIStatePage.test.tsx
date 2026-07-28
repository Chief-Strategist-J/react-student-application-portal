import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SystemUIStatePage } from '../../components/SystemUIStatePage';

describe('SystemUIStatePage Component Unit Tests', () => {
  it('renders LOADING state correctly', () => {
    render(<SystemUIStatePage state="LOADING" />);
    expect(screen.getByText('Loading Content')).toBeDefined();
  });

  it('renders OFFLINE state correctly', () => {
    render(<SystemUIStatePage state="OFFLINE" />);
    expect(screen.getByText('No Internet Connection')).toBeDefined();
  });

  it('renders TIMEOUT state correctly', () => {
    render(<SystemUIStatePage state="TIMEOUT" />);
    expect(screen.getByText('Request Timed Out')).toBeDefined();
  });

  it('renders FORBIDDEN_403 state correctly', () => {
    render(<SystemUIStatePage state="FORBIDDEN_403" />);
    expect(screen.getByText('Access Denied (403)')).toBeDefined();
  });

  it('renders RATE_LIMITED_429 state correctly', () => {
    render(<SystemUIStatePage state="RATE_LIMITED_429" />);
    expect(screen.getByText('Too Many Requests (429)')).toBeDefined();
  });
});
