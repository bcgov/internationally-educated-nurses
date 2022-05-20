import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { useRouter } from 'next/router';
import { Spinner } from '../components/Spinner';

const Login = () => {
  const { push } = useRouter();
  const { keycloak, initialized } = useKeycloak<KeycloakInstance>();

  if (!initialized || keycloak?.authenticated === undefined) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        <Spinner className='h-10 w-10' />
      </div>
    );
  } else if (keycloak.authenticated) {
    push('/');
    return '';
  }

  function login() {
    if (keycloak) {
      push(keycloak?.createLoginUrl({ redirectUri: location.origin + '/' }) || '/');
    }
  }
  return (
    <div className='container'>
      <div className='w-full h-full flex items-center justify-center'>
        {initialized}
        <div className='flex flex-col items-center justify-center bg-bcLightBlueBackground rounded py-6 px-24'>
          <h1 className='font-bold text-4xl mb-3'>Login</h1>
          <div className='text-center mb-7'>
            <p>Welcome to the Internationally Educated Nurses.</p>
            <p>To log in, please click the button below</p>
          </div>
          <button
            className='bg-bcBluePrimary h-12 w-24 text-white font-bold rounded'
            onClick={login}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
