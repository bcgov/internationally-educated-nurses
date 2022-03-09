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
// withAuth ensures only authenticated users with a given role are permitted to use a route
// I have included the pending role here not to lock out any user, but in future most routes should be restricted
export default withAuth(Form, [
  ValidRoles.PENDING,
  ValidRoles.MINISTRY_OF_HEALTH,
  ValidRoles.HEALTH_MATCH,
]);
