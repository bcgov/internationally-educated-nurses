import { render, screen } from '@testing-library/react';
import { Pagination } from '@components';

describe('Pagination', () => {
  it('renders a pagination bar', async () => {
    const mock = jest.fn();

    const pageIndex = 3;
    const pageSize = 10;
    const total = 37;

    render(<Pagination id='test' pageOptions={{ pageIndex, pageSize, total }} onChange={mock} />);

    const start = pageSize * (pageIndex - 1) + 1;
    const end = pageSize * pageIndex < total ? pageSize * pageIndex : total;
    expect(screen.getByText(`${start} - ${end} of ${total} items`)).toBeInTheDocument();
    expect(screen.getByText(`of ${Math.ceil(total / pageSize)} pages`)).toBeInTheDocument();
  });
});
