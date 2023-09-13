import React from 'react';
import { render, screen } from '@testing-library/react';
import ResponseTimeChart, { ResponseTimeValue } from './response-time-chart';
 

// Mock data for testing
const sampleData: ResponseTimeValue[] = [
  { name: 'Test1', 'Response Time': 100 },
  { name: 'Test2', 'Response Time': 200 },
];

describe('ResponseTimeChart', () => {

  test('renders without crashing', () => {
    render(<ResponseTimeChart data={sampleData} />);
    const chartElement = screen.getByTestId('bar-chart');  
    expect(chartElement).toBeInTheDocument();
  });

  test('applies classes and styles', () => {
    render(<ResponseTimeChart data={sampleData} />);
    // Check for the applied classes
    expect(screen.getByTestId('bar-chart')).toHaveClass('mt-6');
    expect(screen.getByTestId('bar-chart')).toHaveClass('w-full');
  });
 
});
