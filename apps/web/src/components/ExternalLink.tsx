import { PropsWithChildren } from 'react';

interface ExternalLinkProps extends PropsWithChildren {
  href: string;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({ href, children }) => {
  return (
    <a href={href} target='_blank' rel='noopener noreferrer' className='text-bcBlueLink underline'>
      {children}
    </a>
  );
};
