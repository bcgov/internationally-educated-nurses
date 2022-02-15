import React from 'react';
import { render, screen } from '@testing-library/react';
import { Checkbox, CheckboxArray } from '../../../src/components/form/Checkbox';
import { Formik } from 'formik';

describe('Checkbox', () => {
  it('should render', () => {
    const mock = jest.fn();
    const name = 'checkboxName';
    const label = 'checkboxLabel';

    render(
      <Formik initialValues={{ [name]: '' }} onSubmit={mock}>
        <Checkbox label={label} name={name} />
      </Formik>,
    );

    const checkBoxElement = screen.getByRole('checkbox');

    expect(checkBoxElement).toBeInTheDocument();
  });

  it('should render an accessible label', () => {
    const mock = jest.fn();
    const name = 'checkboxName';
    const label = 'checkboxLabel';

    render(
      <Formik initialValues={{ [name]: '' }} onSubmit={mock}>
        <Checkbox label={label} name={name} />
      </Formik>,
    );

    const checkBoxElement = screen.getByLabelText('checkboxLabel');

    expect(checkBoxElement).toBeInTheDocument();
  });
});

describe('CheckboxArray', () => {
  it('should render a fieldset and legend', () => {
    const mock = jest.fn();
    const name = 'checkboxName';
    const legendText = 'checkboxLabel';
    const testOptions = [{ value: 'testValue', label: 'testLabel' }];

    render(
      <Formik initialValues={{ [name]: '' }} onSubmit={mock}>
        <CheckboxArray name={name} legend={legendText} options={testOptions} />
      </Formik>,
    );

    const fieldsetElement = screen
      .getByText(/checkboxLabel/i, { selector: 'legend' })
      .closest('fieldset');
    const legendElement = screen.getByText(/checkboxLabel/i, { selector: 'legend' });

    expect(fieldsetElement).toBeInTheDocument();
    expect(legendElement).toBeInTheDocument();
  });

  it('should render a list of checkboxes', () => {
    const mock = jest.fn();
    const name = 'checkboxName';
    const legendText = 'checkboxLabel';
    const testOptions = [
      { value: 'testValue1', label: 'testLabel1' },
      { value: 'testValue2', label: 'testLabel2' },
      { value: 'testValue3', label: 'testLabel3' },
    ];

    render(
      <Formik initialValues={{ [name]: '' }} onSubmit={mock}>
        <CheckboxArray name={name} legend={legendText} options={testOptions} />
      </Formik>,
    );

    const checkboxElements = screen.getAllByRole('checkbox');

    expect(checkboxElements.length).toBe(testOptions.length);
  });

  it('should render a list of checkboxes with the same name', () => {
    const mock = jest.fn();
    const name = 'checkboxName';
    const legendText = 'checkboxLabel';
    const testOptions = [
      { value: 'testValue1', label: 'testLabel1' },
      { value: 'testValue2', label: 'testLabel2' },
      { value: 'testValue3', label: 'testLabel3' },
    ];

    render(
      <Formik initialValues={{ [name]: '' }} onSubmit={mock}>
        <CheckboxArray name={name} legend={legendText} options={testOptions} />
      </Formik>,
    );

    const checkboxElements = screen.getAllByRole('checkbox');

    checkboxElements.forEach(checkboxElement => {
      expect(checkboxElement).toHaveAttribute('name', name);
    });
  });

  it("should render a list of checkboxes with the option value as the checkbox's value", () => {
    const mock = jest.fn();
    const name = 'checkboxName';
    const legendText = 'checkboxLabel';
    const testOptions = [
      { value: 'testValue1', label: 'testLabel1' },
      { value: 'testValue2', label: 'testLabel2' },
      { value: 'testValue3', label: 'testLabel3' },
    ];

    render(
      <Formik initialValues={{ [name]: '' }} onSubmit={mock}>
        <CheckboxArray name={name} legend={legendText} options={testOptions} />
      </Formik>,
    );

    const checkboxElements = screen.getAllByRole('checkbox');

    checkboxElements.forEach((checkboxElement, index) => {
      expect(checkboxElement).toHaveAttribute('value', testOptions[index].value);
    });
  });

  // @todo test for form errors
});
