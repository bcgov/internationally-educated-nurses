import { ValidRoles } from '@services';
import { Table } from 'src/components/display/Table';
import withAuth from 'src/components/Keycloak';

const Form = () => {
  return (
    <>
      <Table />
    </>
  );
};

export default withAuth(Form, [ValidRoles.MINISTRY_OF_HEALTH, ValidRoles.HEALTH_MATCH]);
