import { PropsWithChildren, ReactNode } from 'react';
import { Access, hasAccess } from '@ien/common';
import { useAuthContext } from '../AuthContexts';

type AclMaskProps = PropsWithChildren<ReactNode> & {
  acl: Access[];
  fallback?: ReactNode | (() => ReactNode);
};

export const AclMask = ({ acl, children }: AclMaskProps) => {
  const { authUser } = useAuthContext();
  return authUser && hasAccess(authUser.roles, acl) ? <>{children}</> : <></>;
};
