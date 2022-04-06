import { fireEvent, render, screen } from '@testing-library/react';
import { ApplicantTable } from '../../src/components/display/ApplicantTable';
import { ApplicantRO } from '@ien/common';

describe('ApplicantTable', () => {
  it('renders applicants table', () => {
    const mock = jest.fn();
    const applicants = [
      {
        id: '1',
        name: 'Jane Doe',
        status: {
          id: 1,
          status: 'IEN HMBC Process',
        },
      },
      {
        id: '2',
        name: 'Mark Twain',
        status: {
          id: 5,
          status: 'Final Milestone',
        },
      },
    ];
    const result = render(
      <ApplicantTable applicants={applicants as ApplicantRO[]} onSortChange={mock} />,
    );

    applicants.forEach(app => {
      expect(screen.getByText(app.status.status)).toBeInTheDocument();
      expect(screen.getByText(app.name)).toBeInTheDocument();
    });

    const sortKeyIds = ['#sort-by-id', '#sort-by-name'];
    sortKeyIds.forEach(key => {
      const button = result.container.querySelector(key);
      expect(button).toBeInTheDocument();
      button &&
        fireEvent(
          button,
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
          }),
        );
    });

    expect(mock.mock.calls.length).toBe(sortKeyIds.length);
  });
});
