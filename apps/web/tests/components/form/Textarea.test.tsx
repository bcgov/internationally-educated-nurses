import React from 'react';
import { render, screen } from '@testing-library/react';
import { Textarea } from '../../../src/components/form/Textarea';
import { Formik } from 'formik';

describe('Textarea', () => {
  it('should render', () => {
    const mock = jest.fn();
    const name = 'testName';
    const label = 'testLabel';

    render(
      <Formik initialValues={{ [name]: '' }} onSubmit={mock}>
        <Textarea name={name} label={label} />
      </Formik>,
    );

    const textareaElement = screen.getByRole('textbox');

    expect(textareaElement).toBeInTheDocument();
  });

  it('should render an accessible label with the label prop', () => {
    const mock = jest.fn();
    const name = 'testName';
    const label = 'testLabel';

    render(
      <Formik initialValues={{ [name]: '' }} onSubmit={mock}>
        <Textarea name={name} label={label} />
      </Formik>,
    );

    const labelElement = screen.getByLabelText(label);

    expect(labelElement).toBeInTheDocument();
  });

  it('should render an accessible description with the description prop', () => {
    const mock = jest.fn();
    const name = 'testName';
    const label = 'testLabel';
    const description = 'testDescription';

    render(
      <Formik initialValues={{ [name]: '' }} onSubmit={mock}>
        <Textarea name={name} label={label} description={description} />
      </Formik>,
    );

    const textareaElement = screen.getByRole('textbox');
    expect(textareaElement).toHaveAccessibleDescription(description);
  });

  it('should render an accessible alert when the character limit is reached', () => {
    const mock = jest.fn();
    const name = 'testName';
    const label = 'testLabel';
    const description = 'testDescription';
    const value = 'aaaaa';
    const maxLength = value.length;

    render(
      <Formik initialValues={{ [name]: value }} onSubmit={mock}>
        <Textarea name={name} label={label} maxLength={maxLength} description={description} />
      </Formik>,
    );

    const maxLengthAlertElement = screen.getByText(
      /Text area character limit reached. You can only use 5 characters in this field./,
      { selector: 'p' },
    );

    expect(maxLengthAlertElement).toBeInTheDocument();
    expect(maxLengthAlertElement).toHaveAttribute('role', 'alert');
  });

  it('should render a visual, non-sr character counter', () => {
    const mock = jest.fn();
    const name = 'testName';
    const label = 'testLabel';
    const description = 'testDescription';
    const value = 'aaaaa';
    const maxLength = 10;

    render(
      <Formik initialValues={{ [name]: value }} onSubmit={mock}>
        <Textarea name={name} label={label} maxLength={maxLength} description={description} />
      </Formik>,
    );

    const characterCounterElement = screen.getByText(/5\/10/, { selector: 'p' });

    expect(characterCounterElement).toBeInTheDocument();
    expect(characterCounterElement).toHaveAttribute('aria-hidden', 'true');
  });
});
