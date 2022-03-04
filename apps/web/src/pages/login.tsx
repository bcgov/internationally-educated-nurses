import { Button } from '@components';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { useRouter } from 'next/router';

const Login = () => {
  const { push } = useRouter();
  const { keycloak } = useKeycloak<KeycloakInstance>();
  function login() {
    // Only bceid for now, but this can do IDIR and bceid without the idpHint
    console.log(keycloak);
    if (keycloak) {
      push(keycloak?.createLoginUrl({ redirectUri: location.origin + '/' }) || '/');
    }
  }
  return (
    <>
      <div className='container'>
        <div>
          <h1 className='font-bold text-3xl py-5'>Login</h1>
          You are not logged in, you should probably do that...
        </div>
        <div>
          <Button variant={'submit'} onClick={login}>
            Login
          </Button>
        </div>
      </div>
    </>
  );
};

export default Login;
