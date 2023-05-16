import { useAuthContext } from './AuthContexts';
import downArrowIcon from '@assets/img/down_arrow.svg';
import { useState } from 'react';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { Button } from './Button';

const HIDE_MENU_DELAY = 200;

export const UserDropdown = () => {
  const { authUser } = useAuthContext();
  const { keycloak } = useKeycloak<KeycloakInstance>();

  const [showMenu, setShowMenu] = useState(false);

  const hideMenu = () => {
    setTimeout(() => setShowMenu(false), HIDE_MENU_DELAY);
  };

  if (!authUser) return null;

  const logout = () => {
    let redirectUri = window.location.origin;
    if (keycloak?.authServerUrl?.includes('common-logon-test')) {
      redirectUri = `https://logontest7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl=${redirectUri}`;
    } else if (keycloak?.authServerUrl?.includes('common-logon')) {
      redirectUri = `https://logon7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl=${redirectUri}`;
    }

    keycloak?.logout({ redirectUri });
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
