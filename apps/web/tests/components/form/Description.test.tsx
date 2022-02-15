import React from 'react';
import { render, screen } from '@testing-library/react';
import { Description } from '../../../src/components/form/Description';

describe('FormLabelDescription', () => {
  it('renders an element with the correct text', () => {
    const testDescriptionId = 'input-id';
    const testDescriptionText = 'description text';

    render(<Description id={testDescriptionId}>{testDescriptionText}</Description>);

    const description = screen.getByText(testDescriptionText);

    expect(description).toBeInTheDocument();
  });

  it('passes the id prop properly', () => {
    const testDescriptionId = 'input-id';
    const testDescriptionText = 'description text';

    render(<Description id={testDescriptionId}>{testDescriptionText}</Description>);

    const description = screen.getByText(testDescriptionText);

    expect(description).toHaveAttribute('id', testDescriptionId);
  });

  it('renders children properly', () => {
    const testDescriptionId = 'input-id';
    const testDescriptionText = 'description text';

    render(<Description id={testDescriptionId}>{testDescriptionText}</Description>);

    const description = screen.getByText(testDescriptionText);

    expect(description).toHaveTextContent(testDescriptionText);
  });
});
