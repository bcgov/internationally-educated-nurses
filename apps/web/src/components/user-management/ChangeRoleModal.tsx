import React, { ChangeEvent, useState } from 'react';
import { Modal } from '../Modal';
import { EmployeeRO, ValidRoles } from '@ien/common';
import ReactSelect from 'react-select';
import { ChangeRoleOption, roleSelectOptions } from '@services';
import { Button, getSelectStyleOverride } from '@components';
import closeIcon from '@assets/img/close.svg';

interface ChangeRoleModalProps {
  open: boolean;
  user: EmployeeRO | null;
  submit: (user: EmployeeRO, role: ValidRoles | string) => void;
  revoke: (user: EmployeeRO) => void;
  closeModal: () => void;
}

const roleOptions = roleSelectOptions.filter(o => o.value !== ValidRoles.PENDING);
const revokeOption = {
  value: 'revoke',
  label: 'Revoke Access',
  style: {
    color: '#D8292F',
    borderTop: '1px solid gray',
    paddingBottom: '6px',
  },
};

export const ChangeRoleModal = ({
  open,
  user,
  submit,
  revoke,
  closeModal,
}: ChangeRoleModalProps) => {
  const [role, setRole] = useState<ValidRoles | string>('');
  const [confirmText, setConfirmText] = useState('');

  const reset = () => {
    setRole('');
    setConfirmText('');
  };

  const handleCancel = () => {
    reset();
    closeModal();
  };

  const handleCheckChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmText(e.target.value);
  };

  const handleSubmit = () => {
    if (!user) return;
    if (role === 'revoke') {
      revoke(user);
    } else {
      submit(user, role);
    }
    reset();
  };

  return (
    <Modal open={open} handleClose={() => setConfirmText('')}>
      <div className='pt-5 px-5 '>
        <Modal.Title as='h1' className='text-xl leading-6 text-bcBlueLink'>
          <div className='flex flex-row justify-between pb-4'>
            <div>Change Role/Access</div>
            <button onClick={handleCancel} data-cy='close'>
              <img src={closeIcon.src} alt='close' width={16} height={16} />
            </button>
          </div>
          <hr className='h-0.5 bg-bcGray' />
        </Modal.Title>
        <div className='my-6'>
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
          <div className='mb-1'>User Role</div>
          <ReactSelect<ChangeRoleOption>
            inputId='role-change'
            placeholder='Role'
            onChange={value => value && setRole(value.value)}
            isOptionDisabled={({ value }) => value === user?.role}
            styles={getSelectStyleOverride<ChangeRoleOption>()}
            options={
              user?.role === ValidRoles.PENDING ? roleOptions : [...roleOptions, revokeOption]
            }
            className='placeholder-bcGray'
          />
        </div>
        {role === 'revoke' && (
          <>
            <p className='text-bcGray my-4'>
              A revoked user will not be able to access the application.
            </p>
            <div className='bg-bcLightGray p-3'>
              <p className='text-bcGray mb-2'>
                Please type <strong>revoke-access</strong> to confirm.
              </p>
              <input
                type='text'
                id='confirm-text'
                className='w-full border rounded border-bcGray p-1.5'
                onChange={handleCheckChange}
              />
            </div>
            <hr className='h-0.5 bg-bcGray mt-5' />
          </>
        )}
        <div className='flex flex-row justify-between my-5'>
          <Button className='ml-2 px-6 w-40' onClick={handleCancel} variant='secondary'>
            Cancel
          </Button>

          <Button
            className='ml-2 px-6 text-sm w-40'
            disabled={!role || (role === 'revoke' && confirmText !== 'revoke-access')}
            onClick={handleSubmit}
            variant='primary'
          >
            {role === 'revoke' ? 'Confirm' : 'Approve'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
