import React from 'react';
import { Formik } from 'formik';
import { render, screen } from '@testing-library/react';
import { MultiSelect } from '@components';

describe('MultiSelect', () => {
  it('renders a select', () => {
    const mock = jest.fn();
    const testSelectName = 'input-id';
    const testSelectText = 'Select text';
    const testOptions = [{ value: 'testValue', label: 'testLabel' }];

    render(
      <Formik initialValues={{ [testSelectName]: '' }} onSubmit={mock}>
        <MultiSelect name={testSelectName} label={testSelectText} options={testOptions} />
      </Formik>,
    );

    const selectElement = screen.getByRole('combobox');

    expect(selectElement).toBeInTheDocument();
  });

  it('renders a label element with the correct accessible association', () => {
    const mock = jest.fn();
    const selectName = 'selectName';
    const selectType = 'text';
    const selectLabel = 'select label';
    const testOptions = [{ value: 'testValue', label: 'testLabel' }];

    render(
      <Formik initialValues={{ [selectName]: '' }} onSubmit={mock}>
        <MultiSelect
          name={selectName}
          type={selectType}
          label={selectLabel}
          options={testOptions}
        />
      </Formik>,
    );

    const labelElement = screen.getByText('select label');
    const selectElement = screen.getByRole('combobox');

    expect(labelElement).toBeInTheDocument();
    expect(selectElement).toHaveAccessibleName(selectLabel);
  });
});
