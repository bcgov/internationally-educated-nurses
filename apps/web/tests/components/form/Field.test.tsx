import React from 'react';
import { Formik } from 'formik'; // package will be auto mocked
import { render, screen } from '@testing-library/react';
import { Field } from '../../../src/components/form/Field';

describe('FormError', () => {
  it('renders a text input element', () => {
    const mock = jest.fn();
    const fieldName = 'fieldName';
    const fieldType = 'text';
    const fieldLabel = 'field label';

    render(
      <Formik initialValues={{ [fieldName]: '' }} onSubmit={mock}>
        <Field name={fieldName} type={fieldType} label={fieldLabel} />
      </Formik>,
    );

    const inputElement = screen.getByRole('textbox');

    expect(inputElement).toBeInTheDocument();
  });

  it('renders a label element with the correct accessible association', () => {
    const mock = jest.fn();
    const fieldName = 'fieldName';
    const fieldType = 'text';
    const fieldLabel = 'field label';

    render(
      <Formik initialValues={{ [fieldName]: '' }} onSubmit={mock}>
        <Field name={fieldName} type={fieldType} label={fieldLabel} />
      </Formik>,
    );

    const labelElement = screen.getByText('field label');
    const inputElement = screen.getByRole('textbox');

    expect(labelElement).toBeInTheDocument();
    expect(inputElement).toHaveAccessibleName(fieldLabel);
  });

  it('renders a description element with the proper accessible association', () => {
    const mock = jest.fn();
    const fieldName = 'fieldName';
    const fieldType = 'text';
    const fieldLabel = 'field label';
    const fieldDescription = 'field format description';

    render(
      <Formik initialValues={{ [fieldName]: '' }} onSubmit={mock}>
        <Field
          name={fieldName}
          type={fieldType}
          label={fieldLabel}
          description={fieldDescription}
        />
      </Formik>,
    );

    const inputElement = screen.getByRole('textbox');
    const descriptionElement = screen.getByText('field format description');

    expect(descriptionElement).toBeInTheDocument();
    expect(inputElement).toHaveAccessibleDescription(fieldDescription);
  });

  it('renders an error when it exists in formik context', async () => {
    const mock = jest.fn();
    const fieldName = 'fieldName';
    const fieldType = 'text';
    const fieldLabel = 'field label';
    const fieldError = 'field error';

    render(
      <Formik
        initialValues={{ [fieldName]: '' }}
        initialTouched={{ [fieldName]: true }}
        initialErrors={{ [fieldName]: fieldError }}
        onSubmit={mock}
      >
        <Field name={fieldName} type={fieldType} label={fieldLabel} />
      </Formik>,
    );

    const alertContainer = await screen.findByRole('alert');

    expect(alertContainer).toBeInTheDocument();
    expect(alertContainer.firstChild).toHaveTextContent(fieldError);
  });
});
