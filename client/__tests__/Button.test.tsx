import React from 'react';
import { render, screen } from '@testing-library/react';

function Button() {
  return <button>Click me</button>;
}

test('renders button with text', () => {
  render(<Button />);
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
});
