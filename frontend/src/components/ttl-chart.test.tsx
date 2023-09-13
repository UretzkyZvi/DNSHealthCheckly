import React from 'react';
import { render, screen } from '@testing-library/react';
import TTLChart, { TTLValue } from './ttl-chart';
 

describe('TTLChart', () => {
  const sampleData: TTLValue[] = [
    { name: 'google.com', 'TTL Value': 300 },
    { name: 'yahoo.com', 'TTL Value': 400 },
  ];

  test('renders without crashing', () => {
    render(<TTLChart data={sampleData} />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  test('applies classes and styles', () => {
    render(<TTLChart data={sampleData} />);
    // Check for the applied classes
    expect(screen.getByTestId('bar-chart')).toHaveClass('mt-6');
    expect(screen.getByTestId('bar-chart')).toHaveClass('w-full');
  });
});
