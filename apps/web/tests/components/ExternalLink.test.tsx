import React from 'react';
import { render, screen } from '@testing-library/react';
import { ExternalLink } from '@components';

describe('ExternalLink', () => {
  it('contains the correct attributes for an external link', () => {
    render(<ExternalLink href='www.testdomain.tld'>test domain</ExternalLink>);

    const externalLink = screen.getByRole('link');

    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('properly passes the href prop', () => {
    render(<ExternalLink href='www.testdomain.tld'>test domain</ExternalLink>);

    const externalLink = screen.getByRole('link');

    expect(externalLink).toHaveAttribute('href', 'www.testdomain.tld');
  });

  it('renders children properly', () => {
    render(<ExternalLink href='www.testdomain.tld'>test domain</ExternalLink>);

    const externalLink = screen.getByRole('link');

    expect(externalLink.firstChild).toHaveTextContent('test domain');
  });

  it('contains the correct styling', () => {
    render(<ExternalLink href='www.testdomain.tld'>test domain</ExternalLink>);

    const externalLink = screen.getByRole('link');

    expect(externalLink).toHaveAttribute('class', 'text-bcBlueLink underline');
  });
});
