import React from 'react';
import { render, screen } from '@testing-library/react';
import { Radio } from '../../../src/components/form/Radio';
import { Formik } from 'formik';

describe('Radio', () => {
  it('should render a fieldset and legend', () => {
    const mock = jest.fn();
    const name = 'radioName';
    const legendText = 'radioLegend';
    const testOptions = [{ value: 'testValue', label: 'testlegend' }];

    render(
      <Formik initialValues={{ [name]: '' }} onSubmit={mock}>
        <Radio name={name} legend={legendText} options={testOptions} />
      </Formik>,
    );

    const fieldsetElement = screen
      .getByText(/radiolegend/i, { selector: 'legend' })
      .closest('fieldset');
    const legendElement = screen.getByText(/radiolegend/i, { selector: 'legend' });

    expect(fieldsetElement).toBeInTheDocument();
    expect(legendElement).toBeInTheDocument();
  });

  it('should render a list of radio elements', () => {
    const mock = jest.fn();
    const name = 'radioName';
    const legendText = 'radiolegend';
    const testOptions = [
      { value: 'testValue1', label: 'testlegend1' },
      { value: 'testValue2', label: 'testlegend2' },
      { value: 'testValue3', label: 'testlegend3' },
    ];

    render(
      <Formik initialValues={{ [name]: '' }} onSubmit={mock}>
        <Radio name={name} legend={legendText} options={testOptions} />
      </Formik>,
    );

    const radioElements = screen.getAllByRole('radio');

    expect(radioElements.length).toBe(testOptions.length);
  });
});
