import React from 'react';
import { render, screen } from '@testing-library/react';
import { Label } from '../../../src/components/form/Label';

describe('FormLabel', () => {
  it('renders an element with the correct text', () => {
    const testId = 'input-id';
    const testLabel = 'label text';

    render(<Label htmlFor={testId}>{testLabel}</Label>);

    const label = screen.getByText(testLabel);

    expect(label).toBeInTheDocument();
  });

  it('passes the htmlFor prop properly', () => {
    const testHtmlFor = 'input-id';
    const testLabel = 'label text';

    render(<Label htmlFor={testHtmlFor}>{testLabel}</Label>);

    const label = screen.getByText(testLabel);

    expect(label).toHaveAttribute('for', testHtmlFor);
  });

  it('renders children properly', () => {
    const testHtmlFor = 'input-id';
    const testLabel = 'label text';

    render(<Label htmlFor={testHtmlFor}>{testLabel}</Label>);

    const label = screen.getByText(testLabel);

    expect(label).toHaveTextContent(testLabel);
  });
});
