import React from 'react';
import { render, screen } from '@testing-library/react';
import { Notice } from '@components';

describe('Notice', () => {
  it('renders children properly', () => {
    const testChildText = 'child text';

    render(<Notice>{testChildText}</Notice>);

    const notice = screen.getByText(testChildText);

    expect(notice).toBeInTheDocument();
  });
});
