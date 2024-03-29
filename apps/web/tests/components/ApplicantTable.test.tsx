import { fireEvent, render, screen } from '@testing-library/react';
import { ApplicantRO } from '@ien/common';
import { ApplicantTable } from '@components';

describe('ApplicantTable', () => {
  it('renders applicants table', () => {
    const mock = jest.fn();
    const applicants: ApplicantRO[] = [
      {
        id: '1',
        name: 'Jane Doe',
        status: {
          id: '1',
          status: 'IEN HMBC Process',
        },
        is_open: true,
        added_by: null,
      },
      {
        id: '2',
        name: 'Mark Twain',
        status: {
          id: '5',
          status: 'Final Milestone',
        },
        is_open: true,
        added_by: null,
      },
    ];
    const result = render(
      <ApplicantTable applicants={applicants as ApplicantRO[]} onSortChange={mock} />,
    );

    applicants.forEach(app => {
      expect(screen.getByText(app.name)).toBeInTheDocument();
    });

    const sortKeyIds = ['name', 'updated_date'];
    sortKeyIds.forEach(key => {
      const button = result.container.querySelector(`#sort-by-${key}`);
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
