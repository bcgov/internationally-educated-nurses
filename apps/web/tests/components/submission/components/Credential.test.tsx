import React from 'react';
import { render, screen } from '@testing-library/react';
import { Credential } from '../../../../src/components/submission/components/Credential';
import {
  defaultSpecialtyValue,
  registrationStatusOptions,
  healthAuthorityOptions,
  employmentOptions,
} from '../../../../src/components/submission/validation/credential';
import * as formik from 'formik';

const mockSetFieldValue = jest.fn();
Object.defineProperty(formik, 'useFormikContext', () => ({ setFieldValue: mockSetFieldValue }));

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {
      step: '3',
    },
  }),
}));

describe('Credential', () => {
  it('should render', () => {
    const mock = jest.fn();
    const initialValues = {
      credentialInformation: {
        stream: undefined,
        specialties: [defaultSpecialtyValue],
        currentEmployment: undefined,
      },
    };

    render(
      <formik.Formik initialValues={initialValues} onSubmit={mock}>
        <Credential />
      </formik.Formik>,
    );

    const headingElement = screen.getByRole('heading', { name: '3. Credentials Information' });

    expect(headingElement).toBeInTheDocument();
  });

  it('should render the expected fields ', async () => {
    const mockSubmit = jest.fn();
    const initialValues = {
      credentialInformation: {
        stream: undefined,
        specialties: [defaultSpecialtyValue],
        currentEmployment: undefined,
      },
    };

    render(
      <formik.Formik initialValues={initialValues} onSubmit={mockSubmit}>
        <Credential />
      </formik.Formik>,
    );

    expect(screen.getByRole('combobox', { name: 'Stream Type' })).toBeInTheDocument();
    registrationStatusOptions.forEach(label =>
      expect(screen.getByRole('radio', { name: label.label })).toBeInTheDocument(),
    );
    expect(
      screen.getByRole('group', {
        name: 'Select which best applies to your current registration status',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', {
        name: 'Select which best applies to your current employment status',
      }),
    ).toBeInTheDocument(),
      employmentOptions.forEach(label =>
        expect(screen.getByRole('radio', { name: label.label })).toBeInTheDocument(),
      );
  });

  it('should render health authority checkboxes when health authority employment is selected ', async () => {
    const mockSubmit = jest.fn();
    const initialValues = {
      credentialInformation: {
        stream: undefined,
        specialties: [defaultSpecialtyValue],
        currentEmployment: 'healthSectorEmployed',
      },
    };

    render(
      <formik.Formik initialValues={initialValues} onSubmit={mockSubmit}>
        <Credential />
      </formik.Formik>,
    );

    healthAuthorityOptions.forEach(label =>
      expect(screen.getByRole('checkbox', { name: label.label })).toBeInTheDocument(),
    );
  });
});
