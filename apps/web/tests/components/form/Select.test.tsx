import React from 'react';
import { Formik } from 'formik';
import { render, screen } from '@testing-library/react';
import { Select, Option } from '../../../src/components/form/Select';

describe('Select', () => {
  it('renders a select', () => {
    const mock = jest.fn();
    const testSelectName = 'input-id';
    const testSelectText = 'Select text';

    render(
      <Formik initialValues={{ [testSelectName]: '' }} onSubmit={mock}>
        <Select name={testSelectName} label={testSelectText} />
      </Formik>,
    );

    const selectElement = screen.getByRole('listbox');

    expect(selectElement).toBeInTheDocument();
  });

  it('renders a label element with the correct accessible association', () => {
    const mock = jest.fn();
    const selectName = 'selectName';
    const selectType = 'text';
    const selectLabel = 'select label';

    render(
      <Formik initialValues={{ [selectName]: '' }} onSubmit={mock}>
        <Select name={selectName} type={selectType} label={selectLabel} />
      </Formik>,
    );

    const labelElement = screen.getByText('select label');
    const selectElement = screen.getByRole('listbox');

    expect(labelElement).toBeInTheDocument();
    expect(selectElement).toHaveAccessibleName(selectLabel);
  });

  it('renders a description element with the proper accessible association', () => {
    const mock = jest.fn();
    const selectName = 'selectName';
    const selectType = 'text';
    const selectLabel = 'select label';
    const selectDescription = 'field format description';

    render(
      <Formik initialValues={{ [selectName]: '' }} onSubmit={mock}>
        <Select
          name={selectName}
          type={selectType}
          label={selectLabel}
          description={selectDescription}
        />
      </Formik>,
    );
    const selectElement = screen.getByRole('listbox');
    const descriptionElement = screen.getByText('field format description');

    expect(descriptionElement).toBeInTheDocument();
    expect(selectElement).toHaveAccessibleDescription(selectDescription);
  });

  describe('Option', () => {
    it('renders an option', () => {
      const testValue = 'input-id';
      const testLabel = 'Select text';

      render(<Option value={testValue} label={testLabel} />);

      const optionElement = screen.getByRole('option');

      expect(optionElement).toBeInTheDocument();
    });

    it('renders an disabled and hidden option', () => {
      const testValue = 'input-id';
      const testLabel = 'Select text';

      render(<Option value={testValue} label={testLabel} disabled={true} />);

      const optionElement = screen.getByText('Select text');

      expect(optionElement).toHaveAttribute('disabled', '');
      expect(optionElement).toHaveAttribute('hidden', '');
    });
  });
});
