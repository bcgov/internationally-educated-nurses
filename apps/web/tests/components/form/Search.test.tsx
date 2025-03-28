import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Search } from '../../../src/components/Search';

describe('Search', () => {
  it('renders a search box', async () => {
    const mock = jest.fn();
    const searchData = [
      { ats1_id: '111111', id: '1', name: 'Jane Doe', status: { id: 1, status: 'Recruitment' } },
      {
        ats1_id: '222222',
        id: '2',
        name: 'Mark Twain',
        status: { id: 5, status: 'Final Milestone' },
      },
    ];
    const search = async (): Promise<any[]> => searchData;

    render(<Search onChange={mock} onSelect={mock} keyword='' search={search} />);

    const input = screen.getByPlaceholderText('Search by first name, last name or ATS1 ID');
    expect(input).toBeInTheDocument();

    input.focus();
    fireEvent.change(input, { target: { value: 'Mark' } });
    for (const { name, ats1_id } of searchData) {
      await waitFor(() => {
        expect(screen.getByText(`${ats1_id} - ${name}`)).toBeInTheDocument();
      });
    }

    // TODO: search results should disappear, but don't
    // fireEvent.blur(input);
    // fireEvent.change(input, {target: {value: ""}});
    // await waitFor(() => {
    //   expect(screen.getAllByText('found in').length).toBe(0)
    // }, { timeout: 1000 });
  });
});
