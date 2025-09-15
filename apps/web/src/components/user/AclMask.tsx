import { PropsWithChildren, ReactNode } from 'react';
import { Access, Authority, hasAccess } from '@ien/common';
import { useAuthContext } from '../AuthContexts';

type AclMaskProps = PropsWithChildren & {
  acl?: Access[];
  authorities?: Authority[];
  fallback?: ReactNode | (() => ReactNode);
};

export const AclMask = ({ acl, children, fallback, authorities }: AclMaskProps) => {
  const { authUser } = useAuthContext();
  if (
    authUser &&
    (!acl || hasAccess(authUser.roles, acl)) &&
    (!authorities || authorities.some(a => authUser.organization === a.name))
  ) {
    return <>{children}</>;
  }
  return <>{fallback}</>;
};
