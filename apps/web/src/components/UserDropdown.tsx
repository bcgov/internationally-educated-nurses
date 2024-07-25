import { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import downArrowIcon from '@assets/img/down_arrow.svg';
import { useAuthContext } from './AuthContexts';
import { Button } from './Button';

const HIDE_MENU_DELAY = 200;

export const UserDropdown = () => {
  const { authUser } = useAuthContext();

  const { signoutRedirect, removeUser, clearStaleState } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const hideMenu = () => {
    setTimeout(() => setShowMenu(false), HIDE_MENU_DELAY);
  };

  if (!authUser) return null;

  const logout = () => {
    const redirectUri = window.location.origin;

    removeUser().then(() => {
      signoutRedirect({ id_token_hint: undefined, post_logout_redirect_uri: redirectUri });
      clearStaleState();
    });
  };

  return (
    <div className='relative'>
      <button className='flex' onClick={() => setShowMenu(!showMenu)} onBlur={hideMenu}>
        <div className='text-white'>{authUser?.name}</div>
        <img src={downArrowIcon.src} alt='down arrow' />
      </button>
      {showMenu && (
        <Button variant='outline' className='absolute right-0 z-50' onClick={logout}>
          Logout
        </Button>
      )}
    </div>
  );
};
