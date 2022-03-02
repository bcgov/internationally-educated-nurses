import { Button } from '@components';

const Login = () => {
  return (
    <>
      <div className='container'>
        <h1 className='font-bold text-3xl py-5'>Login</h1>
        You are not logged in, you should probably do that
      </div>
      <Button variant={'submit'}>Login</Button>
    </>
  );
};

export default Login;
