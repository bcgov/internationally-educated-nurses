import React, { useState } from 'react';
import { Modal } from '../Modal';
import { EmployeeRO, ValidRoles } from '@ien/common';
import ReactSelect from 'react-select';
import { RoleOption, roleSelectOptions } from '@services';
import { Button, getSelectStyleOverride } from '@components';

interface ChangeRoleModalProps {
  open: boolean;
  user: EmployeeRO | null;
  submit: (role: ValidRoles) => void;
  closeModal: () => void;
}

export const ChangeRoleModal = ({ open, user, submit, closeModal }: ChangeRoleModalProps) => {
  const [role, setRole] = useState<ValidRoles | null>(null);

  const handleCancel = () => {
    setRole(null);
    closeModal();
  };

  return (
    <Modal open={open} handleClose={() => void 0}>
      <div className='pt-6 px-6'>
        <Modal.Title as='h1' className='text-xl font-bold leading-6 text-bcBlueLink'>
          Approve Access Request
        </Modal.Title>
        <div className='my-6 text-sm'>
          <div>
            <span>Username: </span>
            <b>{user?.name}</b>
          </div>
          <div>
            <span>Email address: </span>
            <b>{user?.email}</b>
          </div>
        </div>
        <div>
          <div className='text-sm'>* User Role</div>
          <ReactSelect<RoleOption>
            inputId='role-change'
            placeholder='Please select'
            value={roleSelectOptions.find(option => option.value === role)}
            onChange={value => value && setRole(value.value)}
            getOptionLabel={({ value }) => value}
            isOptionDisabled={({ value }) => value === user?.role}
            styles={getSelectStyleOverride<RoleOption>()}
            options={roleSelectOptions}
          />
        </div>
        <div className='flex flex-row justify-end mt-5 mb-2'>
          <Button className='ml-2 px-6 text-sm' onClick={handleCancel} variant='secondary'>
            Cancel
          </Button>

          <Button
            className='ml-2 px-6 text-sm'
            disabled={!role}
            onClick={() => role && submit(role)}
            variant='primary'
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
};
