import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Error } from '../../../src/components/form/Error';
import { Field, Formik } from 'formik';

describe('FormError', () => {
  it('renders an empty alert when no associated error exists', () => {
    const mockSubmit = jest.fn();
    const fieldName = 'fieldName';

    render(
      <Formik initialValues={{ [fieldName]: '' }} onSubmit={mockSubmit}>
        <Error name={fieldName} />
      </Formik>,
    );
    const alertContainer = screen.queryByRole('alert');

    expect(alertContainer).toBeNull();
  });

  it('renders no children when no associated error exists', () => {
    const mockSubmit = jest.fn();
    const fieldName = 'fieldName';

    render(
      <Formik initialValues={{ [fieldName]: '' }} onSubmit={mockSubmit}>
        <Error name={fieldName} />
      </Formik>,
    );
    const alertContainer = screen.queryByRole('alert');

    expect(alertContainer).toBeNull();
  });

  it('renders an alert when an associated error is present', async () => {
    const mockSubmit = jest.fn();
    const fieldName = 'fieldName';
    const errorText = 'error text';

    render(
      <Formik
        initialValues={{ [fieldName]: '' }}
        validate={() => {
          return { [fieldName]: errorText };
        }}
        onSubmit={mockSubmit}
      >
        <>
          <Field name={fieldName} />
          <Error name={fieldName} />
        </>
      </Formik>,
    );

    const input = screen.getByRole('textbox');

    fireEvent.blur(input);

    const alertContainer = await screen.findByRole('alert');

    expect(alertContainer).toBeInTheDocument();
    expect(alertContainer.firstChild).toHaveTextContent(errorText);
  });
});
