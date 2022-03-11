import { Button } from '@components';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { useRouter } from 'next/router';

const Login = () => {
  const { push } = useRouter();
  const { keycloak } = useKeycloak<KeycloakInstance>();
  function login() {
    // Only bceid for now, but this can do IDIR and bceid without the idpHint
    if (keycloak) {
      push(keycloak?.createLoginUrl({ redirectUri: location.origin + '/' }) || '/');
    }
  }
  return (
    <>
      <div className='container'>
        <div className='w-full h-full flex items-center justify-center'>
          <div className='bg-bcLightBlueBackground rounded p-5'>
            <div>
              <h1 className='font-bold text-3xl'>Login</h1>
            </div>
            <div>
              Welcome to the Internationally Educated Nurses. To log in, please click the button
              below.
            </div>
            <div className='flex items-center justify-center'>
              <Button variant={'primary'} onClick={login}>
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
