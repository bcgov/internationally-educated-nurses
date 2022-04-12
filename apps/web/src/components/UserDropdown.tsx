import { useAuthContext } from './AuthContexts';
import downArrowIcon from '@assets/img/down_arrow.svg';
import { useState } from 'react';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';

const HIDE_MENU_DELAY = 200;

export const UserDropdown = () => {
  const { authUser } = useAuthContext();
  const { keycloak } = useKeycloak<KeycloakInstance>();

  const [showMenu, setShowMenu] = useState(false);

  const hideMenu = () => {
    setTimeout(() => setShowMenu(false), HIDE_MENU_DELAY);
  };

  if (!authUser) return null;

  return (
    <div className='relative'>
      <button className='flex' onClick={() => setShowMenu(!showMenu)} onBlur={hideMenu}>
        <div className='text-white'>{authUser?.name}</div>
        <img src={downArrowIcon.src} alt='down arrow' />
      </button>
      {showMenu && (
        <button
          className='absolute bg-white border w-full p-2 rounded mt-1 text-sm'
          onClick={() => keycloak?.logout()}
        >
          Logout
        </button>
      )}
    </div>
  );
};
